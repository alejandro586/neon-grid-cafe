import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Calendar, X } from 'lucide-react';
import { initializePCs } from '@/utils/mockData';
import { useSidebar } from '@/contexts/SidebarContext'; // NUEVO: Para estado del sidebar.

interface Reservation {
  id: string;
  pcId: string;
  startTime: string;
  duration: number;
  status: 'activa' | 'completada' | 'cancelada';
}

export default function ClientAccount() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const { isOpen } = useSidebar(); // NUEVO: Obtén si sidebar está abierto.
  const { toast } = useToast();

  useEffect(() => {
    loadReservations();
  }, [user]);

  const loadReservations = () => {
    const allReservations = JSON.parse(localStorage.getItem('cybercafe_reservations') || '[]');
    const userReservations = allReservations.filter((r: any) => r.userId === user?.id);
    setReservations(userReservations);
  };

  const handleUpdateProfile = () => {
    toast({
      title: "Perfil actualizado",
      description: "Tus cambios han sido guardados (demo)",
    });
  };

  const handleCancelReservation = (reservationId: string) => {
    const allReservations = JSON.parse(localStorage.getItem('cybercafe_reservations') || '[]');
    const updated = allReservations.map((r: any) => 
      r.id === reservationId ? { ...r, status: 'cancelada' } : r
    );
    localStorage.setItem('cybercafe_reservations', JSON.stringify(updated));
    loadReservations();
    
    toast({
      title: "Reserva cancelada",
      description: "Tu reserva ha sido cancelada exitosamente",
    });
  };

  const getPCNumber = (pcId: string) => {
    const pcs = initializePCs();
    return pcs.find(pc => pc.id === pcId)?.number || '?';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa': return 'text-secondary';
      case 'completada': return 'text-muted-foreground';
      case 'cancelada': return 'text-destructive';
      default: return '';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className={`flex-1 p-8 transition-all duration-300 ${isOpen ? 'ml-64' : 'mx-auto'}`}> {/* MODIFICACIÓN: Centra/expande según sidebar. */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold neon-text">Mi Cuenta</h1>
          </div>

          {/* Profile Section */}
          <div className="cyber-card">
            <h2 className="text-2xl font-bold mb-6">Información Personal</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cyber-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Input
                  value={user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                  disabled
                  className="cyber-input opacity-60"
                />
              </div>
              <Button onClick={handleUpdateProfile} className="cyber-button">
                Guardar Cambios
              </Button>
            </div>
          </div>

          {/* Reservations History */}
          <div className="cyber-card">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Historial de Reservas</h2>
            </div>

            {reservations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No tienes reservas aún
              </p>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-primary/20"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">PC #{getPCNumber(reservation.pcId)}</span>
                        <span className={`text-sm uppercase font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reservation.startTime} • {reservation.duration}h
                      </p>
                    </div>
                    {reservation.status === 'activa' && (
                      <Button
                        onClick={() => handleCancelReservation(reservation.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}