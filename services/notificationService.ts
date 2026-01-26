import { Contract, Notification } from '../types';

export const notificationService = {
    getNotifications(contracts: Contract[]): Notification[] {
        const notifications: Notification[] = [];

        contracts.forEach(contract => {
            // Check for expired contracts
            if (contract.status === 'Vencido') {
                notifications.push({
                    id: `expired-${contract.id}`,
                    title: 'Contrato Vencido',
                    message: `O contrato "${contract.title}" venceu em ${new Date(contract.endDate).toLocaleDateString('pt-BR')}.`,
                    type: 'error',
                    date: new Date(contract.endDate),
                    read: false, // In a real app, this would be persisted
                    contractId: contract.id
                });
            }

            // Check for expiring contracts
            if (contract.status === 'Expirando') {
                const daysLeft = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                notifications.push({
                    id: `expiring-${contract.id}`,
                    title: 'Contrato Expirando',
                    message: `O contrato "${contract.title}" expira em ${daysLeft} dias.`,
                    type: 'warning',
                    date: new Date(),
                    read: false,
                    contractId: contract.id
                });
            }
        });

        // Sort by date (newest first)
        return notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
};
