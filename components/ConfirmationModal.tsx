import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-scale-in border border-slate-100 dark:border-slate-800">
                <div className="p-8 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 
                        ${isDestructive ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-3xl">
                            {isDestructive ? 'warning' : 'info'}
                        </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                        {title}
                    </h3>

                    <p className="text-slate-500 leading-relaxed dark:text-slate-400">
                        {message}
                    </p>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-3 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                            ${isDestructive
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                : 'bg-primary hover:bg-primary-hover shadow-primary/20'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
