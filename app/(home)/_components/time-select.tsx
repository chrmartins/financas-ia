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

// Gera opções de anos (últimos 5 anos + próximos 5 anos)
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push({ value: String(i), label: String(i) });
  }
  return years;
};

const YEAR_OPTIONS = generateYearOptions();

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const currentYear = String(new Date().getFullYear());

  // Inicializa com valores garantidos
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const urlMonth = searchParams.get("month");
    return urlMonth || currentMonth;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    const urlYear = searchParams.get("year");
    return urlYear || currentYear;
  });

  // Executa apenas uma vez na montagem
  useEffect(() => {
    const urlMonth = searchParams.get("month");
    const urlYear = searchParams.get("year");
    
    if (!urlMonth || !urlYear) {
      const month = urlMonth || currentMonth;
      const year = urlYear || currentYear;
      setSelectedMonth(month);
      setSelectedYear(year);
      push(`/?month=${month}&year=${year}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    push(`/?month=${month}&year=${selectedYear}`, { scroll: false });
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    push(`/?month=${selectedMonth}&year=${year}`, { scroll: false });
  };

  // Garante que sempre teremos valores para exibir
  const displayMonthValue = MONTH_OPTIONS.find(
    (option) => option.value === selectedMonth,
  )?.label;

  const displayYearValue = YEAR_OPTIONS.find(
    (option) => option.value === selectedYear,
  )?.label;

  return (
    <div className="flex gap-2">
      <Select value={selectedMonth} onValueChange={handleMonthChange}>
        <SelectTrigger className="inline-flex h-10 w-[150px] items-center justify-between rounded-full px-4 font-bold">
          <SelectValue>
            {displayMonthValue || MONTH_OPTIONS[Number(currentMonth) - 1].label}
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
      
      <Select value={selectedYear} onValueChange={handleYearChange}>
        <SelectTrigger className="inline-flex h-10 w-[100px] items-center justify-between rounded-full px-4 font-bold">
          <SelectValue>
            {displayYearValue || currentYear}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {YEAR_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelect;
