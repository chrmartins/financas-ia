"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { BotIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { generateAiReport } from "../_actions/generate-ai-report/";

interface AiReportButtonProps {
  month: string;
  isPremium: boolean;
}

// Função auxiliar para converter o número do mês em nome
const getMonthName = (month: string): string => {
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const monthNumber = parseInt(month, 10);
  return monthNumber >= 1 && monthNumber <= 12
    ? `(${monthNames[monthNumber - 1]})`
    : "";
};

const AiReportButton = ({ month, isPremium }: AiReportButtonProps) => {
  const [reportIsLoading, setReportIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReportClick = async () => {
    try {
      // Limpar qualquer erro anterior e relatório
      setError(null);
      setReport(null);

      const monthName = getMonthName(month).replace(/[()]/g, "");
      console.log(
        `Iniciando geração de relatório para mês ${month} (${monthName})`,
      );

      // Exibir uma mensagem para o usuário antes de começar o carregamento
      setReportIsLoading(true);

      // Adicionando um pequeno atraso para debug em ambiente de desenvolvimento
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const report = await generateAiReport(month);

      console.log(
        "Relatório recebido com sucesso:",
        report.substring(0, 50) + "...",
      );
      setReport(report);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);

      // Verificar se a mensagem de erro está disponível e tratá-la de forma mais amigável
      if (error instanceof Error) {
        console.error("Detalhe do erro:", error.message);

        // Personalizar mensagens de erro comuns
        if (error.message.includes("Não existem transações")) {
          setError(
            `Não foram encontradas transações para o mês de ${getMonthName(month).replace(/[()]/g, "")}. Adicione pelo menos uma transação para este mês para gerar o relatório.`,
          );
        } else {
          setError(error.message);
        }
      } else {
        setError("Ocorreu um erro inesperado ao gerar o relatório.");
      }
    } finally {
      setReportIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex items-center justify-center rounded-full px-4 py-2 font-bold"
          disabled={!isPremium}
          onClick={() => {
            setReportIsLoading(false);
            setReport(null);
            setError(null);
          }}
        >
          <BotIcon className="mr-2 h-4 w-4" />
          <span>Relatório IA {getMonthName(month)}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Relatório com IA para {getMonthName(month).replace(/[()]/g, "")}
          </DialogTitle>{" "}
          <DialogDescription>
            Use inteligência artificial para gerar um relatório com insights
            sobre suas finanças do mês selecionado.
          </DialogDescription>
        </DialogHeader>

        {/* Exibindo mensagem de erro */}
        {error && (
          <div className="mb-4 rounded-md border border-red-500 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Erro ao gerar relatório:</p>
            <p>{error}</p>
            {error.includes("Não existem transações") && (
              <div className="mt-2 border-t border-red-300 pt-2">
                <p className="font-medium">Sugestão:</p>
                <p>Para usar o relatório de IA, você precisa:</p>
                <ol className="mt-2 list-decimal pl-5">
                  <li>
                    Adicionar pelo menos uma transação para este mês usando o
                    botão &quot;Nova transação&quot;
                  </li>
                  <li>
                    Verificar se você definiu a data correta ao criar suas
                    transações
                  </li>
                  <li>
                    Garantir que as transações estejam associadas ao mês
                    selecionado
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}

        {report && (
          <ScrollArea className="prose prose-slate max-h-[450px] text-white marker:text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white">
            <Markdown>{report}</Markdown>
          </ScrollArea>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="font-bold">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleGenerateReportClick}
            disabled={reportIsLoading}
            className="inline-flex items-center justify-center font-bold"
          >
            {reportIsLoading && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>
              {reportIsLoading
                ? "Gerando relatório..."
                : `Gerar relatório para ${getMonthName(month).replace(/[()]/g, "")}`}
            </span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
