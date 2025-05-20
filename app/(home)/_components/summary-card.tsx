import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
}

const SummaryCard = ({ icon, title, amount }: SummaryCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center gap-2 p-4 sm:gap-4 sm:p-6">
        <div className="rounded-lg bg-white bg-opacity-[3%] p-2">{icon}</div>
        <p className="text-sm text-muted-foreground sm:text-base">{title}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-between p-4 pt-0 sm:p-6 sm:pt-0">
        <p className="text-xl font-bold sm:text-2xl">
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
