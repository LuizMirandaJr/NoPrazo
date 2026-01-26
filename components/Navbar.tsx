
import React, { useState, useRef, useEffect } from 'react';
import { Notification } from '../types';
import { HelpModal } from './HelpModal';

interface NavbarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    notifications: Notification[];
    onNotificationClick: (contractId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    searchQuery,
    onSearchChange,
    isDarkMode,
    onToggleDarkMode,
    notifications,
    onNotificationClick,
}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;
    return (
        <header className="h-16 flex-shrink-0 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 transition-colors duration-200">
            <div className="flex-1 max-w-[500px]">
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Buscar contratos, fornecedores ou agentes..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-surface-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleDarkMode}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all"
                >
                    <span className="material-symbols-outlined">
                        {isDarkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark animate-pulse"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-4 w-80 md:w-96 bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-20 animate-scale-in origin-top-right">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 dark:text-white">Notificações</h3>
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{unreadCount} Novas</span>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => {
                                                onNotificationClick(notification.contractId);
                                                setShowNotifications(false);
                                            }}
                                            className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3"
                                        >
                                            <div className={`shrink-0 size-10 rounded-full flex items-center justify-center ${notification.type === 'error' ? 'bg-red-100 text-red-600' :
                                                notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                <span className="material-symbols-outlined text-[20px]">
                                                    {notification.type === 'error' ? 'error' : notification.type === 'warning' ? 'warning' : 'info'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{notification.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{notification.message}</p>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{notification.date.toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-200 dark:text-slate-700 mb-2">notifications_off</span>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma notificação no momento.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                <button
                    onClick={() => setShowHelp(true)}
                    className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all"
                >
                    <span className="material-symbols-outlined">help</span>
                </button>
            </div>

            <HelpModal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
            />
        </header>
    );
};
