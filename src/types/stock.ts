export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  observations?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface StockCategory {
  id: string;
  name: string;
  description?: string;
}

export const STOCK_CATEGORIES: StockCategory[] = [
  { id: '1', name: 'Eletrônicos', description: 'Equipamentos eletrônicos e acessórios' },
  { id: '2', name: 'Escritório', description: 'Material de escritório e papelaria' },
  { id: '3', name: 'Limpeza', description: 'Produtos de limpeza e higiene' },
  { id: '4', name: 'Alimentação', description: 'Produtos alimentícios' },
  { id: '5', name: 'Ferramentas', description: 'Ferramentas e equipamentos' },
  { id: '6', name: 'Outros', description: 'Outros produtos' }
];