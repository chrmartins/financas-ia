import { prisma } from "../_lib/prisma";
import { DataTable } from "../_components/ui/data-table";
import { transactionColumns } from "./_columns";
import AddTransactionButton from "../_components/add-transaction-button";
import Navbar from "../_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import { SerializedTransaction } from "../_types/transaction";

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
      date: 'desc',
    },
  });
  
  const serializedTransactions: SerializedTransaction[] = transactions.map(transaction => ({
    ...transaction,
    amount: transaction.amount.toNumber(),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
    date: transaction.date.toISOString(),
  }));
  
  const userCanAddTransaction = await canUserAddTransaction();
  
  return (
    <>
      <Navbar />
      <div className="space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <AddTransactionButton userCanAddTransaction={userCanAddTransaction} />
        </div>
        <ScrollArea className="overflow-auto">
          <DataTable<SerializedTransaction, unknown> 
            columns={transactionColumns} 
            data={serializedTransactions} 
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default TransactionsPage;
