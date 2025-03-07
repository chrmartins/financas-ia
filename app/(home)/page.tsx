import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";

// Definindo o tipo correto para searchParams no Next.js 15
type SearchParamsType = Promise<{ [key: string]: string | string[] | undefined }>;

// Componente principal da página
export default async function Home(props: { searchParams: SearchParamsType }) {
  const searchParams = await props.searchParams;
  
  const month = searchParams.month as string;
  const authResult = await auth();
  
  if (!authResult?.userId) {
    redirect("/login");
  }

  const currentMonth = new Date().getMonth() + 1;
  const validMonth = month && isMatch(month, "MM") ? month : currentMonth.toString().padStart(2, '0');
  
  if (!month || !isMatch(month, "MM")) {
    redirect(`?month=${validMonth}`);
  }

  const dashboard = await getDashboard(validMonth);
  const userCanAddTransaction = await canUserAddTransaction();
  const isPremium = true;

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-3">
            <AiReportButton month={validMonth} isPremium={isPremium} />
            <TimeSelect />
          </div>
        </div>
        <div className="grid h-full grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory
                expensesPerCategory={dashboard.totalExpensePerCategory}
              />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
}
