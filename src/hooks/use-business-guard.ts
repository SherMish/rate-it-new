import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { WebsiteType } from '@/lib/models/Website';

export function useBusinessGuard() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [website, setWebsite] = useState<WebsiteType | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/business/register');
      return;
    }

    if (session.user.role !== 'business_owner') {
      router.push('/');
      return;
    }

    if (!session.user.websites) {
      router.push('/business/register');
      return;
    }

    // Fetch website details
    const fetchWebsite = async () => {
      try {
        const res = await fetch(`/api/website/get?id=${session.user.websites}`);
        
        if (res.ok) {
          const data = await res.json();
          setWebsite(data);
          return;
        } 
        
        if (res.status === 404) {
          const websiteRes = await fetch(`/api/website/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url: session.user.relatedWebsite,
              owner: session.user.id,
              isVerified: true 
            }),
            credentials: 'include'
          });

          if (websiteRes.ok) {
            const data = await websiteRes.json();
            setWebsite(data);
            // Wait for session update to complete before continuing
            await updateSession();
            // Verify session was updated correctly
            const sessionRes = await fetch('/api/auth/session');
            const updatedSession = await sessionRes.json();
            if (updatedSession?.user?.websites === data._id) {
              return;
            }
          }
        }

        console.log('Website not ready or session mismatch, retrying...');
        setTimeout(fetchWebsite, 2000);
      } catch (error) {
        console.error('Error fetching website:', error);
        setTimeout(fetchWebsite, 2000);
      }
    };

    fetchWebsite();
  }, [session, status, router, updateSession]);

  return {
    isLoading: status === 'loading' || !website,
    website,
    user: session?.user
  };
} 