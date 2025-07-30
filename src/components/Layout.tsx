import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        <main
          className={cn(
            'flex-1 transition-smooth',
            'lg:ml-16', // Always account for collapsed sidebar on desktop
            sidebarOpen && 'lg:ml-64' // Expanded sidebar width
          )}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;