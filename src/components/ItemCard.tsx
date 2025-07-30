import React from 'react';
import { Package, Edit, Trash2, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { StockItem } from '@/types/stock';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: StockItem;
  onEdit: (item: StockItem) => void;
  onDelete: (itemId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete }) => {
  const { hasPermission } = useUser();

  const getQuantityColor = (quantity: number) => {
    if (quantity === 0) return 'text-destructive';
    if (quantity <= 10) return 'text-warning';
    return 'text-success';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Eletrônicos': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Escritório': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Limpeza': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Alimentação': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'Ferramentas': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'Outros': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    };
    return colors[category as keyof typeof colors] || colors['Outros'];
  };

  return (
    <Card className="hover:shadow-elegant transition-smooth fade-in group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg group-hover:text-accent transition-colors">
                {item.name}
              </CardTitle>
              <Badge className={cn('mt-1', getCategoryColor(item.category))}>
                {item.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Quantidade:</span>
            <span className={cn('text-lg font-bold', getQuantityColor(item.quantity))}>
              {item.quantity}
            </span>
          </div>

          {item.observations && (
            <div>
              <span className="text-sm text-muted-foreground">Observações:</span>
              <p className="text-sm mt-1 text-foreground/80 line-clamp-2">
                {item.observations}
              </p>
            </div>
          )}

          <div className="flex items-center text-xs text-muted-foreground space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(item.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{item.createdBy}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex space-x-2 w-full">
          {hasPermission('edit') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="flex-1 transition-bounce hover:shadow-glow"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          {hasPermission('delete') && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="flex-1 transition-bounce hover:shadow-glow"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remover
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;