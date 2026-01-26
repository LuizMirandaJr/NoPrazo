
import React from 'react';
import { Page } from '../types';
import { AVATARS } from '../constants';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: { name: string; role: string; avatar: string };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, user }) => {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Painel', icon: 'dashboard' },
    { id: 'list' as Page, label: 'Todos os Contratos', icon: 'folder_open' },
    { id: 'create' as Page, label: 'Novo Contrato', icon: 'add_circle' },
    { id: 'settings' as Page, label: 'Configurações', icon: 'settings' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between hidden md:flex sticky top-0 h-screen transition-colors duration-200">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-3 items-center px-2 py-4">
          <div className="bg-primary/10 flex items-center justify-center rounded-lg h-10 w-10 text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>verified_user</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">NoPrazo</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Gestão de Contratos</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${currentPage === item.id
                ? 'bg-primary/10 text-primary font-bold shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                }`}
            >
              <span className={`material-symbols-outlined ${currentPage === item.id ? 'filled' : ''}`} style={{ fontSize: '22px' }}>
                {item.icon}
              </span>
              <p className="text-sm leading-normal">{item.label}</p>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <img
            src={user.avatar}
            alt="Perfil"
            className="rounded-full h-9 w-9 object-cover ring-2 ring-primary/20"
          />
          <div className="overflow-hidden">
            <p className="text-slate-900 dark:text-white text-sm font-bold truncate">{user.name}</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{user.role}</p>
          </div>
        </div>
        <button
          onClick={async () => {
            const { supabase } = await import('../services/supabase');
            await supabase.auth.signOut();
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold transition-all mt-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
};
