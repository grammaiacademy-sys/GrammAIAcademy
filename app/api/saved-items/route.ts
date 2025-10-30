import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'cosmic-authentication';
import { db } from 'cosmic-database';

export async function GET() {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user's saved items
    const snapshot = await db.collection('savedItems')
      .where('userId', '==', user.uid)
      .get();
    
    const savedItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ savedItems });
  } catch (error) {
    console.error('Error fetching saved items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { lineItemId, lineItem } = await request.json();
    
    // Check if already saved
    const existingSnapshot = await db.collection('savedItems')
      .where('userId', '==', user.uid)
      .where('lineItemId', '==', lineItemId)
      .limit(1)
      .get();
    
    if (!existingSnapshot.empty) {
      return NextResponse.json({ error: 'Item already saved' }, { status: 400 });
    }
    
    const savedItem = {
      userId: user.uid,
      lineItemId,
      lineItem,
      savedAt: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    };
    
    const docRef = await db.collection('savedItems').add(savedItem);
    
    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      savedItem: { id: docRef.id, ...savedItem }
    });
  } catch (error) {
    console.error('Error saving item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const savedItemId = searchParams.get('id');
    
    if (!savedItemId) {
      return NextResponse.json({ error: 'Saved item ID required' }, { status: 400 });
    }
    
    // Verify ownership before deleting
    const doc = await db.collection('savedItems').doc(savedItemId).get();
    if (!doc.exists || doc.data()?.userId !== user.uid) {
      return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
    }
    
    await db.collection('savedItems').doc(savedItemId).delete();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}