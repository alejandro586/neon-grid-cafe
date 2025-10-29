import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // NUEVO: Client Supabase.
import { Session } from '@supabase/supabase-js'; // NUEVO: Para session realtime.

export type UserRole = 'cliente' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, inviteCode?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void; // Mantenido: Para editar perfil.
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // NUEVO: Realtime listener para session changes (Supabase Auth).
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      onAuthChange(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      onAuthChange(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper: Fetch full user from DB (incl. role/name).
  const onAuthChange = async (session: Session | null) => {
    setIsLoading(true);
    try {
      if (session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        const fullUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: userData?.name || '',
          role: userData?.role as UserRole || 'cliente', // Default cliente.
        };
        setUser(fullUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      // onAuthChange maneja setUser post-login (realtime).
    } catch (error: any) {
      throw new Error(error.message || 'Error en login');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole, inviteCode?: string) => {
    setIsLoading(true);
    try {
      // MEJORA: Valida invite para admin (igual que antes).
      if (role === 'admin' && inviteCode !== 'CYBER2025') {
        throw new Error('Código de invitación inválido para rol admin. Usa CYBER2025.');
      }

      // Sign up en Supabase Auth.
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw new Error(authError.message);

      if (data.user) {
        // Insert en tabla users con role (Supabase maneja email unique).
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          name,
          email,
          role,
        });
        if (insertError) throw new Error(insertError.message);

        // onAuthChange setUser post-register.
      } else {
        throw new Error('Registro fallido: No se creó usuario.');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Error en registro');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;
      setUser({ ...user, ...updates });
    } catch (error: any) {
      throw new Error(error.message || 'Error actualizando perfil');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message || 'Error cerrando sesión');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};