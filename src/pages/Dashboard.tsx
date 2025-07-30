import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Package, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import { useUser } from '@/contexts/UserContext';
import { StockItem, STOCK_CATEGORIES } from '@/types/stock';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockItems: StockItem[] = [
  {
    id: '1',
    name: 'Notebook Dell Inspiron',
    quantity: 5,
    category: 'Eletrônicos',
    observations: 'Notebooks para equipe de desenvolvimento',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'João Silva'
  },
  {
    id: '2',
    name: 'Papel A4 500 folhas',
    quantity: 0,
    category: 'Escritório',
    observations: 'Estoque zerado - reposição necessária',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    createdBy: 'Maria Santos'
  },
  {
    id: '3',
    name: 'Detergente Multiuso',
    quantity: 25,
    category: 'Limpeza',
    observations: 'Para uso geral na empresa',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-22'),
    createdBy: 'Pedro Costa'
  },
  {
    id: '4',
    name: 'Café Premium 1kg',
    quantity: 8,
    category: 'Alimentação',
    observations: 'Estoque baixo - solicitar reposição',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-23'),
    createdBy: 'Ana Lima'
  }
];

const Dashboard: React.FC = () => {
  const { hasPermission } = useUser();
  const { toast } = useToast();
  
  const [items, setItems] = useState<StockItem[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateItem = () => {
    setEditingItem(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditItem = (item: StockItem) => {
    setEditingItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setItems(items.filter(i => i.id !== itemId));
      toast({
        title: "Item removido",
        description: `${item.name} foi removido do estoque.`,
      });
    }
  };

  const handleSaveItem = (itemData: Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (modalMode === 'create') {
      const newItem: StockItem = {
        ...itemData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setItems([...items, newItem]);
    } else if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...itemData, updatedAt: new Date() }
          : item
      ));
    }
  };

  // Calculate statistics
  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.quantity <= 10 && item.quantity > 0).length;
  const outOfStockItems = items.filter(item => item.quantity === 0).length;
  const categories = [...new Set(items.map(item => item.category))].length;

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Gerencie seu estoque de forma eficiente</p>
        </div>
        
        {hasPermission('create') && (
          <Button 
            onClick={handleCreateItem}
            className="transition-bounce hover:shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              itens cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              itens com pouco estoque
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">
              itens esgotados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Users className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{categories}</div>
            <p className="text-xs text-muted-foreground">
              categorias ativas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Buscar e Filtrar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm"
              >
                <option value="">Todas as categorias</option>
                {STOCK_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Itens do Estoque
          </h2>
          <Badge variant="outline">
            {filteredItems.length} item(s) encontrado(s)
          </Badge>
        </div>

        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum item encontrado
              </h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || selectedCategory
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece adicionando alguns itens ao seu estoque.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Modal */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
        mode={modalMode}
      />
    </div>
  );
};

export default Dashboard;