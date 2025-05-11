# LinkedIn Profile Fetcher

A Next.js application that integrates with LinkedIn OAuth to fetch and store user profile information.

## 🚀 Features

- LinkedIn OAuth Integration
- User Profile Data Fetching
- MongoDB Database Integration
- Modern UI with Tailwind CSS
- TypeScript Support
- Secure Token Management

## 📁 Project Structure

```
linkedin-profile-fetcher/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   └── auth/         # Authentication endpoints
│   │   └── (routes)/         # Application routes
│   ├── lib/                   # Utility functions and configurations
│   │   └── mongodb.ts        # MongoDB connection setup
│   └── models/               # Database models
├── public/                    # Static assets
├── .next/                     # Next.js build output
├── node_modules/             # Dependencies
├── package.json              # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Authentication**: LinkedIn OAuth
- **HTTP Client**: Axios
- **Icons**: Heroicons

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB instance
- LinkedIn Developer Account
- LinkedIn API Credentials

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
MONGODB_URI=your_mongodb_connection_string
```

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone <https://github.com/Sirisha2123/Linkeidn_APi>
   cd Linkeidn_APi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create `.env.local` file
   - Add required environment variables

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. User initiates LinkedIn login
2. LinkedIn OAuth callback processes authentication
3. Access token is obtained and stored
4. User profile data is fetched and stored in MongoDB
5. User is redirected to the application

## 📦 Dependencies

### Main Dependencies
- next: 14.1.0
- react: ^18.2.0
- mongoose: ^8.1.0
- axios: ^1.6.7
- next-auth: ^4.24.5
- tailwindcss: ^3.4.1

### Development Dependencies
- typescript: ^5.3.3
- eslint: ^8.56.0
- @types/node: ^20.11.16
- @types/react: ^18.2.52



