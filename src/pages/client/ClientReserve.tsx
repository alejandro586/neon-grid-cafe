import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { initializePCs, type PC } from '@/utils/mockData';
import { Calendar } from 'lucide-react';

export default function ClientReserve() {
  const [searchParams] = useSearchParams();
  const preSelectedPC = searchParams.get('pc');
  
  const [pcs, setPcs] = useState<PC[]>([]);
  const [selectedPC, setSelectedPC] = useState(preSelectedPC || '');
  const [duration, setDuration] = useState('1');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const availablePCs = initializePCs().filter(pc => pc.status === 'libre');
    setPcs(availablePCs);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPC || !date || !time) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos",
      });
      return;
    }

    // Save reservation
    const reservations = JSON.parse(localStorage.getItem('cybercafe_reservations') || '[]');
    const newReservation = {
      id: Date.now().toString(),
      userId: user?.id,
      pcId: selectedPC,
      startTime: `${date} ${time}`,
      duration: parseInt(duration),
      status: 'activa'
    };

    reservations.push(newReservation);
    localStorage.setItem('cybercafe_reservations', JSON.stringify(reservations));

    toast({
      title: "¡Reserva creada!",
      description: `Tu PC estará lista el ${date} a las ${time}`,
    });

    navigate('/dashboard/cliente/my-account');
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold neon-text">Nueva Reserva</h1>
          </div>

          <form onSubmit={handleSubmit} className="cyber-card space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pc">Seleccionar PC</Label>
              <Select value={selectedPC} onValueChange={setSelectedPC}>
                <SelectTrigger className="cyber-input">
                  <SelectValue placeholder="Elige una PC disponible" />
                </SelectTrigger>
                <SelectContent>
                  {pcs.map(pc => (
                    <SelectItem key={pc.id} value={pc.id}>
                      PC #{pc.number} - {pc.location} ({pc.specs})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="cyber-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora de Inicio</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="cyber-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duración (horas)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="cyber-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hora</SelectItem>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="3">3 horas</SelectItem>
                  <SelectItem value="4">4 horas</SelectItem>
                  <SelectItem value="6">6 horas</SelectItem>
                  <SelectItem value="8">8 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="cyber-card bg-primary/10 border-primary/50">
              <h3 className="font-bold mb-2">Resumen</h3>
              <p className="text-sm text-muted-foreground">
                {selectedPC && pcs.find(pc => pc.id === selectedPC)?.number && (
                  <>PC: #{pcs.find(pc => pc.id === selectedPC)?.number}<br /></>
                )}
                Fecha: {date || 'No seleccionada'}<br />
                Hora: {time || 'No seleccionada'}<br />
                Duración: {duration} hora(s)<br />
                <span className="text-primary font-bold">
                  Total: ${parseInt(duration) * 5}.00
                </span>
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1 cyber-button">
                Confirmar Reserva
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard/cliente')}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
