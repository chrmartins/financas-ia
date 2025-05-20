"use client";

import { SerializedTransaction } from "@/shared/types/transaction";
import { formatCurrency } from "@/shared/utils/currency";
import { TransactionType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const transactionColumns: ColumnDef<SerializedTransaction>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as TransactionType;
      return type === TransactionType.DEPOSIT
        ? "Receita"
        : type === TransactionType.EXPENSE
          ? "Despesa"
          : "Investimento";
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date") as string);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    },
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const type = row.getValue("type") as TransactionType;

      const formatted = formatCurrency(amount);

      if (type === TransactionType.DEPOSIT) {
        return <div className="text-primary">+{formatted}</div>;
      }

      return <div className="text-red-500">-{formatted}</div>;
    },
  },
];
