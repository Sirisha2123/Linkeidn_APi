import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { fetchAdditionalProfileInfo } from '@/lib/linkedin';

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Connect to MongoDB
    console.log('Connected to MongoDB');
    const { db } = await connectToDatabase();

    // Get the latest profile
    const profile = await db.collection('profiles').findOne(
      {},
      { sort: { createdAt: -1 } }
    );

    if (!profile) {
      return NextResponse.json(
        { error: 'No profile found. Please sign in first.' },
        { status: 401 }
      );
    }

    if (!profile.accessToken) {
      return NextResponse.json(
        { error: 'No access token found. Please sign in again.' },
        { status: 401 }
      );
    }

    try {
      // Fetch additional profile information using the access token
      const additionalProfileInfo = await fetchAdditionalProfileInfo(profile.accessToken);

      // Combine the profile data
      const completeProfile = {
        ...profile,
        ...additionalProfileInfo,
        // Remove sensitive information
        accessToken: undefined,
        refreshToken: undefined
      };

      return NextResponse.json(completeProfile);
    } catch (error: any) {
      console.error('Error fetching LinkedIn profile:', error);
      // If LinkedIn API fails, return the basic profile from MongoDB
      return NextResponse.json({
        ...profile,
        accessToken: undefined,
        refreshToken: undefined
      });
    }
  } catch (error: any) {
    console.error('Error in profile API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
} 