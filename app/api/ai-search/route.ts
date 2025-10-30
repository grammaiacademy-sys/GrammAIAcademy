import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'cosmic-authentication';
import { db } from 'cosmic-database';

// Simple keyword matching for AI search simulation
// In production, this would call OpenAI/Anthropic/Google APIs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function simulateAISearch(query: string, lineItems: any[]) {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  const results = lineItems.map(item => {
    let score = 0;
    const searchableText = `${item.description} ${item.keywords.join(' ')} ${item.category}`.toLowerCase();
    
    // Check for direct matches
    searchTerms.forEach(term => {
      if (searchableText.includes(term)) {
        score += 10;
      }
      
      // Partial matches
      if (searchableText.includes(term.substring(0, -1))) {
        score += 5;
      }
    });
    
    // Boost score for category matches
    if (query.toLowerCase().includes(item.category.toLowerCase())) {
      score += 15;
    }
    
    // Boost score for exact description matches
    if (item.description.toLowerCase().includes(query.toLowerCase())) {
      score += 20;
    }
    
    return { ...item, searchScore: score };
  }).filter(item => item.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore);
  
  return results;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { query, category } = await request.json();
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 });
    }
    
    // Get line items from database
    let snapshot;
    
    if (category && category !== 'all') {
      snapshot = await db.collection('lineItems')
        .where('category', '==', category)
        .limit(1000)
        .get();
    } else {
      snapshot = await db.collection('lineItems')
        .limit(1000)
        .get();
    }
    
    const lineItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Simulate AI-powered search
    const searchResults = simulateAISearch(query, lineItems);
    
    // In production, you would call your AI provider here:
    // const aiResponse = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are an expert in Xactimate line items for restoration projects..."
    //     },
    //     {
    //       role: "user",
    //       content: `Find the best matching line items for: "${query}" in category: "${category}"`
    //     }
    //   ]
    // });
    
    // Log search for analytics (optional)
    await db.collection('searchLogs').add({
      userId: user.uid,
      query,
      category: category || 'all',
      resultsCount: searchResults.length,
      timestamp: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    });
    
    return NextResponse.json({ 
      results: searchResults.slice(0, 50), // Limit to top 50 results
      query,
      category,
      totalResults: searchResults.length 
    });
  } catch (error) {
    console.error('Error performing AI search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}