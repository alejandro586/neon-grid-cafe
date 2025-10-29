// Mock data for the application

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

// Initialize mock PCs
export const initializePCs = (): PC[] => {
  const stored = localStorage.getItem('cybercafe_pcs');
  if (stored) return JSON.parse(stored);

  const pcs: PC[] = Array.from({ length: 20 }, (_, i) => ({
    id: `pc-${i + 1}`,
    number: i + 1,
    status: i % 7 === 0 ? 'ocupada' : i % 11 === 0 ? 'mantenimiento' : 'libre',
    location: `Zona ${Math.floor(i / 5) + 1}`,
    specs: 'Intel i7, 16GB RAM, RTX 3060'
  }));

  localStorage.setItem('cybercafe_pcs', JSON.stringify(pcs));
  return pcs;
};

// Initialize mock users
export const initializeUsers = () => {
  const stored = localStorage.getItem('cybercafe_users');
  if (stored) return;

  const users = [
    {
      id: '1',
      name: 'Cliente Demo',
      email: 'cliente@test.com',
      password: '123456',
      role: 'cliente'
    },
    {
      id: '2',
      name: 'Admin Demo',
      email: 'admin@test.com',
      password: '123456',
      role: 'admin'
    }
  ];

  localStorage.setItem('cybercafe_users', JSON.stringify(users));
};

// Generate demand predictions
export const generateDemandPredictions = (): DemandPrediction[] => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const predictions: DemandPrediction[] = [];

  days.forEach(day => {
    for (let hour = 8; hour <= 23; hour++) {
      // Simulate peak hours (afternoon/evening)
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

  return predictions;
};

// Get active sessions
export const getActiveSessions = (): ActiveSession[] => {
  const sessions = localStorage.getItem('cybercafe_sessions');
  if (!sessions) return [];
  
  return JSON.parse(sessions).map((session: any) => ({
    ...session,
    elapsedTime: Math.floor((Date.now() - new Date(session.startTime).getTime()) / 60000)
  }));
};

// Initialize all mock data
export const initializeMockData = () => {
  initializeUsers();
  initializePCs();
};
