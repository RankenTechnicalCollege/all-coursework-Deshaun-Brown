
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProductListItemProps = {
  item: Product;
}

export function ProductListItem({ item }: ProductListItemProps) {
  const productLink = `/products/${item._id}`;

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
      <CardContent className="p-6">
        <Link
          to={productLink}
          className="block space-y-3 hover:opacity-90 transition-opacity"
        >
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">#{item._id.slice(-6)}</span>
            {item.category && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium border bg-blue-100 text-blue-800 border-blue-200">
                {item.category}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {item.name}
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Footer Metadata */}
          <div className="flex items-center justify-between text-sm pt-2">
            <div className="flex items-center gap-1 text-lg font-bold text-primary">
              <DollarSign className="h-5 w-5" />
              {item.price.toFixed(2)}
            </div>
            
            {item.stock !== undefined && (
              <div className={cn(
                "text-xs px-2 py-1 rounded border font-medium",
                item.stock > 0 
                  ? "bg-green-100 text-green-800 border-green-200" 
                  : "bg-red-100 text-red-800 border-red-200"
              )}>
                Stock: {item.stock}
              </div>
            )}
          </div>
        </Link>

        {/* Hover Effect Bar */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
      </CardContent>
    </Card>
  );
}

