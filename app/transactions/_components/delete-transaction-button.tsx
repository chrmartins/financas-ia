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
import { TrashIcon } from "lucide-react";
import { useState } from "react";

interface DeleteTransactionButtonProps {
  transaction: SerializedTransaction;
  onSuccess?: () => void;
}

const DeleteTransactionButton = ({
  transaction,
  onSuccess,
}: DeleteTransactionButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { toast } = useToast();

  // Formatando o valor para exibição
  const amount = Number(transaction.amount);
  const formattedAmount = formatCurrency(amount);
  const isDeposit = transaction.type === TransactionType.DEPOSIT;
  const prefix = isDeposit ? "+" : "-";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // Chamada direta para a função de exclusão
      await deleteTransaction(transaction.id);

      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso",
      });

      // Recarrega a página para atualizar os dados
      window.location.reload();

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
      setDialogIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-red-500"
        onClick={() => setDialogIsOpen(true)}
      >
        <TrashIcon size={18} />
      </Button>

      <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
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
              onClick={() => setDialogIsOpen(false)}
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
    </>
  );
};

export default DeleteTransactionButton;
