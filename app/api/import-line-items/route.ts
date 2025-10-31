import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'cosmic-authentication';
import { db } from 'cosmic-database';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

const FILES_BASE = C:\Users\brett\OneDrive\Desktop;

function normalizeDescription(input: string): string {
  return (input || '').replace(/\s+/g, ' ').trim();
}

function normalizeUpper(input: string): string {
  return (input || '').toString().trim().toUpperCase();
}

function tokensFrom(row: { sel: string; act: string; description: string; unit: string }): string[] {
  const base = `${row.sel} ${row.act} ${row.description} ${row.unit}`.toLowerCase();
  const words = base.replace(/[^a-z0-9\s]+/g, ' ').split(/\s+/).filter(t => t.length > 1);
  const uniq = Array.from(new Set(words));
  return uniq.slice(0, 50);
}

function hashString(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

async function upsertLineItems(rows: Array<{ sel: string; act: string; description: string; unit: string; source_sheet?: string }>) {
  const batch = db.batch();
  let processed = 0;

  for (const row of rows) {
    const sel = normalizeUpper(row.sel);
    const unit = normalizeUpper(row.unit);
    const description = normalizeDescription(row.description);
    const act = (row.act || '').toString().trim();

    const uniqueKey = `${sel}__${act}__${description.toUpperCase()}`;
    const docId = hashString(uniqueKey);

    const docRef = db.collection('line_items').doc(docId);
    const data = {
      sel,
      act,
      description,
      unit,
      sel_normalized: sel,
      search_tokens: tokensFrom({ sel, act, description, unit }),
      source_sheet: row.source_sheet || null,
      uniqueKey,
      updatedAt: db.FieldValue.serverTimestamp(),
    } as const;

    // Merge (upsert)
    batch.set(docRef, {
      ...data,
      createdAt: db.FieldValue.serverTimestamp(),
    }, { merge: true });

    processed++;

    // Commit in chunks of 400 to stay under limits
    if (processed % 400 === 0) {
      await batch.commit();
    }
  }

  // Commit remaining
  await batch.commit();

  return { processed };
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Restrict importer to project owner account
    if (user.uid !== process.env.USER_ID) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const body = await request.json();
    const fileId: string | null = body?.fileId || null;
    if (!fileId) {
      return NextResponse.json({ error: 'fileId required' }, { status: 400 });
    }

    const userId = process.env.USER_ID as string;
    const projectId = process.env.NEXT_PUBLIC_CLIENT_ID as string;
    const fileUrl = `${FILES_BASE}/${encodeURIComponent(userId)}/${encodeURIComponent(projectId)}?fileId=${encodeURIComponent(fileId)}`;

    const res = await fetch(fileUrl);
    if (!res.ok) {
      return NextResponse.json({ error: 'Unable to download file' }, { status: 400 });
    }

    const contentType = res.headers.get('content-type') || '';
    const buffer = new Uint8Array(await res.arrayBuffer());

    const allRows: Array<{ sel: string; act: string; description: string; unit: string; source_sheet?: string }> = [];

    if (contentType.includes('spreadsheetml')) {
      // XLSX
      const wb = XLSX.read(buffer, { type: 'array' });
      for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        const sheetRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '' });
        for (const r of sheetRows) {
          const sel = (r['SEL'] ?? r['sel'] ?? '') as string;
          const act = (r['ACT'] ?? r['act'] ?? '') as string;
          const description = (r['DESCRIPTION'] ?? r['Description'] ?? r['description'] ?? '') as string;
          const unit = (r['UNIT'] ?? r['unit'] ?? '') as string;
          if (sel || act || description || unit) {
            allRows.push({ sel, act, description, unit, source_sheet: sheetName });
          }
        }
      }
    } else {
      // CSV (assume UTF-8, comma or tab). We will let parser auto-detect delimiter if possible.
      const text = new TextDecoder('utf-8').decode(buffer);
      const records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        delimiter: undefined
      }) as Array<Record<string, string>>;

      for (const r of records) {
        const sel = (r['SEL'] ?? r['sel'] ?? '') as string;
        const act = (r['ACT'] ?? r['act'] ?? '') as string;
        const description = (r['DESCRIPTION'] ?? r['Description'] ?? r['description'] ?? '') as string;
        const unit = (r['UNIT'] ?? r['unit'] ?? '') as string;
        if (sel || act || description || unit) {
          allRows.push({ sel, act, description, unit });
        }
      }
    }

    if (allRows.length === 0) {
      return NextResponse.json({ error: 'No rows detected. Ensure headers are SEL, ACT, DESCRIPTION, UNIT.' }, { status: 400 });
    }

    const startedAt = Date.now();
    const { processed } = await upsertLineItems(allRows);

    await db.collection('import_logs').add({
      userId: user.uid,
      fileId,
      rowsDetected: allRows.length,
      rowsProcessed: processed,
      durationMs: Date.now() - startedAt,
      timestamp: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, rowsDetected: allRows.length, rowsProcessed: processed });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
