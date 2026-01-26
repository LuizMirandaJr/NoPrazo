
import React from 'react';

interface NavbarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    searchQuery,
    onSearchChange,
    isDarkMode,
    onToggleDarkMode,
}) => {
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
                <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
                </button>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all">
                    <span className="material-symbols-outlined">help</span>
                </button>
            </div>
        </header>
    );
};
