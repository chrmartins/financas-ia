import { SerializedTransaction } from "@/shared/types/transaction";
import { Transaction } from "@prisma/client";

/**
 * Serializa uma transação para evitar erros de "Decimal objects are not supported"
 * ao passar dados de Server Components para Client Components no Next.js
 */
export function serializeTransaction(
  transaction: Transaction,
): SerializedTransaction {
  return {
    ...transaction,
    amount: transaction.amount.toNumber(),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
    date: transaction.date.toISOString(),
  };
}

/**
 * Serializa um array de transações
 */
export function serializeTransactions(
  transactions: Transaction[],
): SerializedTransaction[] {
  return transactions.map(serializeTransaction);
}
