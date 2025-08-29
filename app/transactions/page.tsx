import AddTransactionButton from "@/shared/components/add-transaction-button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/shared/components/navbar";
import { DataTable } from "@/shared/components/ui/data-table";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { canUserAddTransaction } from "@/shared/data/can-user-add-transaction";
import { prisma } from "@/shared/lib/prisma";
import { SerializedTransaction } from "@/shared/types/transaction";
import { transactionColumns } from "./_columns/index";

const TransactionsPage = async () => {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    redirect("/login");
  }

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

  // Verificar se o usuário pode adicionar transações de forma segura
  let userCanAddTransaction = false;
  try {
    userCanAddTransaction = await canUserAddTransaction();
  } catch (error) {
    // Se houver erro de autorização, o usuário não pode adicionar transações
    console.log("User not authorized to add transactions:", error);
    userCanAddTransaction = false;
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col space-y-4 p-4 md:space-y-6 md:p-6">
        {/* Header - Mobile First */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold md:text-2xl">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        
        {/* Table Container - Responsive */}
        <div className="flex-1 overflow-hidden rounded-lg border">
          <ScrollArea className="h-[calc(100vh-200px)] w-full">
            <div className="min-w-full">
              <DataTable<SerializedTransaction, unknown>
                columns={transactionColumns}
                data={serializedTransactions}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;
