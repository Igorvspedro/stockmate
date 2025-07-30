import React, { useState } from 'react';
import { User, UserPlus, Edit, Trash2, Shield, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useUser, User as UserType, UserLevel } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

interface SystemUser extends UserType {
  status: 'active' | 'inactive';
  lastLogin: Date;
  createdAt: Date;
}

// Mock data for demonstration
const mockUsers: SystemUser[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@stockmate.com',
    level: 'admin',
    status: 'active',
    lastLogin: new Date('2024-01-25T14:30:00'),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@stockmate.com',
    level: 'mid',
    status: 'active',
    lastLogin: new Date('2024-01-25T09:15:00'),
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro.costa@stockmate.com',
    level: 'employee',
    status: 'active',
    lastLogin: new Date('2024-01-24T16:45:00'),
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    name: 'Ana Lima',
    email: 'ana.lima@stockmate.com',
    level: 'employee',
    status: 'inactive',
    lastLogin: new Date('2024-01-20T11:20:00'),
    createdAt: new Date('2024-01-15'),
  },
];

const Users: React.FC = () => {
  const { hasPermission } = useUser();
  const [users, setUsers] = useState<SystemUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect if user doesn't have permission
  if (!hasPermission('manage-users')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Shield className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Acesso Negado</h2>
        <p className="text-muted-foreground">
          Você não tem permissão para acessar o gerenciamento de usuários.
        </p>
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserLevelInfo = (level: UserLevel) => {
    switch (level) {
      case 'admin':
        return { label: 'Administrador', color: 'bg-accent text-accent-foreground', icon: Shield };
      case 'mid':
        return { label: 'Gerente', color: 'bg-warning text-warning-foreground', icon: UserCheck };
      case 'employee':
        return { label: 'Funcionário', color: 'bg-success text-success-foreground', icon: User };
      default:
        return { label: 'Usuário', color: 'bg-muted text-muted-foreground', icon: User };
    }
  };

  const getStatusColor = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? 'bg-success/10 text-success border-success/20' 
      : 'bg-destructive/10 text-destructive border-destructive/20';
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const adminCount = users.filter(u => u.level === 'admin').length;
  const totalUsers = users.length;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground">Gerencie usuários do sistema</p>
        </div>
        
        <Button variant="accent" className="transition-bounce hover:shadow-glow">
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeUsersCount}</div>
            <p className="text-xs text-muted-foreground">usuários ativos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{adminCount}</div>
            <p className="text-xs text-muted-foreground">administradores</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => {
          const levelInfo = getUserLevelInfo(user.level);
          const LevelIcon = levelInfo.icon;
          
          return (
            <Card key={user.id} className="hover:shadow-elegant transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder-avatar-${user.id}.jpg`} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <Badge className={cn('text-xs', levelInfo.color)}>
                          <LevelIcon className="h-3 w-3 mr-1" />
                          {levelInfo.label}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={cn('text-xs', getStatusColor(user.status))}
                        >
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Último acesso: {user.lastLogin.toLocaleDateString('pt-BR')} às {user.lastLogin.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(user.id)}
                      className="transition-bounce"
                    >
                      {user.status === 'active' ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-bounce"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="transition-bounce"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-muted-foreground text-center">
              Tente ajustar os termos de busca.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Users;