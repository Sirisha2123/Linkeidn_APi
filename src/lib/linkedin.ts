import axios from 'axios';

const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';
const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
// Make sure this matches EXACTLY what's registered in LinkedIn Developer Application
const LINKEDIN_REDIRECT_URI = 'http://localhost:3000/api/auth/callback';

if (!LINKEDIN_CLIENT_ID) {
  console.error('LINKEDIN_CLIENT_ID is not defined in environment variables');
  // Don't throw error on client side, just log it
}

const linkedinApi = axios.create({
  baseURL: LINKEDIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  },
});

// Add response interceptor for better error handling
linkedinApi.interceptors.response.use(
  (response) => {
    console.log('LinkedIn API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('LinkedIn API Error:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.message || error.message
      });
    } else {
      console.error('LinkedIn API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export function getLinkedInAuthUrl() {
  if (!LINKEDIN_CLIENT_ID) {
    throw new Error('LinkedIn Client ID is not configured');
  }
  // Using only the scopes we need for profile viewing
  const scope = 'openid profile email';
  const state = Math.random().toString(36).substring(7);
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&state=${state}&scope=${scope}`;
  console.log('Generated LinkedIn auth URL:', authUrl);
  return authUrl;
}

export function getLinkedInSignOutUrl() {
  if (!LINKEDIN_CLIENT_ID) {
    throw new Error('LinkedIn Client ID is not configured');
  }
  return `https://www.linkedin.com/oauth/v2/logout?client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}`;
}

// Function to fetch additional profile information
export async function fetchAdditionalProfileInfo(accessToken: string) {
  try {
    // Fetch basic profile
    const basicProfile = await linkedinApi.get('/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    // Fetch email address
    const emailResponse = await linkedinApi.get('/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    // Fetch profile picture
    const pictureResponse = await linkedinApi.get('/me?projection=(id,profilePicture(displayImage~:playableStreams))', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    // Fetch positions
    const positionsResponse = await linkedinApi.get('/me?projection=(id,positions)', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    // Combine all the data
    const profileData = {
      ...basicProfile.data,
      email: emailResponse.data?.elements?.[0]?.['handle~']?.emailAddress,
      picture: pictureResponse.data?.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
      positions: positionsResponse.data?.positions?.elements || []
    };

    return profileData;
  } catch (error) {
    console.error('Error fetching additional profile info:', error);
    throw error;
  }
} 