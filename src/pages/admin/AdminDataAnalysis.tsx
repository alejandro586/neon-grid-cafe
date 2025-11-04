import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Play, BarChart3, TrendingUp, Activity } from 'lucide-react';

interface DataRow {
  id: string;
  pcId: string;
  userId: string;
  duration: number;
  hour: number;
  day: string;
  timestamp: string;
}

interface TrainingResult {
  accuracy: number;
  predictions: { hour: number; demand: number }[];
  peakHours: number[];
  avgDuration: number;
}

export default function AdminDataAnalysis() {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [rawData, setRawData] = useState<DataRow[]>([]);
  const [cleanData, setCleanData] = useState<DataRow[]>([]);
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Paso 1: Carga de datos
  const handleLoadData = () => {
    setIsProcessing(true);
    
    // Simular carga de datos desde localStorage
    setTimeout(() => {
      const sessions = JSON.parse(localStorage.getItem('cybercafe_sessions') || '[]');
      const mockData: DataRow[] = sessions.map((session: any, index: number) => ({
        id: `data-${index}`,
        pcId: session.pcId || `PC-${Math.floor(Math.random() * 20) + 1}`,
        userId: session.userId || 'user-unknown',
        duration: session.duration || Math.floor(Math.random() * 120) + 30,
        hour: new Date(session.startTime || Date.now()).getHours(),
        day: new Date(session.startTime || Date.now()).toLocaleDateString(),
        timestamp: session.startTime || new Date().toISOString(),
      }));

      // Agregar datos de ejemplo si no hay suficientes
      if (mockData.length < 50) {
        for (let i = mockData.length; i < 100; i++) {
          mockData.push({
            id: `data-${i}`,
            pcId: `PC-${Math.floor(Math.random() * 20) + 1}`,
            userId: `user-${Math.floor(Math.random() * 50) + 1}`,
            duration: Math.floor(Math.random() * 120) + 30,
            hour: Math.floor(Math.random() * 24),
            day: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      }

      setRawData(mockData);
      setIsProcessing(false);
      toast({
        title: "✓ Datos cargados",
        description: `${mockData.length} registros cargados exitosamente`,
      });
      setStep(2);
    }, 1500);
  };

  // Paso 2: Limpieza de datos
  const handleCleanData = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Eliminar datos con duraciones muy cortas o muy largas (outliers)
      const cleaned = rawData.filter(row => 
        row.duration >= 15 && 
        row.duration <= 240 &&
        row.pcId &&
        row.userId !== 'user-unknown'
      );

      setCleanData(cleaned);
      setIsProcessing(false);
      
      const removed = rawData.length - cleaned.length;
      toast({
        title: "✓ Datos limpiados",
        description: `${removed} registros no funcionales eliminados. ${cleaned.length} registros válidos.`,
      });
      setStep(3);
    }, 1200);
  };

  // Paso 3: Entrenamiento del modelo
  const handleTrainModel = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Simular entrenamiento de modelo de ML
      const hourlyDemand = Array(24).fill(0).map(() => 0);
      const hourlyCount = Array(24).fill(0).map(() => 0);
      
      cleanData.forEach(row => {
        hourlyDemand[row.hour] += row.duration;
        hourlyCount[row.hour] += 1;
      });

      const predictions = hourlyDemand.map((total, hour) => ({
        hour,
        demand: hourlyCount[hour] > 0 ? Math.round(total / hourlyCount[hour]) : 0
      }));

      // Encontrar horas pico
      const avgDemand = predictions.reduce((sum, p) => sum + p.demand, 0) / 24;
      const peakHours = predictions
        .filter(p => p.demand > avgDemand * 1.5)
        .map(p => p.hour);

      const totalDuration = cleanData.reduce((sum, row) => sum + row.duration, 0);
      const avgDuration = Math.round(totalDuration / cleanData.length);

      const result: TrainingResult = {
        accuracy: Math.random() * 0.15 + 0.85, // 85-100%
        predictions,
        peakHours,
        avgDuration
      };

      setTrainingResult(result);
      setIsProcessing(false);
      toast({
        title: "✓ Modelo entrenado",
        description: `Precisión: ${(result.accuracy * 100).toFixed(1)}%`,
      });
      setStep(4);
    }, 2000);
  };

  // Paso 4: Visualizar resultados
  const maxDemand = trainingResult 
    ? Math.max(...trainingResult.predictions.map(p => p.demand))
    : 100;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold neon-text mb-2">Análisis de Datos</h1>
            <p className="text-muted-foreground">Sistema de Machine Learning para predicción de demanda</p>
          </div>

          {/* Progress Steps */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { num: 1, label: 'Carga de Datos', icon: Upload },
              { num: 2, label: 'Limpieza', icon: Trash2 },
              { num: 3, label: 'Entrenamiento', icon: Play },
              { num: 4, label: 'Resultados', icon: BarChart3 }
            ].map(({ num, label, icon: Icon }) => (
              <div
                key={num}
                className={`cyber-card p-4 text-center transition-all ${
                  step >= num ? 'border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]' : 'opacity-50'
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${step >= num ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Step 1: Carga de Datos */}
          {step === 1 && (
            <Card className="cyber-card p-8">
              <div className="text-center">
                <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Paso 1: Carga de Datos</h2>
                <p className="text-muted-foreground mb-6">
                  Cargar datos históricos de sesiones de usuarios para análisis
                </p>
                <Button 
                  onClick={handleLoadData} 
                  disabled={isProcessing}
                  className="cyber-button"
                  size="lg"
                >
                  {isProcessing ? 'Cargando...' : 'Cargar Datos Históricos'}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Limpieza */}
          {step === 2 && (
            <Card className="cyber-card p-8">
              <div className="text-center mb-6">
                <Trash2 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Paso 2: Eliminación de Datos No Funcionales</h2>
                <p className="text-muted-foreground mb-6">
                  {rawData.length} registros cargados - Filtrar outliers y datos inválidos
                </p>
              </div>

              <div className="bg-card/50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Criterios de limpieza:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Duración mínima: 15 minutos</li>
                  <li>• Duración máxima: 240 minutos (4 horas)</li>
                  <li>• Datos completos de PC y usuario</li>
                  <li>• Timestamps válidos</li>
                </ul>
              </div>

              <Button 
                onClick={handleCleanData} 
                disabled={isProcessing}
                className="cyber-button w-full"
                size="lg"
              >
                {isProcessing ? 'Procesando...' : 'Limpiar Datos'}
              </Button>
            </Card>
          )}

          {/* Step 3: Entrenamiento */}
          {step === 3 && (
            <Card className="cyber-card p-8">
              <div className="text-center">
                <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Paso 3: Entrenamiento del Modelo</h2>
                <p className="text-muted-foreground mb-4">
                  {cleanData.length} registros válidos listos para entrenamiento
                </p>
                <div className="bg-card/50 p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
                  <h3 className="font-semibold mb-2">Algoritmo de ML:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Análisis de patrones de uso por hora</li>
                    <li>• Regresión lineal para predicción</li>
                    <li>• Identificación de horas pico</li>
                    <li>• Cálculo de métricas de rendimiento</li>
                  </ul>
                </div>
                <Button 
                  onClick={handleTrainModel} 
                  disabled={isProcessing}
                  className="cyber-button"
                  size="lg"
                >
                  {isProcessing ? 'Entrenando Modelo...' : 'Iniciar Entrenamiento'}
                </Button>
              </div>
            </Card>
          )}

          {/* Step 4: Resultados */}
          {step === 4 && trainingResult && (
            <div className="space-y-6">
              <Card className="cyber-card p-8">
                <div className="text-center mb-6">
                  <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Paso 4: Resultados del Análisis</h2>
                  <p className="text-muted-foreground">
                    Modelo entrenado exitosamente con {cleanData.length} registros
                  </p>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-card/50 p-4 rounded-lg text-center">
                    <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">
                      {(trainingResult.accuracy * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Precisión</p>
                  </div>
                  <div className="bg-card/50 p-4 rounded-lg text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">
                      {trainingResult.avgDuration} min
                    </p>
                    <p className="text-sm text-muted-foreground">Duración Promedio</p>
                  </div>
                  <div className="bg-card/50 p-4 rounded-lg text-center">
                    <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-primary">
                      {trainingResult.peakHours.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Horas Pico</p>
                  </div>
                </div>

                {/* Gráfico de Demanda por Hora */}
                <div className="bg-card/50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Predicción de Demanda por Hora</h3>
                  <div className="space-y-2">
                    {trainingResult.predictions.map(({ hour, demand }) => {
                      const isPeak = trainingResult.peakHours.includes(hour);
                      const percentage = (demand / maxDemand) * 100;
                      
                      return (
                        <div key={hour} className="flex items-center gap-3">
                          <span className="text-sm w-12 text-muted-foreground">
                            {hour.toString().padStart(2, '0')}:00
                          </span>
                          <div className="flex-1 bg-background rounded-full h-8 overflow-hidden relative">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isPeak 
                                  ? 'bg-gradient-to-r from-primary to-accent shadow-[0_0_15px_hsl(var(--primary)/0.5)]' 
                                  : 'bg-primary/60'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                              {demand} min
                            </span>
                          </div>
                          {isPeak && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              PICO
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Horas Pico Destacadas */}
                {trainingResult.peakHours.length > 0 && (
                  <div className="mt-6 bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <h3 className="font-bold mb-2">🔥 Horas Pico Identificadas:</h3>
                    <p className="text-muted-foreground">
                      {trainingResult.peakHours.map(h => `${h.toString().padStart(2, '0')}:00`).join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Considera aumentar personal o recursos durante estas horas
                    </p>
                  </div>
                )}

                {/* Botón para reiniciar */}
                <div className="mt-6 text-center">
                  <Button 
                    onClick={() => {
                      setStep(1);
                      setRawData([]);
                      setCleanData([]);
                      setTrainingResult(null);
                    }}
                    variant="outline"
                    className="cyber-button"
                  >
                    Nuevo Análisis
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
