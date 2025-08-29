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
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-4 md:p-6">
        <div className="flex w-full items-center justify-between py-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <AiReportButton month={validMonth} year={validYear} isPremium={isPremium} />
            <TimeSelect />
            <AddTransactionButton
              userCanAddTransaction={userCanAddTransaction}
            />
          </div>
        </div>
        <SummaryCards month={month} {...dashboard} />

        <div className="grid h-full grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[2fr,1fr]">
          <div className="grid h-full grid-cols-1 gap-6 overflow-hidden md:grid-cols-2">
            <BudgetProgressChart
              depositsTotal={dashboard.depositsTotal}
              expensesTotal={dashboard.expensesTotal}
            />
            <ExpensesPerCategory
              expensesPerCategory={dashboard.totalExpensePerCategory}
            />
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
}
