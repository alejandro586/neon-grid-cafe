import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // FIX: Agrega AnimatePresence.
import { Sidebar } from '@/components/Sidebar';
import { generateDemandPredictions, type DemandPrediction } from '@/utils/mockData';
import { TrendingUp, BarChart3, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card'; // MEJORA: Cards para legend.

export default function AdminDemand() {
  const [predictions, setPredictions] = useState<DemandPrediction[]>([]);
  const [selectedDay, setSelectedDay] = useState('Lunes');

  useEffect(() => {
    const data = generateDemandPredictions();
    setPredictions(data);
  }, []);

  const dayData = useMemo(() => predictions.filter(p => p.day === selectedDay), [predictions, selectedDay]);
  const maxUsage = useMemo(() => Math.max(...dayData.map(p => p.predictedUsage)), [dayData]);
  const avgUsage = useMemo(() => Math.round(dayData.reduce((sum, p) => sum + p.predictedUsage, 0) / dayData.length), [dayData]);
  
  // MEJORA: Stats globales con memo.
  const weeklyStats = useMemo(() => {
    const weeklyPeak = Math.max(...predictions.map(p => p.predictedUsage));
    const lowDemandHours = predictions.filter(p => p.predictedUsage < 40).length / 7; // Aprox por día.
    const avgWeekly = Math.round(predictions.reduce((sum, p) => sum + p.predictedUsage, 0) / predictions.length);
    return { weeklyPeak, lowDemandHours: Math.round(lowDemandHours), avgWeekly };
  }, [predictions]);

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
            <BarChart3 className="h-8 w-8 text-primary neon-text" />
            <h1 className="text-4xl font-bold neon-text glitch-effect">Predicción de Demanda (Admin)</h1>
          </motion.div>

          {/* Stats cards animadas. */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="cyber-card text-center p-4"
            >
              <div className="text-3xl font-bold text-primary neon-text">{weeklyStats.weeklyPeak}%</div>
              <p className="text-muted-foreground text-sm">Demanda Pico Semanal</p>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.1 }}
              className="cyber-card text-center p-4"
            >
              <div className="text-3xl font-bold text-secondary neon-text">{avgUsage}%</div>
              <p className="text-muted-foreground text-sm">Promedio {selectedDay}</p>
            </motion.div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="cyber-card text-center p-4"
            >
              <div className="text-3xl font-bold text-accent neon-text">{weeklyStats.lowDemandHours}</div>
              <p className="text-muted-foreground text-sm">Horas Bajas Promedio</p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="cyber-card mb-8 p-4"
          >
            <h2 className="text-xl font-bold mb-4">Seleccionar Día</h2>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="cyber-input max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lunes">Lunes</SelectItem>
                <SelectItem value="Martes">Martes</SelectItem>
                <SelectItem value="Miércoles">Miércoles</SelectItem>
                <SelectItem value="Jueves">Jueves</SelectItem>
                <SelectItem value="Viernes">Viernes</SelectItem>
                <SelectItem value="Sábado">Sábado</SelectItem>
                <SelectItem value="Domingo">Domingo</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="cyber-card p-6"
          >
            <h2 className="text-2xl font-bold mb-6 neon-text">{selectedDay} - Ocupación por Hora</h2>
            
            <div className="space-y-4">
              <AnimatePresence> {/* FIX: Ahora importado, no error. */}
                {dayData.map((prediction, i) => {
                  const percentage = (prediction.predictedUsage / maxUsage) * 100;
                  const color = 
                    prediction.predictedUsage > 70 ? 'bg-destructive' :
                    prediction.predictedUsage > 40 ? 'bg-accent' :
                    'bg-secondary';

                  return (
                    <motion.div 
                      key={`${prediction.day}-${prediction.hour}`} 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      transition={{ delay: i * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium"> {prediction.hour}:00</span>
                        <span className="text-sm text-primary font-bold neon-text">
                          {prediction.predictedUsage}% ocupación
                        </span>
                      </div>
                      <div className="h-8 bg-muted rounded-lg overflow-hidden">
                        <motion.div
                          className={`h-full ${color} transition-all duration-500 flex items-center justify-end pr-2`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: percentage / 100 }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        >
                          {percentage > 20 && (
                            <span className="text-xs font-bold text-background">
                              {prediction.predictedUsage}%
                            </span>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* MEJORA: Legend en cards con hover. */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              {[
                { color: 'bg-secondary', label: 'Baja demanda', sub: '(< 40%)' },
                { color: 'bg-accent', label: 'Media demanda', sub: '(40-70%)' },
                { color: 'bg-destructive', label: 'Alta demanda', sub: '(> 70%)' },
              ].map((item, i) => (
                <motion.div 
                  key={item.label} 
                  whileHover={{ scale: 1.05 }} 
                  className="text-center cyber-card p-2"
                >
                  <div className={`w-4 h-4 ${item.color} rounded mx-auto mb-2`} />
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* MEJORA: Insight con motion y icono. */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="cyber-card mt-8 bg-primary/10 border-primary/50 p-4"
          >
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" /> 💡 Insight Admin
            </h3>
            <p className="text-sm text-muted-foreground">
              Promedio semanal: {weeklyStats.avgWeekly}%. Usa estos datos para ajustar horarios de mantenimiento o promociones en horas bajas. Demanda pico: {weeklyStats.weeklyPeak}% los fines de semana.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}