import {
    PiggyBankIcon,
    TrendingDownIcon,
    TrendingUpIcon,
    WalletIcon,
  } from "lucide-react";
  import SummaryCard from "./summary-card";
  
  interface SummaryCards {
    month: string;
    balance: number;
    depositsTotal: number;
    investmentsTotal: number;
    expensesTotal: number;
  }
  
  const SummaryCards = async ({
    balance,
    depositsTotal,
    expensesTotal,
    investmentsTotal,
  }: SummaryCards) => {
    return (
      <div className="space-y-6">
        <SummaryCard
          icon={<WalletIcon size={20} />}
          title="Saldo"
          amount={balance}
          size="large"
        />
  
        <div className="grid grid-cols-3 gap-6">
          <SummaryCard
            icon={<PiggyBankIcon size={20} />}
            title="Investido"
            amount={investmentsTotal}
          />
          <SummaryCard
            icon={<TrendingUpIcon size={20} className="text-primary" />}
            title="Receita"
            amount={depositsTotal}
          />
          <SummaryCard
            icon={<TrendingDownIcon size={20} className="text-red-500" />}
            title="Despesas"
            amount={expensesTotal}
          />
        </div>
      </div>
    );
  };
  
  export default SummaryCards;