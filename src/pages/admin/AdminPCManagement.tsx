import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { initializePCs, type PC } from '@/utils/mockData';
import { Settings, Monitor, Zap, Wrench, Edit, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // MEJORA: Para contadores.
import { useToast } from '@/hooks/use-toast';

export default function AdminPCManagement() {
  const [pcs, setPcs] = useState<PC[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<'libre' | 'ocupada' | 'mantenimiento'>('libre');
  const { toast } = useToast();

  useEffect(() => {
    setPcs(initializePCs());
  }, []);

  // MEJORA: Contadores por status.
  const statusCounts = useMemo(() => {
    const libre = pcs.filter(p => p.status === 'libre').length;
    const ocupada = pcs.filter(p => p.status === 'ocupada').length;
    const mantenimiento = pcs.filter(p => p.status === 'mantenimiento').length;
    return { libre, ocupada, mantenimiento };
  }, [pcs]);

  const handleEditStatus = (pcId: string, newStatus: PC['status']) => {
    setPcs(prev => prev.map(pc => pc.id === pcId ? { ...pc, status: newStatus } : pc));
    setEditingId(null);
    toast({
      title: "PC actualizada",
      description: `PC #${pcs.find(p => p.id === pcId)?.number} ahora está ${newStatus}`,
    });
  };

  const statusColor = (status: PC['status']) => {
    switch (status) {
      case 'libre': return 'bg-secondary';
      case 'ocupada': return 'bg-destructive';
      case 'mantenimiento': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center gap-3 mb-8"
          >
            <Settings className="h-8 w-8 text-primary neon-text" />
            <h1 className="text-4xl font-bold neon-text glitch-effect">Gestión de PCs</h1>
          </motion.div>

          {/* MEJORA: Contadores de status. */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {[
              { count: statusCounts.libre, label: 'Libres', color: 'text-secondary' },
              { count: statusCounts.ocupada, label: 'Ocupadas', color: 'text-destructive' },
              { count: statusCounts.mantenimiento, label: 'Mantenimiento', color: 'text-muted-foreground' },
            ].map((stat, i) => (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: i * 0.1 }}
                className="cyber-card text-center p-6"
              >
                <Monitor className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-3xl font-bold neon-text">{stat.count}</div>
                <p className="text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="cyber-card"
          >
            {pcs.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Cargando PCs...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full hidden md:table"> {/* MEJORA: Tabla solo desktop. */}
                  <thead>
                    <tr className="border-b border-primary/30">
                      <th className="text-left p-4">PC #</th>
                      <th className="text-left p-4">Ubicación</th>
                      <th className="text-left p-4">Estado</th>
                      <th className="text-left p-4">Especs</th>
                      <th className="text-left p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {pcs.map((pc, i) => (
                        <motion.tr 
                          key={pc.id} 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: 20 }} 
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-primary/10"
                        >
                          <td className="p-4 font-bold">#{pc.number}</td>
                          <td className="p-4">{pc.location}</td>
                          <td className="p-4">
                            <Badge className={`${statusColor(pc.status)} neon-text`}>
                              {pc.status}
                            </Badge>
                          </td>
                          <td className="p-4">{pc.specs}</td>
                          <td className="p-4">
                            <Button
                              onClick={() => setEditingId(editingId === pc.id ? null : pc.id)}
                              variant="ghost"
                              size="sm"
                              className="cyber-button"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AnimatePresence>
                              {editingId === pc.id && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }} 
                                  animate={{ opacity: 1, height: 'auto' }} 
                                  exit={{ opacity: 0, height: 0 }}
                                  className="flex gap-2 mt-2"
                                >
                                  {(['libre', 'ocupada', 'mantenimiento'] as PC['status'][]).map(status => (
                                    <Button
                                      key={status}
                                      onClick={() => handleEditStatus(pc.id, status)}
                                      variant="outline"
                                      size="sm"
                                      className="cyber-button"
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {/* MEJORA: Grid para mobile. */}
                <div className="md:hidden grid grid-cols-1 gap-4 p-4">
                  <AnimatePresence>
                    {pcs.map((pc, i) => (
                      <motion.div 
                        key={pc.id} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: i * 0.05 }}
                        className="cyber-card p-4 border-b border-primary/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">PC #{pc.number}</h3>
                          <Badge className={`${statusColor(pc.status)} neon-text`}>
                            {pc.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Ubicación: {pc.location}</p>
                        <p className="text-sm text-muted-foreground mb-4">Especs: {pc.specs}</p>
                        <Button
                          onClick={() => setEditingId(editingId === pc.id ? null : pc.id)}
                          variant="ghost"
                          size="sm"
                          className="cyber-button mb-2"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Estado
                        </Button>
                        <AnimatePresence>
                          {editingId === pc.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }} 
                              exit={{ opacity: 0, height: 0 }}
                              className="flex flex-wrap gap-2"
                            >
                              {(['libre', 'ocupada', 'mantenimiento'] as PC['status'][]).map(status => (
                                <Button
                                  key={status}
                                  onClick={() => handleEditStatus(pc.id, status)}
                                  variant="outline"
                                  size="sm"
                                  className="cyber-button"
                                >
                                  {status}
                                </Button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}