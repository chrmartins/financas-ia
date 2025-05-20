import { Button } from "@/shared/components/ui/button";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/shared/constants/transactions";
import { formatCurrency } from "@/shared/utils/currency";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface SerializedTransaction {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface LastTransactionsProps {
  lastTransactions: SerializedTransaction[];
}

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
  const getAmountColor = (transaction: SerializedTransaction) => {
    if (transaction.type === TransactionType.EXPENSE) {
      return "text-red-500";
    }
    if (transaction.type === TransactionType.DEPOSIT) {
      return "text-primary";
    }
    return "text-white";
  };

  const getAmountPrefix = (transaction: SerializedTransaction) => {
    if (transaction.type === TransactionType.DEPOSIT) {
      return "+";
    }
    return "-";
  };

  return (
    <ScrollArea className="h-full rounded-md border">
      <CardHeader className="flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <CardTitle className="font-bold">Últimas Transações</CardTitle>
        <Button
          variant="outline"
          className="rounded-full font-bold"
          asChild
          size="sm"
        >
          <Link href="/transactions">Ver mais</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {lastTransactions.length > 0 ? (
          lastTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white bg-opacity-[3%] p-3 text-white">
                  <Image
                    src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
                    height={20}
                    width={20}
                    alt={transaction.paymentMethod}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold">{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-bold ${getAmountColor(transaction)}`}>
                {getAmountPrefix(transaction)}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Nenhuma transação encontrada
            </p>
          </div>
        )}
      </CardContent>
    </ScrollArea>
  );
};

export default LastTransactions;
