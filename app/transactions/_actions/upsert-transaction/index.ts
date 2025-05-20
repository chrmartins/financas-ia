"use server";

import { prisma } from "@/shared/lib/prisma";
import { serializeTransaction } from "@/shared/utils/serialize-transaction";
import { auth } from "@clerk/nextjs/server";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { upsertTransactionSchema } from "../../schema";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  try {
    console.log("Parâmetros recebidos:", params);
    upsertTransactionSchema.parse(params);

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Não autorizado");
    }

    const { category, amount, ...transactionData } = params;
    console.log("Dados da transação:", transactionData);

    const result = await prisma.transaction.upsert({
      where: {
        id: params?.id ?? "",
      },
      update: {
        ...transactionData,
        userId,
        amount: Number(amount), // Ensure amount is a number
        category: category,
      },
      create: {
        ...transactionData,
        userId,
        amount: Number(amount), // Ensure amount is a number
        category: category,
      },
    });

    console.log("Transação criada/atualizada:", result);
    revalidatePath("/");
    revalidatePath("/transactions");
    return serializeTransaction(result);
  } catch (error) {
    console.error("Erro no upsertTransaction:", error);
    throw error;
  }
};
