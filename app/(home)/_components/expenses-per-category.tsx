import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { TRANSACTION_CATEGORY_LABELS, TRANSACTION_CATEGORY_COLORS } from "@/shared/constants/transactions";
import { TotalExpensePerCategory } from "@/shared/data/get-dashboard-types";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  const hasExpenses = expensesPerCategory && expensesPerCategory.length > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="font-bold">Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[300px] w-full">
          <div className="space-y-6 pr-4">
            {hasExpenses ? (
              expensesPerCategory.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex w-full justify-between">
                    <p className="text-sm font-bold">
                      {TRANSACTION_CATEGORY_LABELS[category.category]}
                    </p>
                    <p className="text-sm font-bold">
                      {category.percentageOfTotal}%
                    </p>
                  </div>
                  <Progress 
                    value={category.percentageOfTotal} 
                    indicatorColor={TRANSACTION_CATEGORY_COLORS[category.category]}
                  />
                </div>
              ))
            ) : (
              <div className="flex h-[150px] items-center justify-center text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhuma despesa registrada no período selecionado.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ExpensesPerCategory;
