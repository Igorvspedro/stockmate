import React from 'react';
import { Settings, Shield, UserCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser, UserLevel } from '@/contexts/UserContext';

const UserLevelSelector: React.FC = () => {
  const { user, setUser } = useUser();

  if (!user) return null;

  const levels: { level: UserLevel; label: string; icon: any; description: string }[] = [
    {
      level: 'admin',
      label: 'Administrador',
      icon: Shield,
      description: 'Acesso total: CRUD de itens e gerenciamento de usuários'
    },
    {
      level: 'mid',
      label: 'Gerente',
      icon: UserCheck,
      description: 'Pode criar e editar itens do estoque'
    },
    {
      level: 'employee',
      label: 'Funcionário',
      icon: User,
      description: 'Apenas visualização do estoque'
    }
  ];

  const handleLevelChange = (newLevel: UserLevel) => {
    setUser({
      ...user,
      level: newLevel
    });
  };

  return (
    <Card className="mb-6 border-dashed border-warning bg-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-warning">
          <Settings className="h-5 w-5" />
          <span>Demo - Testar Níveis de Usuário</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Altere o nível do usuário para testar diferentes permissões do sistema:
        </p>
        <div className="grid gap-3">
          {levels.map(({ level, label, icon: Icon, description }) => (
            <div
              key={level}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                user.level === level
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted/30 border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-4 w-4 ${user.level === level ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{label}</span>
                    {user.level === level && (
                      <Badge variant="accent" className="text-xs">Atual</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              {user.level !== level && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLevelChange(level)}
                  className="text-xs"
                >
                  Testar
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserLevelSelector;