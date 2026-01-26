import React, { useState } from 'react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'tutorials' | 'sac'>('tutorials');

    if (!isOpen) return null;

    const tutorials = [
        {
            title: 'Como criar um novo contrato',
            content: 'Clique no botão "Novo Contrato" no painel principal ou na barra lateral. Preencha os dados obrigatórios e salve.'
        },
        {
            title: 'Entendendo os status',
            content: 'Verde para Ativo, Amarelo para Expirando (próximo do vencimento) e Vermelho para Vencido.'
        },
        {
            title: 'Renovação Automática',
            content: 'Contratos marcados com "Auto-Renovação" serão atualizados automaticamente pelo sistema ao atingirem a data de fim.'
        },
        {
            title: 'Notificações',
            content: 'O sino no topo da tela avisa sobre contratos que precisam de atenção. Clique para ver detalhes.'
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-scale-in border border-slate-100 dark:border-slate-800 flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-primary/5">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">help</span>
                            Ajuda e Suporte
                        </h3>
                        <p className="text-sm text-slate-500">Tire dúvidas e entre em contato</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('tutorials')}
                        className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === 'tutorials'
                                ? 'text-primary'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Tutoriais
                        {activeTab === 'tutorials' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('sac')}
                        className={`flex-1 py-4 text-sm font-bold transition-all relative ${activeTab === 'sac'
                                ? 'text-primary'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Fale Conosco (SAC)
                        {activeTab === 'sac' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {activeTab === 'tutorials' ? (
                        <div className="space-y-6">
                            {tutorials.map((tutorial, index) => (
                                <div key={index} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-sm">lightbulb</span>
                                        {tutorial.title}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {tutorial.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-8">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                                <span className="material-symbols-outlined text-4xl">support_agent</span>
                            </div>

                            <div className="space-y-6 w-full max-w-sm">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 text-left hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm group">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">E-mail</p>
                                        <p className="font-bold text-slate-900 dark:text-white">sac@noprazo.app.com</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 text-left hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm group">
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined">chat</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Whatsapp</p>
                                        <p className="font-bold text-slate-900 dark:text-white">(00) 0000-0000</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 max-w-xs">
                                Nosso time de suporte está disponível de segunda a sexta, das 9h às 18h.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
