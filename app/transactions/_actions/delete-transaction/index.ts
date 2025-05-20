"use server";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteTransaction = async (id: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Não autorizado");
    }

    // Verificar se a transação pertence ao usuário
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
    });

    if (!transaction || transaction.userId !== userId) {
      throw new Error("Transação não encontrada ou não pertence ao usuário");
    }

    // Excluir a transação
    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    // Revalidar os caches para atualizar a interface
    revalidatePath("/");
    revalidatePath("/transactions");

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    throw error;
  }
};
