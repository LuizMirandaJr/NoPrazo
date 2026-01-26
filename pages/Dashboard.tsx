
import React from 'react';
import { Contract } from '../types';


interface DashboardProps {
  contracts: Contract[];
  onNavigate: (page: string, id?: string) => void;
  onFilterSelect: (status: string | null) => void;
}



export const Dashboard: React.FC<DashboardProps> = ({ contracts, onNavigate, onFilterSelect }) => {
  const stats = [
    { label: 'Total de Contratos', value: contracts.length, color: 'text-blue-600', icon: 'folder', bg: 'bg-blue-50', filter: null },
    { label: 'Ativos', value: contracts.filter(c => c.status === 'Ativo').length, color: 'text-green-600', icon: 'check_circle', bg: 'bg-green-50', filter: 'Ativo' },
    { label: 'Vencidos', value: contracts.filter(c => c.status === 'Vencido').length, color: 'text-red-600', icon: 'error', bg: 'bg-red-50', filter: 'Vencido' },
  ];

  const expiringContracts = contracts.filter(c => c.status === 'Vencido').slice(0, 4);
  const upcomingContracts = contracts.filter(c => c.status === 'Expirando').sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()).slice(0, 5);

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Visão Geral</h1>
          <p className="text-slate-500 dark:text-slate-400">Bem-vindo de volta. Aqui está o status do seu portfólio de contratos.</p>
        </div>
        <button
          onClick={() => onNavigate('create')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-xl px-6 py-3 text-sm font-bold transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Novo Contrato</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <button
            key={i}
            onClick={() => onFilterSelect(stat.filter)}
            className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-center justify-between w-full">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider group-hover:text-primary transition-colors">{stat.label}</p>
              <span className={`material-symbols-outlined ${stat.color} ${stat.bg} p-2 rounded-xl`} style={{ fontSize: '20px' }}>
                {stat.icon}
              </span>
            </div>
            <p className="text-slate-900 dark:text-white text-4xl font-black tracking-tight">{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 dark:text-white text-xl font-bold">Atenção Necessária</h2>
            <button onClick={() => onNavigate('list')} className="text-primary text-sm font-bold hover:underline">Ver Todos</button>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Nome do Contrato</th>
                  <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Responsável</th>
                  <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase text-right">Valor</th>
                  <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expiringContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    onClick={() => onNavigate('details', contract.id)}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${contract.status === 'Vencido' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          <span className="material-symbols-outlined text-[20px]">description</span>
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-bold text-sm truncate max-w-[150px]">{contract.title}</p>
                          <p className="text-slate-400 text-xs font-medium">{contract.ref}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300 text-sm font-medium">{contract.vendor}</td>
                    <td className="py-4 px-6 text-slate-900 dark:text-white text-sm font-bold text-right">R$ {contract.value.toLocaleString('pt-BR')}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${contract.status === 'Vencido' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-900 dark:text-white font-bold">Próximos a Vencer</h3>
              <button onClick={() => { onFilterSelect('Expirando'); onNavigate('list'); }} className="text-primary text-xs font-bold hover:underline">Ver Todos</button>
            </div>

            <div className="space-y-4">
              {upcomingContracts.length > 0 ? (
                upcomingContracts.map(contract => (
                  <div
                    key={contract.id}
                    onClick={() => onNavigate('details', contract.id)}
                    className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">{contract.title}</h4>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-white dark:bg-surface-dark px-2 py-1 rounded-full">
                        {Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>{contract.vendor}</span>
                      <span>{new Date(contract.endDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                  <span className="material-symbols-outlined text-4xl text-slate-300">event_available</span>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Nenhum contrato próximo do vencimento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
