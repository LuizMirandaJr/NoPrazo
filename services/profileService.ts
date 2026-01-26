
import { supabase } from './supabase';

export interface UserProfile {
    id: string;
    full_name: string;
    avatar_url: string;
    email?: string;
}

export const profileService = {
    async getProfile(userId: string): Promise<UserProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }

        return data;
    },

    async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profile,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
    },

    async uploadAvatar(userId: string, file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};
