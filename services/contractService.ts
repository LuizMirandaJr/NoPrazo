
import { supabase } from './supabase';
import { Contract } from '../types';

export const contractService = {
    async getCurrentUser() {
        return await supabase.auth.getUser();
    },

    async getAll(): Promise<Contract[]> {
        const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        return (data || []).map(c => {
            const endDate = new Date(c.end_date);
            endDate.setHours(0, 0, 0, 0);

            const notificationDays = c.notification_days || 7;
            const notificationDate = new Date(endDate);
            notificationDate.setDate(notificationDate.getDate() - notificationDays);

            let statusLabel: any = 'Ativo';
            if (now > endDate) {
                statusLabel = 'Vencido';
            } else if (now >= notificationDate) {
                statusLabel = 'Expirando';
            }

            return {
                id: c.id,
                title: c.title,
                vendor: c.vendor,
                value: Number(c.value),
                status: statusLabel,
                startDate: c.start_date,
                endDate: c.end_date,
                renewalDate: c.renewal_date,
                responsibleAgent: c.responsible_agent,
                customerEmail: c.customer_email,
                customerPhone: c.customer_phone,
                ref: c.ref,
                notificationDays: notificationDays,
                description: c.description,
                attachmentUrl: c.attachment_url,
                autoRenewal: !!c.auto_renewal,
                customMessage: c.custom_message,
            };
        });
    },

    async create(contract: Omit<Contract, 'id' | 'ref' | 'autoRenewal'> & { autoRenewal?: boolean }): Promise<Contract> {
        const ref = `#CT-${Math.floor(1000 + Math.random() * 9000)}`;
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('contracts')
            .insert([{
                title: contract.title,
                vendor: contract.vendor,
                value: contract.value,
                status: contract.status,
                start_date: contract.startDate,
                end_date: contract.endDate,
                renewal_date: contract.renewalDate,
                responsible_agent: contract.responsibleAgent,
                customer_email: contract.customerEmail,
                customer_phone: contract.customerPhone,
                notification_days: contract.notificationDays,
                description: contract.description,
                attachment_url: contract.attachmentUrl,
                auto_renewal: contract.autoRenewal,
                custom_message: contract.customMessage,
                ref: ref
            }])
            .select()
            .single();

        if (error) throw error;

        await this.recordHistory(data.id, 'created', { title: data.title });

        return {
            id: data.id,
            title: data.title,
            vendor: data.vendor,
            value: Number(data.value),
            status: data.status as any,
            startDate: data.start_date,
            endDate: data.end_date,
            renewalDate: data.renewal_date,
            responsibleAgent: data.responsible_agent,
            customerEmail: data.customer_email,
            customerPhone: data.customer_phone,
            notificationDays: data.notification_days,
            description: data.description,
            attachmentUrl: data.attachment_url,
            autoRenewal: !!data.auto_renewal,
            customMessage: data.custom_message,
            ref: data.ref,
        };
    },

    async update(id: string, contract: Partial<Contract>): Promise<Contract> {
        const { data: original } = await supabase.from('contracts').select('*').eq('id', id).single();

        const { data, error } = await supabase
            .from('contracts')
            .update({
                title: contract.title,
                vendor: contract.vendor,
                value: contract.value,
                status: contract.status,
                start_date: contract.startDate,
                end_date: contract.endDate,
                renewal_date: contract.renewalDate,
                responsible_agent: contract.responsibleAgent,
                customer_email: contract.customerEmail,
                customer_phone: contract.customerPhone,
                notification_days: contract.notificationDays,
                description: contract.description,
                attachment_url: contract.attachmentUrl,
                auto_renewal: contract.autoRenewal,
                custom_message: contract.customMessage,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Simple diff for history
        const changes: any = {};
        if (contract.title && contract.title !== original.title) changes.title = contract.title;
        if (contract.status && contract.status !== original.status) changes.status = contract.status;
        if (contract.value && Number(contract.value) !== Number(original.value)) changes.value = contract.value;

        await this.recordHistory(id, 'updated', changes);

        return {
            id: data.id,
            title: data.title,
            vendor: data.vendor,
            value: Number(data.value),
            status: data.status as any,
            startDate: data.start_date,
            endDate: data.end_date,
            renewalDate: data.renewal_date,
            responsibleAgent: data.responsible_agent,
            customerEmail: data.customer_email,
            customerPhone: data.customer_phone,
            notificationDays: data.notification_days,
            description: data.description,
            attachmentUrl: data.attachment_url,
            autoRenewal: !!data.auto_renewal,
            customMessage: data.custom_message,
            ref: data.ref,
        };
    },

    async uploadAttachment(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `contracts/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('contracts')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('contracts')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    async recordHistory(contractId: string, action: string, changes: any): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('contract_history').insert([{
            contract_id: contractId,
            user_id: user?.id,
            action,
            changes
        }]);
    },

    async getHistory(contractId: string): Promise<any[]> {
        const { data, error } = await supabase
            .from('contract_history')
            .select(`
                *,
                profiles:user_id (full_name)
            `)
            .eq('contract_id', contractId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map(h => ({
            ...h,
            user_name: h.profiles?.full_name || 'Usuário Sistema'
        }));
    },

    formatNotificationMessage(contract: Contract, template: string): string {
        let msg = template;
        msg = msg.replace(/{NOME_DO_CONTRATO}/g, contract.title);
        msg = msg.replace(/{RESPONSAVEL}/g, contract.responsibleAgent);
        msg = msg.replace(/{DATA_INICIO}/g, new Date(contract.startDate).toLocaleDateString('pt-BR'));
        msg = msg.replace(/{DATA_FIM}/g, new Date(contract.endDate).toLocaleDateString('pt-BR'));
        msg = msg.replace(/{DIAS_RESTANTES}/g, String(contract.notificationDays));
        return msg;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('contracts')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async checkAndProcessRenewals(): Promise<void> {
        try {
            const { data: contracts, error } = await supabase
                .from('contracts')
                .select('*')
                .eq('auto_renewal', true)
                .neq('status', 'Cancelado'); // Don't renew cancelled contracts

            if (error) throw error;
            if (!contracts || contracts.length === 0) return;

            const now = new Date();
            now.setHours(0, 0, 0, 0);

            for (const contract of contracts) {
                const endDate = new Date(contract.end_date);
                endDate.setHours(0, 0, 0, 0);

                // If expired or expiring today/passed
                if (now >= endDate) {
                    const startDate = new Date(contract.start_date);

                    // Calculate duration in ms
                    const durationTime = endDate.getTime() - startDate.getTime();

                    // New Start Date is the day after the old end date, or just the old end date if we want continuity
                    // Usually renewals start day after. Let's say: New Start = Old End Date + 1 day? 
                    // Or if simple cycle: New Start = Old End Date.
                    // User said: "reativar o contrato considerando a mesma quantidade de dias"

                    const newStartDate = new Date(endDate); // Start next period from where it ended
                    const newEndDate = new Date(newStartDate.getTime() + durationTime);
                    const newRenewalDate = new Date(newEndDate); // Assuming renewal date matches end date usually? Or keep same specific renewal date relative logic? 
                    // Let's assume renewal date updates to specific logic or just end date. 
                    // Existing logic uses renewal_date as a separate field. Let's make it null or update it to end date.

                    console.log(`Renewing contract ${contract.id}:`, {
                        oldEnd: contract.end_date,
                        newStart: newStartDate,
                        newEnd: newEndDate
                    });

                    // Update contract in DB
                    const { error: updateError } = await supabase
                        .from('contracts')
                        .update({
                            start_date: newStartDate.toISOString(),
                            end_date: newEndDate.toISOString(),
                            status: 'Ativo',
                            renewal_date: newEndDate.toISOString() // Update renewal date to new end
                        })
                        .eq('id', contract.id);

                    if (updateError) {
                        console.error('Error renewing contract:', updateError);
                        continue;
                    }

                    // Record history
                    await this.recordHistory(contract.id, 'renewed', {
                        message: 'Renovação automática realizada pelo sistema',
                        previous_end_date: contract.end_date,
                        new_end_date: newEndDate.toISOString()
                    });
                }
            }
        } catch (err) {
            console.error('Failed to process auto-renewals:', err);
        }
    }
};

