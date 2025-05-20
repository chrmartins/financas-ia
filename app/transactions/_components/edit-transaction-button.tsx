"use client";

import { Button } from "@/shared/components/ui/button";
import UpsertTransactionDialog from "@/shared/components/upsert-transaction-dialog";
import { SerializedTransaction } from "@/shared/types/transaction";
import { Transaction } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

interface EditTransactionButtonProps {
  transaction: Transaction | SerializedTransaction;
}

const EditTransactionButton = ({ transaction }: EditTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setDialogIsOpen(true)}
      >
        <PencilIcon />
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={{
          ...transaction,
          amount: Number(transaction.amount),
          date: new Date(transaction.date),
        }}
        transactionId={transaction.id}
      />
    </>
  );
};

export default EditTransactionButton;
