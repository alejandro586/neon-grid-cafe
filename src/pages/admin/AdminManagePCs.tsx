import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Monitor } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PC {
  id: string;
  location: string;
  status: 'libre' | 'ocupada' | 'mantenimiento';
  specs: string;
}

export default function AdminManagePCs() {
  const { toast } = useToast();
  const [pcs, setPcs] = useState<PC[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPC, setEditingPC] = useState<PC | null>(null);
  const [formData, setFormData] = useState({
    location: '',
    status: 'libre' as PC['status'],
    specs: '',
  });

  useEffect(() => {
    loadPCs();
  }, []);

  const loadPCs = () => {
    const storedPCs = JSON.parse(localStorage.getItem('cybercafe_pcs') || '[]');
    setPcs(storedPCs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPC) {
      // Actualizar PC existente
      const updatedPCs = pcs.map(pc => 
        pc.id === editingPC.id 
          ? { ...pc, ...formData }
          : pc
      );
      setPcs(updatedPCs);
      localStorage.setItem('cybercafe_pcs', JSON.stringify(updatedPCs));
      
      toast({
        title: "✓ PC actualizada",
        description: "La PC ha sido actualizada exitosamente",
      });
    } else {
      // Crear nueva PC
      const newPC: PC = {
        id: `PC-${Date.now()}`,
        ...formData,
      };
      const updatedPCs = [...pcs, newPC];
      setPcs(updatedPCs);
      localStorage.setItem('cybercafe_pcs', JSON.stringify(updatedPCs));
      
      toast({
        title: "✓ PC agregada",
        description: "Nueva PC agregada exitosamente",
      });
    }

    resetForm();
  };

  const handleEdit = (pc: PC) => {
    setEditingPC(pc);
    setFormData({
      location: pc.location,
      status: pc.status,
      specs: pc.specs,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (pcId: string) => {
    const updatedPCs = pcs.filter(pc => pc.id !== pcId);
    setPcs(updatedPCs);
    localStorage.setItem('cybercafe_pcs', JSON.stringify(updatedPCs));
    
    toast({
      title: "✓ PC eliminada",
      description: "La PC ha sido eliminada exitosamente",
    });
  };

  const resetForm = () => {
    setFormData({
      location: '',
      status: 'libre',
      specs: '',
    });
    setEditingPC(null);
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: PC['status']) => {
    switch (status) {
      case 'libre':
        return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'ocupada':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'mantenimiento':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
    }
  };

  const getStatusLabel = (status: PC['status']) => {
    switch (status) {
      case 'libre':
        return 'Libre';
      case 'ocupada':
        return 'Ocupada';
      case 'mantenimiento':
        return 'Mantenimiento';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold neon-text mb-2">Gestionar PCs</h1>
              <p className="text-muted-foreground">Administra el inventario de computadoras</p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="cyber-button" onClick={() => setEditingPC(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar PC
                </Button>
              </DialogTrigger>
              <DialogContent className="cyber-card">
                <DialogHeader>
                  <DialogTitle className="neon-text">
                    {editingPC ? 'Editar PC' : 'Nueva PC'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPC ? 'Actualiza la información de la PC' : 'Agrega una nueva PC al inventario'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Ej: Piso 1 - Mesa A1"
                      required
                      className="cyber-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specs">Especificaciones</Label>
                    <Input
                      id="specs"
                      value={formData.specs}
                      onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                      placeholder="Ej: Intel i5, 16GB RAM, RTX 3060"
                      required
                      className="cyber-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({ ...formData, status: value as PC['status'] })}
                    >
                      <SelectTrigger className="cyber-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="libre">Libre</SelectItem>
                        <SelectItem value="ocupada">Ocupada</SelectItem>
                        <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="cyber-button flex-1">
                      {editingPC ? 'Actualizar' : 'Agregar'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total PCs</p>
                  <p className="text-3xl font-bold text-primary">{pcs.length}</p>
                </div>
                <Monitor className="h-8 w-8 text-primary" />
              </div>
            </Card>
            <Card className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Disponibles</p>
                  <p className="text-3xl font-bold text-green-500">
                    {pcs.filter(pc => pc.status === 'libre').length}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                </div>
              </div>
            </Card>
            <Card className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Mantenimiento</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {pcs.filter(pc => pc.status === 'mantenimiento').length}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-yellow-500" />
                </div>
              </div>
            </Card>
          </div>

          {/* Lista de PCs */}
          <Card className="cyber-card">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Inventario de PCs</h2>
              <div className="space-y-3">
                {pcs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay PCs registradas</p>
                    <p className="text-sm">Agrega tu primera PC para comenzar</p>
                  </div>
                ) : (
                  pcs.map((pc) => (
                    <div
                      key={pc.id}
                      className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-primary/20 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Monitor className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-semibold">{pc.id}</p>
                          <p className="text-sm text-muted-foreground">{pc.location}</p>
                          <p className="text-xs text-muted-foreground mt-1">{pc.specs}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(pc.status)}`}>
                          {getStatusLabel(pc.status)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(pc)}
                          className="hover:bg-primary/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pc.id)}
                          className="hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
