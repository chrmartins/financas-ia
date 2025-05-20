import { prisma } from "@/shared/lib/prisma";
import { serializeTransactions } from "@/shared/utils/serialize-transaction";
import { auth } from "@clerk/nextjs/server";
import { TransactionType } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import {
  TotalExpensePerCategory,
  TransactionPercentagePerType,
} from "./get-dashboard-types";

export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentYear = new Date().getFullYear();
  const monthNumber = parseInt(month);
  const startDate = startOfMonth(new Date(currentYear, monthNumber - 1));
  const endDate = endOfMonth(new Date(currentYear, monthNumber - 1));

  console.log(
    `Buscando transações de ${startDate.toISOString()} até ${endDate.toISOString()}`,
  );

  const where = {
    userId,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  const depositsTotal = Number(
    (
      await prisma.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )?._sum?.amount || 0,
  );
  const investmentsTotal = Number(
    (
      await prisma.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );
  const expensesTotal = Number(
    (
      await prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );
  const balance = depositsTotal - expensesTotal;
  const transactionsTotal = Number(
    (
      await prisma.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )._sum.amount,
  );
  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]:
      transactionsTotal > 0
        ? Math.round(
            (Number(depositsTotal || 0) / Number(transactionsTotal)) * 100,
          )
        : 0,
    [TransactionType.EXPENSE]:
      transactionsTotal > 0
        ? Math.round(
            (Number(expensesTotal || 0) / Number(transactionsTotal)) * 100,
          )
        : 0,
    // Mantemos o cálculo da porcentagem de investimentos para compatibilidade
    // mas não o passamos para o frontend
    [TransactionType.INVESTMENT]:
      transactionsTotal > 0
        ? Math.round(
            (Number(investmentsTotal || 0) / Number(transactionsTotal)) * 100,
          )
        : 0,
  };
  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  ).map((category) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal:
      expensesTotal > 0
        ? Math.round(
            (Number(category._sum.amount) / Number(expensesTotal)) * 100,
          )
        : 0,
  }));
  const lastTransactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

  // Serialize the transactions before returning them
  const serializedTransactions = serializeTransactions(lastTransactions);

  return {
    balance,
    depositsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions: serializedTransactions,
  };
};
