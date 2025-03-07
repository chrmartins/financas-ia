import { ColumnDef } from "@tanstack/react-table";
import { TransactionType, TransactionCategory, TransactionPaymentMethod } from "@prisma/client";
import { formatCurrency } from "../_utils/currency";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Define a type for serialized transactions
interface SerializedTransaction {
  id: string;
  type: TransactionType;
  name: string;
  date: string; // Changed from Date to string
  amount: number; // Changed from Decimal to number
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  createdAt: string; // Changed from Date to string
  updatedAt: string; // Changed from Date to string
  userId: string;
}

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
      // Parse the ISO string to a Date object
      const date = new Date(row.getValue("date") as string);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    },
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount") as string);
      const type = row.getValue("type") as TransactionType;
      
      const formatted = formatCurrency(amount);
      
      if (type === TransactionType.DEPOSIT) {
        return <div className="text-primary">+{formatted}</div>;
      }
      
      return <div className="text-red-500">-{formatted}</div>;
    },
  },
];