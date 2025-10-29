import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { initializePCs, type PC } from '@/utils/mockData';
import { Monitor, Zap, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function ClientPCMap() {
  const [pcs, setPcs] = useState<PC[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadPCs = () => {
      const data = initializePCs();
      setPcs(data);
    };

    loadPCs();
    // Simulate real-time updates
    const interval = setInterval(() => {
      loadPCs();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePCClick = (pc: PC) => {
    if (pc.status === 'libre') {
      navigate(`/dashboard/cliente/reserve?pc=${pc.id}`);
    } else if (pc.status === 'ocupada') {
      toast({
        variant: "destructive",
        title: "PC Ocupada",
        description: `La PC #${pc.number} está actualmente en uso`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "PC en Mantenimiento",
        description: `La PC #${pc.number} no está disponible`,
      });
    }
  };

  const getStatusIcon = (status: PC['status']) => {
    switch (status) {
      case 'libre':
        return <Monitor className="h-12 w-12 text-secondary" />;
      case 'ocupada':
        return <Zap className="h-12 w-12 text-destructive" />;
      case 'mantenimiento':
        return <Wrench className="h-12 w-12 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: PC['status']) => {
    switch (status) {
      case 'libre':
        return 'border-secondary shadow-[0_0_15px_hsl(var(--secondary)/0.3)]';
      case 'ocupada':
        return 'border-destructive';
      case 'mantenimiento':
        return 'border-muted';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold neon-text mb-2">Mapa de PCs</h1>
          <p className="text-muted-foreground mb-8">Selecciona una PC disponible para reservar</p>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary rounded" />
              <span className="text-sm">Libre</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive rounded" />
              <span className="text-sm">Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded" />
              <span className="text-sm">Mantenimiento</span>
            </div>
          </div>

          {/* PC Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pcs.map((pc) => (
              <button
                key={pc.id}
                onClick={() => handlePCClick(pc)}
                className={`
                  cyber-card flex flex-col items-center justify-center p-6
                  ${getStatusColor(pc.status)}
                  ${pc.status === 'libre' ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-60'}
                  transition-all duration-300
                `}
                disabled={pc.status !== 'libre'}
              >
                {getStatusIcon(pc.status)}
                <span className="text-2xl font-bold mt-3 mb-1">#{pc.number}</span>
                <span className="text-xs text-muted-foreground uppercase">{pc.status}</span>
                <span className="text-xs text-muted-foreground mt-2">{pc.location}</span>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cyber-card text-center">
              <div className="text-4xl font-bold text-secondary mb-2">
                {pcs.filter(pc => pc.status === 'libre').length}
              </div>
              <div className="text-muted-foreground">PCs Disponibles</div>
            </div>
            <div className="cyber-card text-center">
              <div className="text-4xl font-bold text-destructive mb-2">
                {pcs.filter(pc => pc.status === 'ocupada').length}
              </div>
              <div className="text-muted-foreground">PCs Ocupadas</div>
            </div>
            <div className="cyber-card text-center">
              <div className="text-4xl font-bold text-muted-foreground mb-2">
                {pcs.filter(pc => pc.status === 'mantenimiento').length}
              </div>
              <div className="text-muted-foreground">En Mantenimiento</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
