import React from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();

  const getUserLevelBadge = (level: string) => {
    switch (level) {
      case 'admin':
        return 'Administrador';
      case 'mid':
        return 'Gerente';
      case 'employee':
        return 'Funcionário';
      default:
        return 'Usuário';
    }
  };

  const getUserLevelColor = (level: string) => {
    switch (level) {
      case 'admin':
        return 'bg-accent text-accent-foreground';
      case 'mid':
        return 'bg-warning text-warning-foreground';
      case 'employee':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border shadow-elegant">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-hero rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">StockMate</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gerenciamento</p>
          </div>
        </div>

        {/* User Info and Theme Toggle */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getUserLevelColor(user.level)}`}>
                  {getUserLevelBadge(user.level)}
                </span>
              </div>
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0 transition-bounce hover:shadow-glow"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;