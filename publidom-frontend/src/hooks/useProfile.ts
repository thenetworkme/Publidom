import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Profile {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    avatar_url?: string;
}

export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log('[useProfile DEBUG] Fetching user...');
                const { data: { user } } = await supabase.auth.getUser();
                console.log('[useProfile DEBUG] User:', user);

                if (!user) {
                    console.log('[useProfile DEBUG] No user found, setting loading to false');
                    setLoading(false);
                    return;
                }

                console.log('[useProfile DEBUG] Fetching profile from DB...');
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                console.log('[useProfile DEBUG] Profile data:', data);
                console.log('[useProfile DEBUG] Profile error:', error);

                if (error) {
                    console.error('Error fetching profile:', error);
                    setError(error.message);
                } else if (data) {
                    setProfile(data as Profile);
                }
            } catch (err: any) {
                console.error('Unexpected error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
        isAdmin: profile?.role === 'admin'
    };
}
