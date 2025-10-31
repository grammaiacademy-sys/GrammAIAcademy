import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'cosmic-authentication';
import { db } from 'cosmic-database';

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1)
    .slice(0, 10);
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { query } = await request.json();
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 });
    }

    const tokens = tokenize(query);

    // Single-field query using array-contains-any to avoid composite indexes
    const snapshot = tokens.length > 0
      ? await db.collection('line_items')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .where('search_tokens' as any, 'array-contains-any', tokens)
          .limit(100)
          .get()
      : await db.collection('line_items').limit(50).get();

    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Lightweight scoring based on token overlap
    const scored = items.map((item: { description: string; sel?: string; act?: string; unit?: string; search_tokens?: string[]; id: string; }) => {
      const allText = `${item.description || ''} ${item.sel || ''} ${item.act || ''} ${item.unit || ''}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (allText.includes(t)) score += 2;
        if ((item.search_tokens || []).includes(t)) score += 1;
      }
      return { ...item, score };
    })
    .filter(i => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

    // Log search
    await db.collection('search_logs').add({
      userId: user.uid,
      query,
      tokens,
      resultsCount: scored.length,
      timestamp: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ results: scored });
  } catch (error) {
    console.error('Error performing AI search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}