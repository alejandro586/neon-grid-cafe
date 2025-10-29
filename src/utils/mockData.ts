// Mock data and Supabase integration for the application
// Nota: Reemplaza localStorage por Supabase queries/inserts.
// Asegúrate de tener tablas 'users', 'sessions', 'pcs', 'predictions' en Supabase.

import { supabase } from '@/lib/supabase'; // Importa el client Supabase.

export interface PC {
  id: string;
  number: number;
  status: 'libre' | 'ocupada' | 'mantenimiento';
  location: string;
  specs: string;
}

export interface Reservation {
  id: string;
  userId: string;
  pcId: string;
  startTime: string;
  duration: number;
  status: 'activa' | 'completada' | 'cancelada';
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  pcId: string;
  pcNumber: number;
  startTime: string;
  elapsedTime: number;
}

export interface DemandPrediction {
  hour: number;
  day: string;
  predictedUsage: number;
}

// Interface para usuarios (para AdminUserManagement).
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'cliente' | 'admin';
  createdAt: string;
  isBanned: boolean;
}

export type UserRole = 'cliente' | 'admin'; // FIX: Exporta el type explícitamente para uso en funcs.

// NUEVO: Función para terminar sesión (usada en AdminDashboard).
export const endSession = async (sessionId: string): Promise<void> => {
  const { error } = await supabase
    .from('sessions')
    .update({ status: 'ended' })
    .eq('id', sessionId);
  if (error) throw new Error(error.message);
};

// Initialize mock PCs (seed si vacío, query siempre).
export const initializePCs = async (): Promise<PC[]> => {
  // Check si ya hay data.
  const { data: existing } = await supabase.from('pcs').select('*');
  if (existing && existing.length > 0) {
    return existing as PC[]; // Cast si matches interface.
  }

  // Seed 20 PCs ejemplo.
  const pcs: Omit<PC, 'id'>[] = Array.from({ length: 20 }, (_, i) => ({
    number: i + 1,
    status: (i % 7 === 0 ? 'ocupada' : i % 11 === 0 ? 'mantenimiento' : 'libre') as PC['status'], // FIX: Usa PC['status'] (self-reference).
    location: `Zona ${Math.floor(i / 5) + 1}`,
    specs: 'Intel i7, 16GB RAM, RTX 3060'
  }));

  const { data, error } = await supabase.from('pcs').insert(pcs).select();
  if (error) throw new Error(error.message);
  return data as PC[];
};

// NUEVO: Función para obtener PCs (para AdminPCManagement).
export const getPCs = async (): Promise<PC[]> => {
  const { data, error } = await supabase.from('pcs').select('*');
  if (error) throw new Error(error.message);
  return data || [] as PC[];
};

// NUEVO: Función para actualizar status PC.
export const updatePCStatus = async (pcId: string, status: PC['status']): Promise<void> => {
  const { error } = await supabase.from('pcs').update({ status }).eq('id', pcId);
  if (error) throw new Error(error.message);
};

// Initialize mock users (seed si vacío; nota: auth.users maneja emails, esta tabla es custom para name/role).
export const initializeUsers = async (): Promise<void> => {
  // Check si ya hay data (excluye auth.users).
  const { data: existing } = await supabase.from('users').select('*');
  if (existing && existing.length > 0) return;

  // Seed users ejemplo (emails deben coincidir con auth.users si seed auth primero).
  const users = [
    {
      id: 'mock-admin-id', // Debe coincidir con auth.user.id post-register.
      name: 'Admin Demo',
      email: 'admin@test.com',
      role: 'admin' as const
    },
    {
      id: 'mock-client-id',
      name: 'Cliente Demo',
      email: 'cliente@test.com',
      role: 'cliente' as const
    }
  ];

  const { error } = await supabase.from('users').insert(users);
  if (error) throw new Error(error.message);
};

// Función para obtener usuarios (para AdminUserManagement; filtra por role si RLS).
export const getMockUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at, is_banned') // Asume columna is_banned en DB.
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  // Mapea a interface (agrega isBanned si no en DB).
  return (data || []).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as UserRole, // FIX: Usa UserRole (exportado arriba).
    createdAt: new Date(u.created_at).toISOString().split('T')[0],
    isBanned: u.is_banned || false, // Default false si no columna.
  }));
};

// NUEVO: Función para banear user.
export const banUser = async (userId: string): Promise<void> => {
  const { error } = await supabase.from('users').update({ is_banned: true }).eq('id', userId);
  if (error) throw error;
};

// NUEVO: Función para editar role user.
export const editUserRole = async (userId: string, role: UserRole): Promise<void> => { // FIX: Usa UserRole exportado.
  const { error } = await supabase.from('users').update({ role }).eq('id', userId);
  if (error) throw error;
};

// Generate demand predictions (query from DB; seed si vacío).
export const generateDemandPredictions = async (): Promise<DemandPrediction[]> => {
  // Check si data existe.
  const { data: existing } = await supabase.from('predictions').select('*');
  if (existing && existing.length > 0) {
    return existing as DemandPrediction[];
  }

  // Seed si vacío (igual que antes).
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const predictions: Omit<DemandPrediction, 'id'>[] = [];

  days.forEach(day => {
    for (let hour = 8; hour <= 23; hour++) {
      const isPeak = hour >= 14 && hour <= 22;
      const isWeekend = day === 'Sábado' || day === 'Domingo';
      
      let baseUsage = isPeak ? 60 : 30;
      if (isWeekend) baseUsage += 20;
      
      const variance = Math.random() * 20 - 10;
      const predictedUsage = Math.max(0, Math.min(100, baseUsage + variance));

      predictions.push({
        hour,
        day,
        predictedUsage: Math.round(predictedUsage)
      });
    }
  });

  const { data, error } = await supabase.from('predictions').insert(predictions).select();
  if (error) throw new Error(error.message);
  return data as DemandPrediction[];
};

// Get active sessions (query Supabase; calcula elapsedTime en frontend).
export const getActiveSessions = async (): Promise<ActiveSession[]> => {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      id, user_id, pc_number, start_time,
      users!user_id (name)  // Join para userName.
    `)
    .eq('status', 'active')
    .order('start_time', { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((session: any) => ({
    id: session.id,
    userId: session.user_id,
    userName: session.users.name, // Del join.
    pcId: session.pc_id || '', // Si FK.
    pcNumber: session.pc_number,
    startTime: session.start_time,
    elapsedTime: Math.floor((Date.now() - new Date(session.start_time).getTime()) / 60000), // Minutos transcurridos.
  }));
};

// Initialize all mock data (ahora seeds async en Supabase).
export const initializeMockData = async (): Promise<void> => {
  try {
    await initializeUsers();
    await initializePCs();
    // Seeds predictions en generateDemandPredictions si llamas.
  } catch (error) {
    console.error('Error seeding mock data:', error);
  }
};