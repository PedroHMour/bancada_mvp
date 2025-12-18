import { Maker } from "@/core/entities/Maker";
import { Star, MapPin } from "lucide-react";
import { Button } from "../atoms/Button";
import { BaseCard } from "@/presentation/design/components/cards";
import { Badge } from "../atoms/Badge";

export const MakerCard = ({ maker }: { maker: Maker }) => {
  return (
    <BaseCard hover className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {maker.businessName}
        </h3>
        {maker.verified && (
          <Badge color="success" className="text-xs">
            Verificado
          </Badge>
        )}
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 flex-grow">
        {maker.bio}
      </p>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1 text-brand-primary">
          <Star className="w-5 h-5 fill-brand-primary" />
          <span className="font-semibold">{maker.rating.toFixed(1)}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{maker.totalOrders} pedidos</span>
        </div>
      </div>

      <Button className="mt-4 w-full" variant="outline">
        Ver Perfil
      </Button>
    </BaseCard>
  );
};
