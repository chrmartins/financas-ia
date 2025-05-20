"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/currency";

interface BudgetProgressChartProps {
  depositsTotal: number;
  expensesTotal: number;
}

const BudgetProgressChart = ({
  depositsTotal,
  expensesTotal,
}: BudgetProgressChartProps) => {
  // Calcular a porcentagem de gastos em relação à receita
  const spendingPercentage =
    depositsTotal > 0
      ? Math.min(Math.round((expensesTotal / depositsTotal) * 100), 100)
      : 0;

  // Calcular o saldo restante
  const remainingBalance = depositsTotal - expensesTotal;
  const remainingPercentage = 100 - spendingPercentage;

  // Determinar a cor da barra com base na porcentagem de gastos
  const getProgressColor = () => {
    // Usando sempre uma cor verde (primária) para o orçamento disponível
    return "bg-primary";
  };

  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 flex items-center gap-3 px-2">
        <div className="rounded-full bg-primary bg-opacity-[15%] p-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <span className="text-xs font-bold text-background">$</span>
          </div>
        </div>
        <h3 className="text-base font-bold">Orçamento Mensal</h3>
      </div>
      <CardContent className="flex-1 space-y-6 pb-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Orçamento disponível</span>
            <span className="text-sm font-bold text-primary">
              {formatCurrency(remainingBalance)}
            </span>
          </div>
          <div className="relative h-6 w-full overflow-hidden rounded-full bg-red-500/40">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-700`}
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{remainingPercentage}% restante</span>
            <span>{spendingPercentage}% utilizado</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span className="text-sm font-medium">Receita total</span>
            </div>
            <span className="text-sm font-medium">
              {formatCurrency(depositsTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium">Gastos</span>
            </div>
            <span className="text-sm font-medium text-red-500">
              {formatCurrency(expensesTotal)}
            </span>
          </div>

          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-muted-foreground"></div>
                <span className="text-sm font-medium">Saldo disponível</span>
              </div>
              <span
                className={`text-sm font-bold ${remainingBalance >= 0 ? "text-primary" : "text-red-500"}`}
              >
                {formatCurrency(remainingBalance)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetProgressChart;
