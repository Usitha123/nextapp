'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function SessionHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (session) {
        // Clear the nextauth session cookie
        document.cookie = '.next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        
        // Clear any other auth-related cookies
        document.cookie = 'next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = 'next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        
        // If you're using secure prefix
        document.cookie = '__Secure-next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure';
        
        // Force clear local storage
        localStorage.removeItem('next-auth.session-token');
        
        // You might want to make a logout API call here
        try {
          await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'include'
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session]);

  return null;
}