# LinkedIn Profile Fetcher

A Next.js application that fetches and displays LinkedIn user profiles using the LinkedIn API and MongoDB.

## Features

- Fetch LinkedIn profile data including:
  - Basic information (name, headline, location)
  - Profile picture
  - Work experience
  - Education history
  - Skills
- Store profile data in MongoDB
- Modern, responsive UI with Tailwind CSS
- Real-time profile updates

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance
- LinkedIn Developer Account and API credentials

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd linkedin-profile-fetcher
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## LinkedIn API Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Configure the app with the following permissions:
   - r_liteprofile
   - r_emailaddress
4. Generate an access token
5. Add the access token to your `.env` file

## Technologies Used

- Next.js 14
- TypeScript
- MongoDB with Mongoose
- Tailwind CSS
- LinkedIn API
- NextAuth.js

## License

MIT 