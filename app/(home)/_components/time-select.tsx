"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MONTH_OPTIONS = [
  { value: "01", label: "Janeiro", short: "Jan" },
  { value: "02", label: "Fevereiro", short: "Fev" },
  { value: "03", label: "Março", short: "Mar" },
  { value: "04", label: "Abril", short: "Abr" },
  { value: "05", label: "Maio", short: "Mai" },
  { value: "06", label: "Junho", short: "Jun" },
  { value: "07", label: "Julho", short: "Jul" },
  { value: "08", label: "Agosto", short: "Ago" },
  { value: "09", label: "Setembro", short: "Set" },
  { value: "10", label: "Outubro", short: "Out" },
  { value: "11", label: "Novembro", short: "Nov" },
  { value: "12", label: "Dezembro", short: "Dez" },
];

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
  const currentYear = new Date().getFullYear();

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentIndex = MONTH_OPTIONS.findIndex(option => option.value === selectedMonth);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : 11;
    } else {
      newIndex = currentIndex < 11 ? currentIndex + 1 : 0;
    }
    
    const newMonth = MONTH_OPTIONS[newIndex].value;
    handleMonthChange(newMonth);
  };

  // Garante que sempre teremos um valor para exibir
  const selectedOption = MONTH_OPTIONS.find(
    (option) => option.value === selectedMonth,
  );
  const displayValue = selectedOption?.label || MONTH_OPTIONS[Number(currentMonth) - 1].label;
  const shortValue = selectedOption?.short || MONTH_OPTIONS[Number(currentMonth) - 1].short;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateMonth('prev')}
        className="h-9 w-9 p-0 hover:bg-primary/10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Select value={selectedMonth} onValueChange={handleMonthChange}>
        <SelectTrigger className="inline-flex h-9 w-[140px] items-center justify-between rounded-lg border-2 px-3 font-semibold transition-all hover:border-primary/50 focus:border-primary">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <SelectValue>
              <span className="hidden sm:inline">{displayValue}</span>
              <span className="sm:hidden">{shortValue}</span>
              <span className="ml-1 text-xs text-muted-foreground">{currentYear}</span>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="w-[200px] bg-background border shadow-lg">
          {MONTH_OPTIONS.map((option) => (
            <SelectItem 
               key={option.value} 
               value={option.value}
               className="cursor-pointer"
             >
              <div className="flex items-center justify-between w-full">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {option.value}/{currentYear.toString().slice(-2)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigateMonth('next')}
        className="h-9 w-9 p-0 hover:bg-primary/10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TimeSelect;
