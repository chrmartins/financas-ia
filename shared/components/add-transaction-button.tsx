"use client";

import { ArrowDownUpIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UpsertTransactionDialog from "./upsert-transaction-dialog";

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
            <Button
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 font-bold shadow-md hover:bg-primary/90"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
              size="default"
            >
              <span>
                {userCanAddTransaction
                  ? "Adicionar transação"
                  : "Limite atingido"}
              </span>
              <ArrowDownUpIcon className="ml-2 h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            align="center"
            className="w-[280px] p-4" 
            style={{
              backgroundColor: '#111827',
              color: '#ffffff',
              border: '2px solid #000000',
              zIndex: 9999,
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              margin: 0
            }}
          >
            {!userCanAddTransaction && (
              <div className="text-center">
                <p className="font-semibold">Limite de transações atingido</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  No plano gratuito, você pode adicionar até 10 transações por
                  mês. Para adicionar mais transações, faça upgrade para o plano
                  Premium.
                </p>
                <Link
                  href="/subscription"
                  className="mt-3 block text-primary hover:underline"
                >
                  Fazer upgrade para Premium
                </Link>
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
