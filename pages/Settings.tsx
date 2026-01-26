
import React, { useState, useEffect } from 'react';
import { Page, AppState } from '../types';
import { AVATARS } from '../constants';
import { profileService, UserProfile } from '../services/profileService';
import { supabase } from '../services/supabase';

interface SettingsProps {
    user: AppState['user'];
    onNavigate: (page: Page) => void;
    onProfileUpdate: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onNavigate, onProfileUpdate }) => {
    const [fullName, setFullName] = useState(user?.name || '');
    const [email, setEmail] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || AVATARS.sarah);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user: authUser } }) => {
            if (authUser) {
                setEmail(authUser.email || '');
            }
        });
    }, []);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error('Usuário não autenticado');

            const publicUrl = await profileService.uploadAvatar(authUser.id, file);
            setSelectedAvatar(publicUrl);
            setMessage({ type: 'success', text: 'Avatar carregado! Clique em salvar para confirmar.' });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            setMessage({ type: 'error', text: 'Erro ao carregar imagem.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error('Usuário não autenticado');

            await profileService.updateProfile(authUser.id, {
                full_name: fullName,
                avatar_url: selectedAvatar
            });

            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
            onProfileUpdate();
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => onNavigate('dashboard')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Configurações</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gerencie seu perfil e preferências</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span>
                        Ajuste do Perfil
                    </h2>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group/avatar">
                                    <img
                                        src={selectedAvatar}
                                        alt="Avatar Selecionado"
                                        className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/10 transition-all group-hover/avatar:brightness-75"
                                    />
                                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white text-3xl">add_a_photo</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">Foto de Perfil</p>
                                <button
                                    type="button"
                                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                                    className="text-xs font-bold text-primary hover:underline"
                                >
                                    Avatar Personalizado
                                </button>
                            </div>

                            <div className="flex-1 w-full space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nome Exibido</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                            placeholder="Seu nome"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-500 cursor-not-allowed outline-none transition-all"
                                        />
                                        <p className="text-[10px] text-slate-400 italic">O e-mail não pode ser alterado diretamente por aqui.</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Selecione um Avatar</label>
                                    <div className="flex flex-wrap gap-3">
                                        {Object.entries(AVATARS).map(([key, url]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedAvatar(url)}
                                                className={`relative rounded-full overflow-hidden transition-all transform hover:scale-105 ${selectedAvatar === url ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-surface-dark' : 'opacity-60 hover:opacity-100'
                                                    }`}
                                            >
                                                <img src={url} alt={key} className="w-12 h-12 object-cover" />
                                                {selectedAvatar === url && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-white text-xs">check</span>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar Alterações'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">notifications</span>
                        Notificações e Sistema
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Notificações por E-mail</p>
                                <p className="text-sm text-slate-500">Receba alertas de vencimento por e-mail</p>
                            </div>
                            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer opacity-50">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Idioma do Sistema</p>
                                <p className="text-sm text-slate-500">Selecione o idioma da interface</p>
                            </div>
                            <div className="text-sm font-bold text-primary">Português (BR)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
