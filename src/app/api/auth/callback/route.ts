import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import axios from 'axios';

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';
const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = 'https://linkeidn-a-pi.vercel.app/api/auth/callback';

if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) {
  throw new Error('LinkedIn credentials are not properly configured');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('LinkedIn OAuth error:', error);
      return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error)}`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/?error=No authorization code received', request.url));
    }

    console.log('Received authorization code from LinkedIn');

    // Exchange the code for an access token
const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', new URLSearchParams({
  grant_type: 'authorization_code',
  code,
  client_id: LINKEDIN_CLIENT_ID,
  client_secret: LINKEDIN_CLIENT_SECRET,
  redirect_uri: LINKEDIN_REDIRECT_URI,
}).toString(), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}).catch(error => {
  console.error('LinkedIn OAuth Error:', error.response ? error.response.data : error.message);
  throw new Error('Failed to exchange code for token');
});


    console.log('Successfully obtained access token');

    const { access_token, expires_in, refresh_token } = tokenResponse.data;

    // Connect to MongoDB
    console.log('Connected to MongoDB');
    const { db } = await connectToDatabase();

    // Get user info from LinkedIn
    const userInfoResponse = await axios.get(`${LINKEDIN_API_URL}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    const { sub, given_name, family_name, email, picture } = userInfoResponse.data;

    // Store the tokens and user info in MongoDB
    await db.collection('profiles').insertOne({
      linkedinId: sub,
      given_name,
      family_name,
      email,
      picture,
      accessToken: access_token,
      refreshToken: refresh_token,
      tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Stored LinkedIn tokens in MongoDB');

    // Redirect back to the home page
    return NextResponse.redirect(new URL('/?message=Successfully signed in', request.url));
  } catch (error: any) {
    console.error('Error in callback route:', error);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error.message || 'Failed to complete authentication')}`, request.url)
    );
  }
} 
