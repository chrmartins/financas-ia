"use server";

import { prisma } from "@/shared/lib/prisma";
import { SerializedTransaction } from "@/shared/types/transaction";
import { revalidateTag } from "next/cache";

export async function getTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  const serializedTransactions: SerializedTransaction[] = transactions.map(
    (transaction) => ({
      ...transaction,
      amount: transaction.amount.toNumber(),
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      date: transaction.date.toISOString(),
    }),
  );

  return serializedTransactions;
}

export async function revalidateTransactions() {
  revalidateTag("transactions");
}
