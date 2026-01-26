
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        alert('Confirme seu e-mail para ativar sua conta!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar com Google');
    }
  };

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-white dark:bg-background-dark">
      <div className="hidden lg:flex w-1/2 h-full relative overflow-hidden">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-10000 hover:scale-110"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200")' }}
        ></div>
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-16 w-full text-white z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-5xl">verified_user</span>
            <h3 className="text-3xl font-bold tracking-tight">NoPrazo</h3>
          </div>
          <p className="text-2xl font-medium leading-relaxed max-w-lg opacity-90">
            Gestão de contratos segura, automatizada e inteligente para empresas modernas.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col h-full bg-white dark:bg-background-dark overflow-y-auto">
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-20 xl:px-32">
          <div className="w-full max-w-[440px] flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
                {isSignUp ? 'Criar conta' : 'Bem-vindo de volta'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-normal">
                {isSignUp ? 'Cadastre-se para gerenciar seus contratos.' : 'Gerencie seus contratos com segurança empresarial.'}
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="group flex w-full items-center justify-center rounded-xl h-14 px-5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white gap-3 border border-slate-200 dark:border-slate-700 transition-all duration-300"
            >
              <svg className="h-6 w-6" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#EA4335"></path>
                <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4"></path>
                <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05"></path>
                <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853"></path>
              </svg>
              <span className="text-base font-bold">Entrar com Google</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-slate-500 text-sm font-medium">ou use e-mail</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <form onSubmit={handleAuth} className="flex flex-col gap-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 text-sm font-bold" htmlFor="email">E-mail Corporativo</label>
                <input
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 h-12 text-base focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  id="email"
                  placeholder="nome@empresa.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-slate-700 dark:text-slate-300 text-sm font-bold" htmlFor="password">Senha</label>
                  {!isSignUp && <a className="text-sm font-bold text-primary hover:underline" href="#">Esqueceu?</a>}
                </div>
                <input
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 h-12 text-base focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center rounded-xl h-14 bg-primary hover:bg-primary-hover text-white text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-slate-500 dark:text-slate-400 text-base"
              >
                {isSignUp ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
                <span className="font-bold text-primary hover:underline">
                  {isSignUp ? 'Entrar' : 'Cadastre-se'}
                </span>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span className="text-xs font-bold uppercase tracking-widest">SSL 256-bit Seguro</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
