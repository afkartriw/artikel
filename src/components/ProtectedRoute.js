// src/components/ProtectedRoute.js
'use client';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(user.role))) {
      router.push('/');
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user || !allowedRoles.includes(user.role)) {
    return <div>Loading...</div>;
  }

  return children;
}