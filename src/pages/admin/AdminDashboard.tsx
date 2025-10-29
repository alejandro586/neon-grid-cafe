import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // NUEVO: Para animaciones.
import { Sidebar } from '@/components/Sidebar';
import { getActiveSessions, endSession, type ActiveSession } from '@/utils/mockData'; // MEJORA: Usa funcs Supabase.
import { Monitor, Users, Clock, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ActiveSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  // MEJORA: useMemo para filtro y stats (mejor perf).
  const filteredSessionsMemo = useMemo(() => 
    sessions.filter(session => session.userName.toLowerCase().includes(searchTerm.toLowerCase())),
    [sessions, searchTerm]
  );

  useEffect(() => {
    setFilteredSessions(filteredSessionsMemo);
  }, [filteredSessionsMemo]);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActiveSessions(); // MEJORA: Async Supabase query.
      setSessions(data);
      toast({ title: "Actualizado", description: "Sesiones refrescadas" });
    } catch (err: any) {
      setError(err.message || 'Error al cargar sesiones');
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las sesiones",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      await endSession(sessionId); // MEJORA: Supabase update.
      await loadSessions(); // Re-fetch para actualizar UI.
      toast({ title: "Sesión finalizada", description: "La sesión ha sido terminada exitosamente" });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo finalizar la sesión",
      });
    }
  };

  const getStats = useMemo(() => {
    if (sessions.length === 0) return { total: 0, uniquePCs: 0, avgTime: 0 };
    const uniquePCs = new Set(sessions.map(s => s.pcNumber)).size;
    // FIX: Usa Number() en lugar de parseInt() – maneja string/number sin TS error.
    const avgTime = Math.round(sessions.reduce((sum, s) => sum + Number(s.elapsedTime), 0) / sessions.length);
    return { total: sessions.length, uniquePCs, avgTime };
  }, [sessions]);

  const stats = getStats;

  if (error) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 p-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="max-w-6xl mx-auto"
          >
            <div className="cyber-card text-center py-12 glitch-effect"> {/* MEJORA: Glitch en error. */}
              <p className="text-destructive mb-4">Error: {error}</p>
              <Button onClick={loadSessions} className="cyber-button">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Reintentar
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <Monitor className="h-8 w-8 text-primary neon-text" />
              <h1 className="text-4xl font-bold neon-text glitch-effect">Sesiones Activas</h1>
            </div>
            <Button onClick={loadSessions} variant="outline" className="cyber-button">
              <RefreshCw className="h-4 w-4 mr-2" /> Refrescar
            </Button>
          </motion.div>

          {/* Stats cards con animaciones. */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {[
              { icon: Users, value: stats.total, label: 'Sesiones Activas', color: 'text-primary' },
              { icon: Monitor, value: stats.uniquePCs, label: 'PCs Ocupadas', color: 'text-secondary' },
              { icon: Clock, value: `${stats.avgTime} min`, label: 'Tiempo Promedio', color: 'text-accent' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label} 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="cyber-card text-center p-6"
              >
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-3xl font-bold neon-text">{stat.value}</div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Búsqueda con animación. */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="cyber-card p-4 mb-6"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cyber-input flex-1"
              />
            </div>
            <AnimatePresence>
              {searchTerm && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="text-xs text-muted-foreground mt-1"
                >
                  Mostrando {filteredSessions.length} de {sessions.length} sesiones
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="cyber-card"
          >
            {loading ? (
              <div className="space-y-4 p-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ delay: i * 0.1 }}
                      className="flex justify-between p-4 border-b border-primary/10"
                    >
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-8 w-24" />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : filteredSessions.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center text-muted-foreground py-12"
              >
                {searchTerm ? 'No hay sesiones que coincidan con la búsqueda' : 'No hay sesiones activas'}
              </motion.p>
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
                    <AnimatePresence>
                      {filteredSessions.map((session, i) => (
                        <motion.tr 
                          key={session.id} 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: 20 }} 
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-primary/10"
                        >
                          <td className="p-4">{session.userName}</td>
                          <td className="p-4">PC #{session.pcNumber}</td>
                          <td className="p-4 text-primary">{session.elapsedTime} min</td>
                          <td className="p-4">
                            <Button 
                              onClick={() => handleEndSession(session.id)} 
                              variant="destructive" 
                              size="sm"
                              className="cyber-button"
                              aria-label={`Finalizar sesión de ${session.userName}`}
                            >
                              Finalizar
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}