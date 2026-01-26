
import React, { useState, useEffect } from 'react';
import { Page, Contract } from '../types';
import { contractService } from '../services/contractService';
import { DEFAULT_EMAIL_TEMPLATE } from '../constants';

interface EditContractProps {
    contractId: string;
    onNavigate: (page: Page) => void;
    onContractUpdated: () => void;
}

export const EditContract: React.FC<EditContractProps> = ({ contractId, onNavigate, onContractUpdated }) => {
    const [formData, setFormData] = useState({
        title: '',
        vendor: '',
        value: '',
        startDate: '',
        endDate: '',
        customerEmail: '',
        customerPhone: '',
        status: 'Ativo',
        notificationDays: '7',
        description: '',
        attachmentUrl: '',
        autoRenewal: false,
        customMessage: '',
    });
    const [useCustomMessage, setUseCustomMessage] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContract = async () => {
            try {
                const contracts = await contractService.getAll();
                const contract = contracts.find(c => c.id === contractId);
                if (contract) {
                    setFormData({
                        title: contract.title,
                        vendor: contract.vendor,
                        value: contract.value.toString(),
                        startDate: contract.startDate,
                        endDate: contract.endDate,
                        customerEmail: contract.customerEmail || '',
                        customerPhone: contract.customerPhone || '',
                        status: contract.status,
                        notificationDays: contract.notificationDays.toString(),
                        description: contract.description || '',
                        attachmentUrl: contract.attachmentUrl || '',
                        autoRenewal: contract.autoRenewal,
                        customMessage: contract.customMessage || '',
                    });
                    setUseCustomMessage(!!contract.customMessage);
                    if (contract.attachmentUrl) {
                        setFileName(contract.attachmentUrl.split('/').pop() || 'Arquivo Atual');
                    }
                } else {
                    setError('Contrato não encontrado');
                }
            } catch (err) {
                setError('Erro ao carregar contrato');
            } finally {
                setLoading(false);
            }
        };
        loadContract();
    }, [contractId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const publicUrl = await contractService.uploadAttachment(file);
            setFormData(prev => ({ ...prev, attachmentUrl: publicUrl }));
            setFileName(file.name);
        } catch (err: any) {
            console.error('Erro ao fazer upload do anexo:', err);
            setError('Erro ao enviar o arquivo.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { data: { user } } = await contractService.getCurrentUser();
            if (!user) throw new Error('Usuário não autenticado');

            await contractService.update(contractId, {
                title: formData.title,
                vendor: formData.vendor,
                value: Number(formData.value),
                startDate: formData.startDate,
                endDate: formData.endDate,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                status: formData.status as any,
                notificationDays: Number(formData.notificationDays),
                description: formData.description,
                attachmentUrl: formData.attachmentUrl,
                autoRenewal: formData.autoRenewal,
                customMessage: useCustomMessage ? formData.customMessage : undefined,
            });
            onContractUpdated();
            onNavigate('list');
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar contrato');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-[900px] mx-auto w-full">
            <div className="mb-8">
                <button onClick={() => onNavigate('list')} className="flex items-center gap-2 text-primary font-bold hover:underline mb-2">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Voltar à Lista</span>
                </button>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Editar Contrato</h1>
                <p className="text-slate-500">Atualize as informações do acordo legal.</p>
            </div>

            <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {error && (
                        <div className="col-span-full bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold">
                            {error}
                        </div>
                    )}
                    <div className="col-span-full space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">Título do Contrato</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none text-lg font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">Responsável</label>
                        <input
                            type="text"
                            required
                            value={formData.vendor}
                            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">Valor do Contrato</label>
                        <input
                            type="number"
                            required
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">E-mail do Cliente</label>
                        <input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">Telefone do Cliente</label>
                        <input
                            type="tel"
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">Data de Início</label>
                        <input
                            type="date"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">Data de Término</label>
                        <input
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">Descrição do Contrato (Opcional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descreva os principais termos ou observações deste contrato..."
                            className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none text-base min-h-[120px]"
                        />
                    </div>
                    <div className="col-span-full space-y-2">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">Anexo do Contrato (Opcional)</label>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold text-slate-700 dark:text-slate-300">
                                    <span className="material-symbols-outlined">upload_file</span>
                                    <span>{uploading ? 'Enviando...' : (formData.attachmentUrl ? 'Trocar Arquivo' : 'Selecionar Arquivo')}</span>
                                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                </label>
                                {formData.attachmentUrl && (
                                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-xl">
                                        <span className="material-symbols-outlined">check_circle</span>
                                        <span className="truncate max-w-[200px]">{fileName || 'Arquivo carregado'}</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, attachmentUrl: '' }));
                                                setFileName(null);
                                            }}
                                            className="text-red-500 hover:underline ml-2"
                                        >
                                            Remover
                                        </button>
                                        <a
                                            href={formData.attachmentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline ml-2"
                                        >
                                            Visualizar
                                        </a>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 italic">Formatos aceitos: PDF, DOCX, Imagens. Máx 10MB.</p>
                        </div>
                    </div>
                    <div className="col-span-full pt-4 space-y-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={formData.autoRenewal}
                                    onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.checked })}
                                />
                                <div className={`block w-12 h-7 rounded-full transition-colors ${formData.autoRenewal ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.autoRenewal ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Renovação Automática</span>
                                <span className="text-xs text-slate-500">O sistema marcará este contrato para renovação imediata no fim do prazo.</span>
                            </div>
                        </label>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={useCustomMessage}
                                        onChange={(e) => setUseCustomMessage(e.target.checked)}
                                    />
                                    <div className={`block w-12 h-7 rounded-full transition-colors ${useCustomMessage ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${useCustomMessage ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Mensagem Personalizada</span>
                                    <span className="text-xs text-slate-500">Personalize o e-mail de notificação de fim de prazo.</span>
                                </div>
                            </label>

                            {useCustomMessage && (
                                <div className="animate-fade-in space-y-2">
                                    <label className="text-sm font-black uppercase tracking-widest text-slate-500">Texto da Mensagem</label>
                                    <textarea
                                        value={formData.customMessage}
                                        onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                                        placeholder="Ex: Prezados, informamos que o contrato X está próximo do fim. Favor entrar em contato para renovação..."
                                        className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none text-base min-h-[120px]"
                                    />
                                    <p className="text-xs text-slate-400 italic">Dica: Se desativado, o sistema enviará uma mensagem padrão profissional.</p>
                                </div>
                            )}

                            {!useCustomMessage && (
                                <div className="mt-4 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 animate-fade-in">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="material-symbols-outlined text-primary text-sm">visibility</span>
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Prévia da Mensagem Padrão</span>
                                    </div>
                                    <div className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed font-mono bg-white dark:bg-black/20 p-4 rounded-xl shadow-inner max-h-[200px] overflow-y-auto custom-scrollbar">
                                        {contractService.formatNotificationMessage({
                                            title: formData.title || '[TÍTULO]',
                                            responsibleAgent: 'Você',
                                            startDate: formData.startDate || new Date().toISOString(),
                                            endDate: formData.endDate || new Date().toISOString(),
                                            notificationDays: Number(formData.notificationDays),
                                        } as any, DEFAULT_EMAIL_TEMPLATE)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2 col-span-full">
                        <label className="text-sm font-black uppercase tracking-widest text-slate-500">Notificar antes do vencimento (Dias)</label>
                        <select
                            value={formData.notificationDays}
                            onChange={(e) => setFormData({ ...formData, notificationDays: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none font-bold"
                        >
                            <option value="1">1 dia antes</option>
                            <option value="3">3 dias antes</option>
                            <option value="7">7 dias antes</option>
                            <option value="15">15 dias antes</option>
                            <option value="30">30 dias antes</option>
                        </select>
                    </div>
                    <div className="col-span-full border-t border-slate-100 dark:border-slate-800 pt-8 flex justify-end gap-4">
                        <button type="button" onClick={() => onNavigate('list')} className="px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancelar</button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 rounded-2xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-50"
                        >
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
