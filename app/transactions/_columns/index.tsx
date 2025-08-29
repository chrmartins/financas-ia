"use client";

import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/shared/constants/transactions";
import { SerializedTransaction } from "@/shared/types/transaction";
import { ColumnDef } from "@tanstack/react-table";
import DeleteTransactionButton from "../_components/delete-transaction-button";
import EditTransactionButton from "../_components/edit-transaction-button";
import TransactionTypeBadge from "../_components/type-badge";

export const transactionColumns: ColumnDef<SerializedTransaction>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row: { original: transaction } }) => (
      <div className="font-medium">{transaction.name}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row: { original: transaction } }) => (
      <div className="text-sm">{transaction.category}</div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Pagamento",
    cell: ({ row: { original: transaction } }) => (
      <div className="text-sm">{transaction.paymentMethod}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row: { original: transaction } }) => (
      <div className="text-sm">
        {new Date(transaction.date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original: transaction } }) => (
      <div className={`font-medium ${
        transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"
      }`}>
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(transaction.amount))}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: transaction } }) => (
      <div className="flex gap-1">
        <EditTransactionButton transaction={transaction} />
        <DeleteTransactionButton transaction={transaction} />
      </div>
    ),
  },
];
