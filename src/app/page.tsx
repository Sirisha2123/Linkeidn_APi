'use client';

import { useState, useEffect } from 'react';
import { getLinkedInAuthUrl } from '@/lib/linkedin';
import axios from 'axios';

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for error or success message in URL
    const params = new URLSearchParams(window.location.search);
    const errorMessage = params.get('error');
    const successMessage = params.get('message');
    
    if (errorMessage) {
      setError(errorMessage);
      // Clear the error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
    
    if (successMessage) {
      setMessage(successMessage);
      // Clear the message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
      // Fetch profile after successful sign-in
      fetchProfile();
    }
  }, []);

  const fetchProfile = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`/api/profile${forceRefresh ? '?t=' + Date.now() : ''}`);
      setProfile(response.data);
      setRawResponse(response.data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(error.response?.data?.error || error.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    const authUrl = getLinkedInAuthUrl();
    window.location.href = authUrl;
  };

  const handleSignOut = async () => {
    try {
      // Call the sign-out API endpoint
      const response = await fetch('/api/auth/signout', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to sign out');
      }

      // Clear profile data
      setProfile(null);
      setRawResponse(null);
      setMessage('Successfully signed out');
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  if (!profile) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to LinkedIn Profile Viewer
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with LinkedIn to view and manage your profile information
            </p>
            
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8 max-w-md mx-auto">
                {message}
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 max-w-md mx-auto">
                {error}
              </div>
            )}

            <button
              onClick={handleSignIn}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            >
              Sign in with LinkedIn
            </button>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">View Profile</h3>
                <p className="text-gray-600">Access your LinkedIn profile information</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Manage Data</h3>
                <p className="text-gray-600">Control your profile data and preferences</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
                <p className="text-gray-600">Keep your profile up to date</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">LinkedIn Profile Viewer</h1>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <div className="space-x-4">
              <button
                onClick={() => fetchProfile(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Name:</span> {profile.given_name} {profile.family_name}</p>
                  <p><span className="font-medium">Email:</span> {profile.email}</p>
                  {profile.locale && <p><span className="font-medium">Locale:</span> {profile.locale}</p>}
                  {profile.sub && <p><span className="font-medium">LinkedIn ID:</span> {profile.sub}</p>}
                </div>
              </div>
              {profile.picture && (
                <div className="flex flex-col items-center">
                  <img
                    src={profile.picture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Profile Picture</p>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Experience */}
            {profile.positions && profile.positions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Professional Experience</h3>
                <div className="space-y-4">
                  {profile.positions.map((position: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">{position.title}</h4>
                      <p className="text-gray-600">{position.companyName}</p>
                      {position.startDate && (
                        <p className="text-sm text-gray-500">
                          {new Date(position.startDate.year, position.startDate.month - 1).toLocaleDateString()} - 
                          {position.endDate ? new Date(position.endDate.year, position.endDate.month - 1).toLocaleDateString() : 'Present'}
                        </p>
                      )}
                      {position.summary && (
                        <p className="mt-2 text-gray-700">{position.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Profile Sections */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {profile.email && (
                    <p><span className="font-medium">Email:</span> {profile.email}</p>
                  )}
                  {profile.email_verified !== undefined && (
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Email Verified:</span>
                      <span className={profile.email_verified ? "text-green-600" : "text-red-600"}>
                        {profile.email_verified ? "✓" : "✗"}
                      </span>
                    </p>
                  )}
                  {profile.phoneNumber && (
                    <p><span className="font-medium">Phone:</span> {profile.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Account Information</h3>
                <div className="space-y-2">
                  {profile.iat && (
                    <p><span className="font-medium">Token Issued At:</span> {new Date(profile.iat * 1000).toLocaleString()}</p>
                  )}
                  {profile.exp && (
                    <p><span className="font-medium">Token Expires At:</span> {new Date(profile.exp * 1000).toLocaleString()}</p>
                  )}
                  {profile.iss && (
                    <p><span className="font-medium">Issuer:</span> {profile.iss}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Debug Information */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Available Profile Data</h3>
              <div className="space-y-2">
                {Object.entries(profile).map(([key, value]) => (
                  <p key={key}>
                    <span className="font-medium">{key}:</span> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {rawResponse && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Raw Response</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 