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
  const year = searchParams.year as string;
  const authResult = await auth();

  if (!authResult?.userId) {
    redirect("/login");
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const validMonth =
    month && isMatch(month, "MM")
      ? month
      : currentMonth.toString().padStart(2, "0");
      
  const validYear =
    year && /^\d{4}$/.test(year)
      ? year
      : currentYear.toString();

  if (!month || !isMatch(month, "MM") || !year || !/^\d{4}$/.test(year)) {
    redirect(`?month=${validMonth}&year=${validYear}`);
  }

  const dashboard = await getDashboard(validMonth, validYear);
  
  // Verificar se o usuário pode adicionar transações de forma segura
  let userCanAddTransaction = false;
  try {
    userCanAddTransaction = await canUserAddTransaction();
  } catch (error) {
    // Se houver erro de autorização, o usuário não pode adicionar transações
    console.log("User not authorized to add transactions:", error);
    userCanAddTransaction = false;
  }
  
  const isPremium = true;

  return (
    <>
      <Navbar isPremium={isPremium} />
      <div className="flex min-h-screen flex-col space-y-4 p-4 md:space-y-6 md:p-6">
        {/* Header - Mobile First */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold md:text-2xl">Dashboard</h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center gap-2">
              <AiReportButton month={validMonth} year={validYear} isPremium={isPremium} />
              <TimeSelect />
            </div>
            <AddTransactionButton
              userCanAddTransaction={userCanAddTransaction}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards month={month} {...dashboard} />

        {/* Charts and Transactions - Mobile First Layout */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
            <BudgetProgressChart
              depositsTotal={dashboard.depositsTotal}
              expensesTotal={dashboard.expensesTotal}
            />
            <ExpensesPerCategory
              expensesPerCategory={dashboard.totalExpensePerCategory}
            />
          </div>
          
          {/* Last Transactions */}
          <div className="w-full">
            <LastTransactions lastTransactions={dashboard.lastTransactions} />
          </div>
        </div>
      </div>
    </>
  );
}
