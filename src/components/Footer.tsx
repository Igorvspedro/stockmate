import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-footer text-footer-foreground border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 gradient-hero rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-sm text-footer-foreground/80">
              StockMate © {currentYear}
            </span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-footer-foreground/80">
              Sistema de Gerenciamento de Estoque
            </p>
            <p className="text-xs text-footer-foreground/60 mt-1">
              Desenvolvido com React & TypeScript
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;