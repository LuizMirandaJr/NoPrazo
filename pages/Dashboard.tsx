
import React from 'react';
import { Contract } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  contracts: Contract[];
  onNavigate: (page: string, id?: string) => void;
}

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Fev', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Abr', value: 4500 },
  { name: 'Mai', value: 6000 },
  { name: 'Jun', value: 5500 },
];

export const Dashboard: React.FC<DashboardProps> = ({ contracts, onNavigate }) => {
  const stats = [
    { label: 'Total de Contratos', value: contracts.length, color: 'text-blue-600', icon: 'folder', bg: 'bg-blue-50' },
    { label: 'Ativos', value: contracts.filter(c => c.status === 'Ativo').length, color: 'text-green-600', icon: 'check_circle', bg: 'bg-green-50' },
    { label: 'Vencidos', value: contracts.filter(c => c.status === 'Vencido').length, color: 'text-red-600', icon: 'error', bg: 'bg-red-50' },
  ];

  const expiringContracts = contracts.filter(c => c.status === 'Vencido').slice(0, 4);

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
          <div key={i} className="flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              <span className={`material-symbols-outlined ${stat.color} ${stat.bg} p-2 rounded-xl`} style={{ fontSize: '20px' }}>
                {stat.icon}
              </span>
            </div>
            <p className="text-slate-900 dark:text-white text-4xl font-black tracking-tight">{stat.value}</p>
          </div>
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
                  <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Fornecedor</th>
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
          <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-900 dark:text-white font-bold mb-4">Volume de Renovações</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#136dec" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#136dec" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#136dec" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-slate-500 font-bold">
              <span>Previsão Q4</span>
              <span className="text-green-600">+12% vs AA</span>
            </div>
          </div>

          <div className="bg-primary text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-xl mb-2">Insights Inteligentes</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                O sistema detectou 3 cláusulas de indenização ausentes no seu contrato AWS que está expirando.
              </p>
              <button
                onClick={() => onNavigate('list')}
                className="bg-white text-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all w-full shadow-lg"
              >
                Ver Recomendações
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <span className="material-symbols-outlined" style={{ fontSize: '180px' }}>psychology</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
