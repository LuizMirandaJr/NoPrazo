import { supabase } from './supabase';

export const emailService = {
    async sendContractNotification(to: string, subject: string, html: string) {
        try {
            const { data, error } = await supabase.functions.invoke('send-notification', {
                body: { to, subject, html }
            });

            if (error) {
                console.error('Edge Function Error Details:', error);
                throw new Error(`Edge Function failed: ${error.message || JSON.stringify(error)}`);
            }

            // Check if the function returned an error in the data body (e.g. 400 from Resend)
            if (data && data.error) {
                console.error('Resend API Error:', data.error);
                throw new Error(`Resend API Error: ${data.error}`);
            }

            return data;
        } catch (error) {
            console.error('Error sending email via Edge Function:', error);
            throw error;
        }
    }
};
