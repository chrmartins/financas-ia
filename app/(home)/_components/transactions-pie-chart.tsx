"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/shared/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/chart";
import { TransactionPercentagePerType } from "@/shared/data/get-dashboard-types";
import { TransactionType } from "@prisma/client";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentage-item";

const chartConfig = {
  [TransactionType.DEPOSIT]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesas",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType;
  depositsTotal: number;
  expensesTotal: number;
}

const TransactionsPieChart = ({
  depositsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPieChartProps) => {
  // Somente adiciona ao chartData se houver valor para evitar gráfico vazio
  const total = depositsTotal + expensesTotal;
  const hasData = total > 0;

  const chartData = hasData
    ? [
        {
          type: TransactionType.DEPOSIT,
          amount: depositsTotal || 0.01, // Valor mínimo para evitar problemas de renderização
          fill: "#55B02E",
        },
        {
          type: TransactionType.EXPENSE,
          amount: expensesTotal || 0.01, // Valor mínimo para evitar problemas de renderização
          fill: "#E93030",
        },
      ]
    : [
        // Dados placeholder para quando não houver transações
        { type: "Sem dados", amount: 1, fill: "#666" },
      ];
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 px-2">
        <h3 className="text-base font-bold">Distribuição de Transações</h3>
      </div>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] md:max-h-[250px]"
        >
          {hasData ? (
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="type"
                innerRadius={60}
                stroke="none"
                label={false}
              />
            </PieChart>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">
                Sem dados para exibir no gráfico
              </p>
            </div>
          )}
        </ChartContainer>

        <div className="mt-4 space-y-1">
          <PercentageItem
            icon={<TrendingUpIcon size={18} className="text-primary" />}
            title="Receita"
            value={typesPercentage[TransactionType.DEPOSIT] || 0}
          />
          <PercentageItem
            icon={<TrendingDownIcon size={18} className="text-red-500" />}
            title="Despesas"
            value={typesPercentage[TransactionType.EXPENSE] || 0}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPieChart;
