
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AppState, Page, Contract } from './types';
import { AVATARS } from './constants';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { LoginPage } from './pages/LoginPage';
import { ContractDetails } from './pages/ContractDetails';
import { ContractList } from './pages/ContractList';
import { CreateContract } from './pages/CreateContract';
import { EditContract } from './pages/EditContract';
import { Settings } from './pages/Settings';
import { supabase } from './services/supabase';
import { contractService } from './services/contractService';

export default function App() {
  const [state, setState] = useState<AppState>({
    currentPage: 'login',
    selectedContractId: null,
    contracts: [],
    user: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchContracts = useCallback(async () => {
    try {
      const contracts = await contractService.getAll();
      setState(prev => ({ ...prev, contracts }));
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  }, []);

  const fetchProfile = useCallback(async (userId: string, email: string) => {
    const { profileService } = await import('./services/profileService');
    const profile = await profileService.getProfile(userId);
    setState(prev => ({
      ...prev,
      user: {
        name: profile?.full_name || email.split('@')[0] || 'User',
        role: 'Membro da Equipe',
        avatar: profile?.avatar_url || AVATARS.sarah,
        email: email
      }
    }));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
        setState(prev => ({ ...prev, currentPage: 'dashboard' }));
        fetchContracts();
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
        setState(prev => ({ ...prev, currentPage: 'dashboard' }));
        fetchContracts();
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          currentPage: 'login',
          contracts: []
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchContracts, fetchProfile]);

  const handleNavigate = (page: Page, id?: string) => {
    setState(prev => ({ ...prev, currentPage: page, selectedContractId: id || null }));
  };

  const selectedContract = useMemo(() =>
    state.contracts.find(c => c.id === state.selectedContractId),
    [state.contracts, state.selectedContractId]
  );

  const filteredContracts = useMemo(() =>
    state.contracts.filter(c =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    ), [state.contracts, searchQuery]
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!state.user) {
    return <LoginPage />;
  }

  return (
    <div className={`flex h-screen bg-background-light dark:bg-background-dark transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar
        currentPage={state.currentPage}
        onNavigate={handleNavigate}
        user={state.user!}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative border-l border-slate-200 dark:border-slate-800">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark custom-scrollbar">
          {state.currentPage === 'dashboard' && (
            <Dashboard contracts={state.contracts} onNavigate={handleNavigate} />
          )}

          {state.currentPage === 'list' && (
            <ContractList contracts={filteredContracts} onNavigate={handleNavigate} onRefresh={fetchContracts} />
          )}

          {state.currentPage === 'details' && selectedContract && (
            <ContractDetails
              contract={selectedContract}
              onBack={() => handleNavigate('list')}
              onNavigate={handleNavigate}
            />
          )}

          {state.currentPage === 'create' && (
            <CreateContract onNavigate={handleNavigate} onContractCreated={fetchContracts} />
          )}

          {state.currentPage === 'edit' && state.selectedContractId && (
            <EditContract contractId={state.selectedContractId} onNavigate={handleNavigate} onContractUpdated={fetchContracts} />
          )}

          {state.currentPage === 'settings' && (
            <Settings
              user={state.user}
              onNavigate={handleNavigate}
              onProfileUpdate={() => state.user?.email && fetchProfile(supabase.auth.getUser().then(({ data }) => data.user?.id || ''), state.user.email)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
