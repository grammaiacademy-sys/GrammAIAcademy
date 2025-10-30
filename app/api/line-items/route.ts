import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'cosmic-authentication';
import { db } from 'cosmic-database';

// Sample line items data for seeding/demo
const sampleLineItems = [
  {
    id: 'WTR001',
    category: 'Water',
    description: 'Water extraction - carpet and pad',
    unitOfMeasure: 'SF',
    unitPrice: 2.45,
    laborPrice: 1.25,
    materialPrice: 1.20,
    keywords: ['water', 'extraction', 'carpet', 'pad', 'removal'],
  },
  {
    id: 'WTR002', 
    category: 'Water',
    description: 'Drywall removal - water damaged',
    unitOfMeasure: 'SF',
    unitPrice: 3.15,
    laborPrice: 2.20,
    materialPrice: 0.95,
    keywords: ['drywall', 'removal', 'water', 'damaged', 'demolition'],
  },
  {
    id: 'FIR001',
    category: 'Fire',
    description: 'Smoke damage cleaning - walls',
    unitOfMeasure: 'SF',
    unitPrice: 4.25,
    laborPrice: 3.50,
    materialPrice: 0.75,
    keywords: ['smoke', 'damage', 'cleaning', 'walls', 'fire', 'restoration'],
  },
  {
    id: 'FIR002',
    category: 'Fire',
    description: 'Soot removal and HEPA vacuuming',
    unitOfMeasure: 'SF',
    unitPrice: 2.85,
    laborPrice: 2.10,
    materialPrice: 0.75,
    keywords: ['soot', 'removal', 'hepa', 'vacuum', 'fire', 'cleanup'],
  },
  {
    id: 'MLD001',
    category: 'Mold',
    description: 'Mold remediation - drywall',
    unitOfMeasure: 'SF',
    unitPrice: 5.75,
    laborPrice: 4.25,
    materialPrice: 1.50,
    keywords: ['mold', 'remediation', 'drywall', 'removal', 'abatement'],
  },
  {
    id: 'MLD002',
    category: 'Mold',
    description: 'Antimicrobial treatment application',
    unitOfMeasure: 'SF',
    unitPrice: 1.95,
    laborPrice: 1.20,
    materialPrice: 0.75,
    keywords: ['antimicrobial', 'treatment', 'application', 'mold', 'prevention'],
  },
  {
    id: 'RBD001',
    category: 'Rebuild',
    description: 'Drywall installation - 1/2 inch',
    unitOfMeasure: 'SF',
    unitPrice: 2.25,
    laborPrice: 1.50,
    materialPrice: 0.75,
    keywords: ['drywall', 'installation', 'rebuild', 'construction', 'half', 'inch'],
  },
  {
    id: 'RBD002',
    category: 'Rebuild',
    description: 'Paint primer and finish - interior walls',
    unitOfMeasure: 'SF',
    unitPrice: 1.85,
    laborPrice: 1.20,
    materialPrice: 0.65,
    keywords: ['paint', 'primer', 'finish', 'interior', 'walls', 'rebuild'],
  },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
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
    
    let lineItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // If no items in database, seed with sample data
    if (lineItems.length === 0) {
      console.log('No line items found, seeding database...');
      const batch = db.batch();
      
      for (const item of sampleLineItems) {
        const docRef = db.collection('lineItems').doc();
        batch.set(docRef, {
          ...item,
          createdAt: db.FieldValue.serverTimestamp(),
          updatedAt: db.FieldValue.serverTimestamp(),
        });
      }
      
      await batch.commit();
      
      // Refetch after seeding
      const newSnapshot = await db.collection('lineItems').limit(1000).get();
      lineItems = newSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
    
    // Apply search filter if provided
    if (search) {
      const searchTerm = search.toLowerCase();
      lineItems = lineItems.filter(item => 
        item.description.toLowerCase().includes(searchTerm) ||
        item.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchTerm)) ||
        item.id.toLowerCase().includes(searchTerm)
      );
    }
    
    return NextResponse.json({ lineItems });
  } catch (error) {
    console.error('Error fetching line items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const data = await request.json();
    
    const lineItem = {
      ...data,
      createdAt: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    };
    
    const docRef = await db.collection('lineItems').add(lineItem);
    
    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      lineItem: { id: docRef.id, ...lineItem }
    });
  } catch (error) {
    console.error('Error creating line item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}