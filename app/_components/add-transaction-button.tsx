"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                className="rounded-full font-bold"
                onClick={() => setDialogIsOpen(true)}
                disabled={!userCanAddTransaction}
              >
                {userCanAddTransaction 
                  ? "Adicionar transação" 
                  : "Limite atingido"}
                <ArrowDownUpIcon className="ml-2" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[280px] p-4">
            {!userCanAddTransaction ? (
              <div className="text-center">
                <p className="font-semibold">Limite de transações atingido</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  No plano gratuito, você pode adicionar até 10 transações por mês.
                  Para adicionar mais transações, faça upgrade para o plano Premium.
                </p>
                <Link 
                  href="/subscription" 
                  className="mt-3 block text-primary hover:underline"
                >
                  Fazer upgrade para Premium
                </Link>
              </div>
            ) : (
              <div>
                <p>Adicionar nova transação</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Registre suas receitas, despesas e investimentos.
                </p>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddTransactionButton;
