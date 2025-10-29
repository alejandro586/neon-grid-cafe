import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { getActiveSessions, type ActiveSession } from '@/utils/mockData';
import { Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSessions = () => {
    setSessions(getActiveSessions());
  };

  const handleEndSession = (sessionId: string) => {
    const allSessions = JSON.parse(localStorage.getItem('cybercafe_sessions') || '[]');
    const updated = allSessions.filter((s: any) => s.id !== sessionId);
    localStorage.setItem('cybercafe_sessions', JSON.stringify(updated));
    loadSessions();
    toast({ title: "Sesión finalizada", description: "La sesión ha sido terminada exitosamente" });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Monitor className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold neon-text">Sesiones Activas</h1>
          </div>

          <div className="cyber-card">
            {sessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No hay sesiones activas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/30">
                      <th className="text-left p-4">Usuario</th>
                      <th className="text-left p-4">PC</th>
                      <th className="text-left p-4">Tiempo</th>
                      <th className="text-left p-4">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(session => (
                      <tr key={session.id} className="border-b border-primary/10">
                        <td className="p-4">{session.userName}</td>
                        <td className="p-4">PC #{session.pcNumber}</td>
                        <td className="p-4 text-primary">{session.elapsedTime} min</td>
                        <td className="p-4">
                          <Button onClick={() => handleEndSession(session.id)} variant="destructive" size="sm">
                            Finalizar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
