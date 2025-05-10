import { NextResponse } from 'next/server';
import { getLinkedInSignOutUrl } from '@/lib/linkedin';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    // Connect to MongoDB
    console.log('Connected to MongoDB');
    const { db } = await connectToDatabase();

    // Update the profile's sign-out status in MongoDB
    await db.collection('profiles').updateOne(
      { isSignedIn: true },
      { $set: { isSignedIn: false } }
    );
    console.log('Updated profile sign-out status in MongoDB');

    // Get the LinkedIn sign-out URL
    const signOutUrl = getLinkedInSignOutUrl();

    // Redirect to the main page after successful sign-out
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Error during sign-out:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
} 