import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, Edit, Trash2, Users, Shield, User as UserIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'cliente' | 'admin';
  password: string;
  createdAt?: string;
}

export default function AdminManageUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'cliente' | 'admin'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cliente' as 'cliente' | 'admin',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('cybercafe_users') || '[]');
    setUsers(storedUsers);
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;

    // Actualizar usuario
    const updatedUsers = users.map(user => 
      user.id === editingUser.id 
        ? { ...user, ...formData }
        : user
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('cybercafe_users', JSON.stringify(updatedUsers));
    
    // Actualizar el usuario actual si es el mismo
    const currentUser = JSON.parse(localStorage.getItem('cybercafe_user') || 'null');
    if (currentUser && currentUser.id === editingUser.id) {
      const updatedCurrentUser = { ...currentUser, ...formData };
      localStorage.setItem('cybercafe_user', JSON.stringify(updatedCurrentUser));
    }
    
    toast({
      title: "✓ Usuario actualizado",
      description: "La información del usuario ha sido actualizada",
    });

    resetForm();
  };

  const handleDelete = (userId: string) => {
    const currentUser = JSON.parse(localStorage.getItem('cybercafe_user') || 'null');
    
    if (currentUser && currentUser.id === userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puedes eliminar tu propio usuario",
      });
      return;
    }

    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('cybercafe_users', JSON.stringify(updatedUsers));
    
    toast({
      title: "✓ Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'cliente',
    });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const getRoleColor = (role: 'cliente' | 'admin') => {
    return role === 'admin' 
      ? 'bg-accent/20 text-accent border-accent/50' 
      : 'bg-primary/20 text-primary border-primary/50';
  };

  const getRoleIcon = (role: 'cliente' | 'admin') => {
    return role === 'admin' ? Shield : UserIcon;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold neon-text mb-2">Gestionar Usuarios</h1>
            <p className="text-muted-foreground">Administra los usuarios del sistema</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Usuarios</p>
                  <p className="text-3xl font-bold text-primary">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </Card>
            <Card className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Clientes</p>
                  <p className="text-3xl font-bold text-primary">
                    {users.filter(u => u.role === 'cliente').length}
                  </p>
                </div>
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
            </Card>
            <Card className="cyber-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Administradores</p>
                  <p className="text-3xl font-bold text-accent">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-accent" />
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="cyber-card p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="cyber-input pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
                <SelectTrigger className="cyber-input w-48">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="cliente">Clientes</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Lista de Usuarios */}
          <Card className="cyber-card">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Lista de Usuarios</h2>
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No se encontraron usuarios</p>
                    <p className="text-sm">Intenta con otros filtros de búsqueda</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-primary/20 hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <RoleIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">ID: {user.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                            className="hover:bg-primary/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
                            className="hover:bg-destructive/20 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>

          {/* Dialog de Edición */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="cyber-card">
              <DialogHeader>
                <DialogTitle className="neon-text">Editar Usuario</DialogTitle>
                <DialogDescription>
                  Actualiza la información del usuario
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="cyber-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="cyber-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: 'cliente' | 'admin') => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="cyber-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="cyber-button flex-1">
                    Actualizar
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
      </main>
    </div>
  );
}
