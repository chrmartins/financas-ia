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
    header: () => <span className="font-bold">Nome</span>,
  },
  {
    accessorKey: "type",
    header: () => <span className="text-lg font-bold">Tipo</span>,
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: "category",
    header: () => <span className="font-bold">Categoria</span>,
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_CATEGORY_LABELS[transaction.category],
  },
  {
    accessorKey: "paymentMethod",
    header: () => <span className="font-bold">Método de Pagamento</span>,
    cell: ({ row: { original: transaction } }) =>
      TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod],
  },
  {
    accessorKey: "date",
    header: () => <span className="font-bold">Data</span>,
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  },
  {
    accessorKey: "amount",
    header: () => <span className="font-bold">Valor</span>,
    cell: ({ row: { original: transaction } }) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(transaction.amount)),
  },
  {
    accessorKey: "actions",
    header: () => <span className="font-bold">Ações</span>,
    cell: ({ row: { original: transaction } }) => {
      return (
        <div className="space-x-1">
          <EditTransactionButton transaction={transaction} />
          <DeleteTransactionButton transaction={transaction} />
        </div>
      );
    },
  },
];
