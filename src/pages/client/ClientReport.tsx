import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext'; // NUEVO: Para estado del sidebar.

export default function ClientReport() {
  const [subject, setSubject] = useState('');
  const [pcNumber, setPcNumber] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();
  const { isOpen } = useSidebar(); // NUEVO: Obtén si sidebar está abierto.
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    // Save report
    const reports = JSON.parse(localStorage.getItem('cybercafe_reports') || '[]');
    const newReport = {
      id: Date.now().toString(),
      userId: user?.id,
      userName: user?.name,
      subject,
      pcNumber,
      description,
      timestamp: new Date().toISOString(),
      status: 'pendiente'
    };

    reports.push(newReport);
    localStorage.setItem('cybercafe_reports', JSON.stringify(reports));

    toast({
      title: "¡Reporte enviado!",
      description: "Gracias por tu feedback. Revisaremos tu reporte pronto.",
    });

    // Reset form
    setSubject('');
    setPcNumber('');
    setDescription('');
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className={`flex-1 p-8 transition-all duration-300 ${isOpen ? 'ml-64' : 'mx-auto'}`}> {/* MODIFICACIÓN: Centra/expande según sidebar. */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <AlertCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold neon-text">Enviar Reporte</h1>
          </div>

          <form onSubmit={handleSubmit} className="cyber-card space-y-6">
            <p className="text-muted-foreground">
              Ayúdanos a mejorar reportando problemas o enviando sugerencias
            </p>

            <div className="space-y-2">
              <Label htmlFor="subject">Asunto *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="cyber-input"
                placeholder="Ej: Problema con PC, Mala atención, Sugerencia"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pcNumber">Número de PC (opcional)</Label>
              <Input
                id="pcNumber"
                type="number"
                value={pcNumber}
                onChange={(e) => setPcNumber(e.target.value)}
                className="cyber-input"
                placeholder="Ej: 5"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="cyber-input min-h-[150px]"
                placeholder="Describe detalladamente el problema o sugerencia..."
                required
              />
            </div>

            <div className="cyber-card bg-primary/10 border-primary/50">
              <h3 className="font-bold mb-2">📝 Tipos de reportes</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Problemas técnicos con las PCs</li>
                <li>• Quejas sobre el servicio o atención</li>
                <li>• Sugerencias de mejora</li>
                <li>• Problemas con reservas o pagos</li>
                <li>• Solicitudes especiales</li>
              </ul>
            </div>

            <Button type="submit" className="w-full cyber-button">
              Enviar Reporte
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}