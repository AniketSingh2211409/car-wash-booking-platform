import React from 'react';

const SocialAuth = () => {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleAppleLogin = () => {
    window.location.href = '/api/auth/apple';
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
        <span className="text-sm font-medium">Google</span>
      </button>
      <button
        onClick={handleAppleLogin}
        className="flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
      >
        <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-4 h-4" />
        <span className="text-sm font-medium">Apple</span>
      </button>
    </div>
  );
};

export default SocialAuth;
