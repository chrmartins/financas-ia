import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { startOfMonth, endOfMonth } from "date-fns";

export async function checkTransactionsLimit(userId: string) {
  const currentDate = new Date();
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  const transactionsCount = await prisma.transaction.count({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return {
    hasReachedLimit: transactionsCount >= 10,
    currentCount: transactionsCount
  };
}