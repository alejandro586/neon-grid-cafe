import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { Users, User, Shield, Ban, Edit3, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // MEJORA: Para search.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge'; // MEJORA: Badges para roles/estado.
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getMockUsers } from '@/utils/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'cliente' | 'admin';
  createdAt: string;
  lastLogin: string; // MEJORA: Nueva prop mock.
  isBanned: boolean;
}

export default function AdminUserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<'cliente' | 'admin'>('cliente');
  const [searchTerm, setSearchTerm] = useState(''); // MEJORA: Search.
  const { toast } = useToast();

  useEffect(() => {
    const mockUsers = getMockUsers().map(u => ({ ...u, lastLogin: '2025-10-20' })); // Mock lastLogin.
    setUsers(mockUsers);
  }, []);

  // MEJORA: Filtro con memo.
  const filteredUsers = useMemo(() => 
    users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())),
    [users, searchTerm]
  );

  const handleEditRole = (userId: string, newRole: 'cliente' | 'admin') => {
    if (userId === currentUser?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puedes cambiar tu propio rol",
      });
      return;
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    setEditingId(null);
    toast({
      title: "Usuario actualizado",
      description: `${newRole === 'admin' ? 'Promovido a' : 'Degradado a'} cliente`,
    });
  };

  const handleBanUser = (userId: string) => {
    if (userId === currentUser?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No puedes banearte a ti mismo",
      });
      return;
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: true } : u));
    toast({
      title: "Usuario baneado",
      description: "El usuario ha sido bloqueado",
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary neon-text" />
              <h1 className="text-4xl font-bold neon-text glitch-effect">Gestión de Usuarios</h1>
            </div>
          </motion.div>

          {/* MEJORA: Search input. */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="cyber-card p-4 mb-6"
          >
            <div className="flex items-center gap-2">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cyber-input flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="cyber-card overflow-hidden"
          >
            {filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No hay usuarios que coincidan...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/30">
                      <th className="text-left p-4">Nombre</th>
                      <th className="text-left p-4">Email</th>
                      <th className="text-left p-4">Rol</th>
                      <th className="text-left p-4">Creado</th>
                      <th className="text-left p-4">Último Login</th> {/* MEJORA: Nueva columna. */}
                      <th className="text-left p-4">Estado</th>
                      <th className="text-left p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredUsers.map((user, i) => (
                        <motion.tr 
                          key={user.id} 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: 20 }} 
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-primary/10"
                        >
                          <td className="p-4 font-medium">{user.name}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">
                            <Badge 
                              variant={user.role === 'admin' ? "default" : "secondary"} 
                              className="neon-text"
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 text-sm text-muted-foreground">{new Date(user.lastLogin).toLocaleDateString()}</td> {/* MEJORA. */}
                          <td className="p-4">
                            <Badge 
                              variant={user.isBanned ? "destructive" : "secondary"} 
                              className="neon-text"
                            >
                              {user.isBanned ? 'Baneado' : 'Activo'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-2">
                              {!user.isBanned && (
                                <Button
                                  onClick={() => setEditingId(editingId === user.id ? null : user.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="cyber-button"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  Editar Rol
                                </Button>
                              )}
                              <AnimatePresence>
                                {editingId === user.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-1"
                                  >
                                    <Select value={editRole} onValueChange={(value) => setEditRole(value as 'cliente' | 'admin')}>
                                      <SelectTrigger className="w-32 cyber-input">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="cliente">Cliente</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      onClick={() => handleEditRole(user.id, editRole)}
                                      size="sm"
                                      className="cyber-button w-full"
                                    >
                                      Guardar
                                    </Button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              {!user.isBanned && (
                                <Button
                                  onClick={() => handleBanUser(user.id)}
                                  variant="destructive"
                                  size="sm"
                                  aria-label={`Banear usuario ${user.name}`}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Banear
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}