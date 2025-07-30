import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Package, Users, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, hasPermission } = useUser();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      permission: null,
    },
    {
      name: 'Estoque',
      href: '/items',
      icon: Package,
      permission: null,
    },
    {
      name: 'Usuários',
      href: '/users',
      icon: Users,
      permission: 'manage-users' as const,
    },
  ];

  const filteredItems = navigationItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border z-50 transition-smooth',
          'flex flex-col',
          isOpen ? 'w-64' : 'w-16',
          'lg:relative lg:translate-x-0',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Toggle Button */}
        <div className="flex justify-end p-4 lg:hidden">
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-2">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg transition-smooth',
                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                        : 'text-sidebar-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && (
                      <span className="ml-3 font-medium">{item.name}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info (when expanded) */}
        {isOpen && user && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-sm text-sidebar-foreground">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="fixed top-20 left-4 z-50 lg:hidden h-10 w-10 p-0 shadow-elegant"
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
};

export default Sidebar;