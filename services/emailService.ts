import { supabase } from './supabase';

export const emailService = {
    async sendContractNotification(to: string, subject: string, html: string) {
        try {
            const { data, error } = await supabase.functions.invoke('send-notification', {
                body: { to, subject, html }
            });

            if (error) {
                console.error('Edge Function Error:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Error sending email via Edge Function:', error);
            throw error;
        }
    }
};
