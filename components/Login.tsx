
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const mockUsers: User[] = [
  { email: 'alex@trim.media', name: 'Alex (Admin)', role: 'admin' },
  { email: 'casey@trim.media', name: 'Casey (Student)', role: 'student' },
  { email: 'drew@trim.media', name: 'Drew (Student)', role: 'student' },
  { email: 'brian@trim.media', name: 'Brian (Student)', role: 'student' },
];

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUserEmail, setSelectedUserEmail] = useState('');

  const handleLogin = () => {
    const user = mockUsers.find(u => u.email === selectedUserEmail);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-text p-4">
      <div className="w-full max-w-sm bg-brand-surface rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-text mb-2">Trim Media Equipment</h1>
        <p className="text-brand-subtle mb-8">Please sign in to continue</p>
        
        <div className="mb-6">
            <select
                value={selectedUserEmail}
                onChange={(e) => setSelectedUserEmail(e.target.value)}
                className="w-full bg-brand-bg border border-brand-secondary rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            >
                <option value="" disabled>Select a user to sign in as...</option>
                {mockUsers.map(user => (
                    <option key={user.email} value={user.email}>
                        {user.name}
                    </option>
                ))}
            </select>
        </div>
        
        <button
          onClick={handleLogin}
          disabled={!selectedUserEmail}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
            <GoogleIcon />
            Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
