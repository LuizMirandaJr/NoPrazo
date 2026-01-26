
import React from 'react';
import { Contract, Page } from '../types';
import { contractService } from '../services/contractService';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface ContractListProps {
    contracts: Contract[];
    onNavigate: (page: Page, id?: string) => void;
    onRefresh: () => void;
    activeFilter?: string | null;
    onFilterChange: (status: string | null) => void;
}

export const ContractList: React.FC<ContractListProps> = ({ contracts, onNavigate, onRefresh, activeFilter, onFilterChange }) => {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Ativo':
                return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
            case 'Expirando':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
            case 'Vencido':
                return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
        }
    };

    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [showFilters, setShowFilters] = React.useState(false);

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await contractService.delete(deleteId);
                onRefresh();
            } catch (err) {
                alert('Erro ao excluir contrato');
            } finally {
                setDeleteId(null);
            }
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Contratos</h1>
                    <p className="text-slate-500">Acesse e acompanhe seus acordos legais ativos.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-5 py-2.5 border rounded-xl font-bold transition-all flex items-center gap-2
                                ${activeFilter ? 'bg-primary/10 text-primary border-primary/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{activeFilter ? 'filter_alt' : 'filter_list'}</span>
                            <span>{activeFilter || 'Filtros'}</span>
                            {activeFilter && (
                                <span
                                    onClick={(e) => { e.stopPropagation(); onFilterChange(null); }}
                                    className="ml-1 p-0.5 hover:bg-primary/20 rounded-full"
                                >
                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                </span>
                            )}
                        </button>

                        {showFilters && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-20 animate-scale-in">
                                <div className="p-2 space-y-1">
                                    {[
                                        { label: 'Todos', value: null },
                                        { label: 'Ativos', value: 'Ativo' },
                                        { label: 'Vencidos', value: 'Vencido' },
                                        { label: 'Expirando', value: 'Expirando' },
                                        { label: 'Cancelados', value: 'Cancelado' },
                                    ].map((option) => (
                                        <button
                                            key={option.label}
                                            onClick={() => {
                                                onFilterChange(option.value);
                                                setShowFilters(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between
                                                ${activeFilter === option.value
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {option.label}
                                            {activeFilter === option.value && (
                                                <span className="material-symbols-outlined text-[16px]">check</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={() => onNavigate('create')} className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Novo Contrato</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Nome do Contrato</th>
                            <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Responsável</th>
                            <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">E-mail Cliente</th>
                            <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest text-right">Valor</th>
                            <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest text-center">Status</th>
                            <th className="py-4 px-6 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {contracts.map((contract) => (
                            <tr
                                key={contract.id}
                                onClick={() => onNavigate('details', contract.id)}
                                className="group hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <td className="py-5 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                            <span className="material-symbols-outlined text-[20px]">description</span>
                                        </div>
                                        <div>
                                            <p className="text-slate-900 dark:text-white font-black text-sm">{contract.title}</p>
                                            <p className="text-slate-400 text-xs font-bold uppercase">{contract.ref}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 px-6 font-bold text-slate-700 dark:text-slate-300 text-sm">{contract.vendor}</td>
                                <td className="py-5 px-6 text-sm font-bold text-slate-500">{contract.customerEmail || '-'}</td>
                                <td className="py-5 px-6 text-slate-900 dark:text-white text-sm font-black text-right">R$ {contract.value.toLocaleString('pt-BR')}</td>
                                <td className="py-5 px-6 text-center">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(contract.status)}`}>
                                        {contract.status}
                                    </span>
                                </td>
                                <td className="py-5 px-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onNavigate('details', contract.id); }}
                                            className="p-2 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-lg transition-all"
                                            title="Visualizar"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onNavigate('edit', contract.id); }}
                                            className="p-2 hover:bg-amber-100/50 text-slate-400 hover:text-amber-600 rounded-lg transition-all"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteClick(contract.id, e)}
                                            className="p-2 hover:bg-red-100/50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                                            title="Excluir"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Excluir Contrato"
                message="Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita e todo o histórico será perdido."
                confirmText="Excluir"
                isDestructive={true}
            />
        </div >
    );
};
