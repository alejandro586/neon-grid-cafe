import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { generateDemandPredictions, type DemandPrediction } from '@/utils/mockData';
import { TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ClientDemand() {
  const [predictions, setPredictions] = useState<DemandPrediction[]>([]);
  const [selectedDay, setSelectedDay] = useState('Lunes');

  useEffect(() => {
    const data = generateDemandPredictions();
    setPredictions(data);
  }, []);

  const dayData = predictions.filter(p => p.day === selectedDay);
  const maxUsage = Math.max(...dayData.map(p => p.predictedUsage));

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold neon-text">Predicción de Demanda</h1>
          </div>

          <div className="cyber-card mb-8">
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
          </div>

          <div className="cyber-card">
            <h2 className="text-2xl font-bold mb-6">{selectedDay} - Ocupación por Hora</h2>
            
            <div className="space-y-4">
              {dayData.map((prediction) => {
                const percentage = (prediction.predictedUsage / maxUsage) * 100;
                const color = 
                  prediction.predictedUsage > 70 ? 'bg-destructive' :
                  prediction.predictedUsage > 40 ? 'bg-accent' :
                  'bg-secondary';

                return (
                  <div key={`${prediction.day}-${prediction.hour}`} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {prediction.hour}:00
                      </span>
                      <span className="text-sm text-primary font-bold">
                        {prediction.predictedUsage}% ocupación
                      </span>
                    </div>
                    <div className="h-8 bg-muted rounded-lg overflow-hidden">
                      <div
                        className={`h-full ${color} transition-all duration-500 flex items-center justify-end pr-2`}
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 20 && (
                          <span className="text-xs font-bold text-background">
                            {prediction.predictedUsage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-secondary rounded mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Baja demanda</p>
                <p className="text-xs text-muted-foreground">(&lt; 40%)</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-accent rounded mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Media demanda</p>
                <p className="text-xs text-muted-foreground">(40-70%)</p>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-destructive rounded mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Alta demanda</p>
                <p className="text-xs text-muted-foreground">(&gt; 70%)</p>
              </div>
            </div>
          </div>

          <div className="cyber-card mt-8 bg-primary/10 border-primary/50">
            <h3 className="font-bold mb-2">💡 Consejo</h3>
            <p className="text-sm text-muted-foreground">
              Reserva en horarios de baja demanda para garantizar disponibilidad y evitar esperas.
              Los horarios más populares suelen ser de 14:00 a 22:00.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
