import AddTransactionButton from "@/shared/components/add-transaction-button";
import Navbar from "@/shared/components/navbar";
import { canUserAddTransaction } from "@/shared/data/can-user-add-transaction";
import { getDashboard } from "@/shared/data/get-dashboard";
import { auth } from "@clerk/nextjs/server";
import { isMatch } from "date-fns";
import { redirect } from "next/navigation";
import AiReportButton from "./_components/ai-report-button";
import BudgetProgressChart from "./_components/budget-progress-chart";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";

// Definindo o tipo correto para searchParams no Next.js 15
type SearchParamsType = Promise<{
  [key: string]: string | string[] | undefined;
}>;

// Componente principal da página
export default async function Home(props: { searchParams: SearchParamsType }) {
  const searchParams = await props.searchParams;

  const month = searchParams.month as string;
  const authResult = await auth();

  if (!authResult?.userId) {
    redirect("/login");
  }

  const currentMonth = new Date().getMonth() + 1;
  const validMonth =
    month && isMatch(month, "MM")
      ? month
      : currentMonth.toString().padStart(2, "0");

  if (!month || !isMatch(month, "MM")) {
    redirect(`?month=${validMonth}`);
  }

  const dashboard = await getDashboard(validMonth);
  const userCanAddTransaction = await canUserAddTransaction();
  const isPremium = true;

  return (
    <>
      <Navbar isPremium={isPremium} />
      <div className="flex flex-col space-y-6 px-4 py-6 md:px-6">
        <div className="flex w-full flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <AiReportButton month={validMonth} isPremium={isPremium} />
              <TimeSelect />
            </div>
            <AddTransactionButton
              userCanAddTransaction={userCanAddTransaction}
            />
          </div>
        </div>
        <SummaryCards month={month} {...dashboard} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ExpensesPerCategory
              expensesPerCategory={dashboard.totalExpensePerCategory}
            />
            <BudgetProgressChart
              depositsTotal={dashboard.depositsTotal}
              expensesTotal={dashboard.expensesTotal}
            />
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
}
