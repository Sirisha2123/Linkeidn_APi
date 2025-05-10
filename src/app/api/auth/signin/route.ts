import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getLinkedInAuthUrl } from '@/lib/linkedin';

export async function POST() {
  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    console.log('Connected to MongoDB');

    // Update the profile status in MongoDB
    await db.collection('profiles').updateMany(
      {},
      { 
        $set: { 
          isSignedOut: false,
          lastSignInAt: new Date()
        }
      }
    );

    console.log('Updated profile sign-in status in MongoDB');

    return NextResponse.json(
      { message: 'Successfully signed in' },
      { 
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    );
  } catch (error: any) {
    console.error('Error during sign-in:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sign in' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const authUrl = getLinkedInAuthUrl();
    return NextResponse.json({ url: authUrl });
  } catch (error: any) {
    console.error('Error generating LinkedIn auth URL:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate sign-in URL' },
      { status: 500 }
    );
  }
} 