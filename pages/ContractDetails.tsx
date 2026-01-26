
import React, { useState, useEffect } from 'react';
import { Contract, ContractHistory, Page } from '../types';
import { gemini } from '../services/gemini';
import { contractService } from '../services/contractService';
import { emailService } from '../services/emailService';
import { DEFAULT_EMAIL_TEMPLATE } from '../constants';

interface ContractDetailsProps {
  contract: Contract;
  onBack: () => void;
  onNavigate: (page: Page, id?: string) => void;
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({ contract, onBack, onNavigate }) => {
  const [summary, setSummary] = useState<string>('Analisando com IA NoPrazo...');
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [history, setHistory] = useState<ContractHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      const result = await gemini.summarizeContract(contract.title, contract.vendor, contract.value);
      setSummary(result);
      setLoadingSummary(false);
    };
    fetchSummary();
  }, [contract]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await contractService.getHistory(contract.id);
      setHistory(data);
      setShowHistory(true);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Expirado':
      case 'Vencido':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Expirando':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="p-6 md:p-8 flex flex-col h-full max-w-[1200px] mx-auto w-full animate-fade-in relative">
      {/* History Modal Overlay */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Histórico de Alterações</h3>
                <p className="text-sm text-slate-500">Acompanhe quem e quando alterou este contrato</p>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {history.length > 0 ? history.map((h) => (
                  <div key={h.id} className="flex gap-4 relative">
                    <div className="shrink-0 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${h.action === 'created' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        <span className="material-symbols-outlined text-lg">
                          {h.action === 'created' ? 'add' : 'edit'}
                        </span>
                      </div>
                      <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-black text-slate-900 dark:text-white">
                          {h.action === 'created' ? 'Contrato Criado' : 'Contrato Atualizado'}
                        </p>
                        <span className="text-xs text-slate-400 font-bold">
                          {new Date(h.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">Por: <span className="font-bold">{h.user_name}</span></p>
                      {h.changes && Object.keys(h.changes).length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Alterações:</p>
                          <ul className="text-xs space-y-1">
                            {Object.entries(h.changes).map(([key, val]) => (
                              <li key={key} className="text-slate-600 dark:text-slate-400">
                                <span className="font-bold capitalize">{key}:</span> {String(val)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-slate-400 py-10">Nenhum histórico disponível.</p>
                )}
              </div>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHistory(false)}
                className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Simulation Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-primary/5">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">send</span>
                  Simulação de Envio de E-mail
                </h3>
                <p className="text-sm text-slate-500">Esta é a mensagem que será enviada para <span className="font-bold text-primary">{contract.customerEmail}</span></p>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto custom-scrollbar shadow-inner">
                {contractService.formatNotificationMessage(contract, contract.customMessage || DEFAULT_EMAIL_TEMPLATE)}
              </div>
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl flex gap-3">
                <span className="material-symbols-outlined text-amber-600">info</span>
                <p className="text-xs text-amber-800 dark:text-amber-400">
                  <strong>Nota:</strong> Em um ambiente de produção, este e-mail seria disparado automaticamente pelo sistema {contract.notificationDays} dias antes de {new Date(contract.endDate).toLocaleDateString('pt-BR')}.
                </p>
              </div>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    const message = contractService.formatNotificationMessage(contract, contract.customMessage || DEFAULT_EMAIL_TEMPLATE);
                    await emailService.sendContractNotification(
                      contract.customerEmail || '',
                      `Lembrete: Contrato ${contract.title} próximo do vencimento`,
                      message.replace(/\n/g, '<br/>')
                    );
                    alert('Sucesso: E-mail enviado para ' + contract.customerEmail);
                    setShowEmailModal(false);
                  } catch (err) {
                    alert('Erro ao enviar e-mail. Verfique sua chave de API do Resend no .env.local');
                    console.error(err);
                  }
                }}
                className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined">mail</span>
                Enviar Agora (Simular)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-500"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">
              <span>Contratos</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary">{contract.ref}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {contract.title}
            </h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('edit', contract.id)}
            className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <span className="material-symbols-outlined text-[22px]">edit</span>
            <span>Editar</span>
          </button>
          {contract.attachmentUrl ? (
            <a
              href={contract.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[22px]">download</span>
              <span>Baixar Contrato</span>
            </a>
          ) : (
            <button
              disabled
              className="px-6 py-3 bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 rounded-2xl font-bold flex items-center gap-2 cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[22px]">download</span>
              <span>Sem Anexo</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        {/* Main Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-surface-dark rounded-[32px] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Informações Principais</h3>
              <div className="flex gap-2">
                {contract.autoRenewal && (
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    Auto-Renovação
                  </span>
                )}
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(contract.status)}`}>
                  {contract.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Responsável</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{contract.vendor}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Valor do Contrato</span>
                  <span className="text-3xl font-black text-primary">R$ {contract.value.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex flex-col gap-1.5 pt-4">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Descrição</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    {contract.description || 'Nenhuma descrição detalhada fornecida para este contrato.'}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 space-y-6 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-2xl">
                    <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Início da Vigência</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{new Date(contract.startDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-2xl">
                    <span className="material-symbols-outlined text-[24px]">event_busy</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fim da Vigência</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{new Date(contract.endDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 p-3 rounded-2xl">
                    <span className="material-symbols-outlined text-[24px]">history_toggle_off</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Data de Renovação</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{new Date(contract.renewalDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-2xl">
                    <span className="material-symbols-outlined text-[24px]">notifications_active</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Alerta Antecipado</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{contract.notificationDays} Dias antes</p>
                  </div>
                </div>

                {contract.customMessage && (
                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-slate-700 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mensagem de Notificação</p>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl">
                      "{contract.customMessage}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[32px] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary filled text-3xl">psychology</span>
              Análise NoPrazo IA
            </h3>
            <div className={`p-6 rounded-[24px] bg-slate-50 dark:bg-slate-900/50 text-base leading-relaxed text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition-opacity ${loadingSummary ? 'opacity-50' : 'opacity-100'}`}>
              {summary}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <span className="text-xs text-slate-400 italic">Esta análise é gerada automaticamente com base nos dados do contrato.</span>
              <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Regenerar Análise
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-primary/5 dark:bg-primary/10 rounded-[32px] p-8 border border-primary/10">
            <h4 className="text-sm font-black uppercase text-primary tracking-widest mb-6">Dados de Contato</h4>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">E-mail do Cliente</p>
                <p className="font-bold text-slate-900 dark:text-white break-all">{contract.customerEmail || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Telefone do Cliente</p>
                <p className="font-bold text-slate-900 dark:text-white">{contract.customerPhone || 'Não informado'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[32px] p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest mb-6">Responsável</h4>
            <div className="flex items-center gap-4">
              <div className="bg-slate-100 dark:bg-slate-800 h-14 w-14 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">person</span>
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">{contract.responsibleAgent}</p>
                <p className="text-xs text-slate-500">Gestor do Contrato</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 rounded-[32px] p-8 text-white">
            <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-6">Ações Rápidas</h4>
            <div className="grid grid-cols-1 gap-3">
              {contract.attachmentUrl ? (
                <a
                  href={contract.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-xl">file_open</span>
                  Visualizar Anexo
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-2xl bg-white/5 text-slate-500 transition-all text-sm font-bold flex items-center gap-3 cursor-not-allowed opacity-50"
                >
                  <span className="material-symbols-outlined text-xl">description</span>
                  Nenhum Anexo
                </button>
              )}

              <button
                onClick={loadHistory}
                disabled={loadingHistory}
                className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-sm font-bold flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-xl">history</span>
                {loadingHistory ? 'Carregando...' : 'Histórico de Alterações'}
              </button>

              <button className="w-full py-3 px-4 rounded-2xl border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">delete</span>
                Excluir Contrato
              </button>

              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 transition-all text-sm font-bold flex items-center gap-3 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              >
                <span className="material-symbols-outlined text-xl">send</span>
                Simular Envio de Notificação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
