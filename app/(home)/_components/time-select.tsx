"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MONTH_OPTIONS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  // Inicializa com um valor garantido
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const urlMonth = searchParams.get("month");
    return urlMonth || currentMonth;
  });

  // Executa apenas uma vez na montagem
  useEffect(() => {
    if (!searchParams.get("month")) {
      setSelectedMonth(currentMonth);
      push(`/?month=${currentMonth}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    push(`/?month=${month}`, { scroll: false });
  };

  // Garante que sempre teremos um valor para exibir
  const displayValue = MONTH_OPTIONS.find(
    (option) => option.value === selectedMonth,
  )?.label;

  return (
    <Select value={selectedMonth} onValueChange={handleMonthChange}>
      <SelectTrigger className="inline-flex h-10 w-[150px] items-center justify-between rounded-full px-4 font-bold">
        <SelectValue>
          {displayValue || MONTH_OPTIONS[Number(currentMonth) - 1].label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {MONTH_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;
