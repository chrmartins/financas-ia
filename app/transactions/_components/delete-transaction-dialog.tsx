"use client";

import { deleteTransaction } from "@/app/transactions/_actions";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useToast } from "@/shared/hooks/use-toast";
import { SerializedTransaction } from "@/shared/types/transaction";
import { formatCurrency } from "@/shared/utils/currency";
import { TransactionType } from "@prisma/client";
import { useState } from "react";

interface DeleteTransactionDialogProps {
  transaction: SerializedTransaction;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

const DeleteTransactionDialog = ({
  transaction,
  isOpen,
  setIsOpen,
  onSuccess,
}: DeleteTransactionDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Formatando o valor para exibição
  const amount = Number(transaction.amount);
  const formattedAmount = formatCurrency(amount);

  const isDeposit = transaction.type === TransactionType.DEPOSIT;
  const prefix = isDeposit ? "+" : "-";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTransaction(transaction.id);

      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso",
      });

      setIsOpen(false);

      // Se houver uma função de callback de sucesso, chame-a
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      toast({
        title: "Erro ao excluir transação",
        description: "Ocorreu um erro ao excluir a transação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir transação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a transação{" "}
            <strong>{transaction.name}</strong> no valor de{" "}
            <strong className={isDeposit ? "text-primary" : "text-red-500"}>
              {prefix}
              {formattedAmount}
            </strong>
            ?
            <br />
            <br />
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransactionDialog;
