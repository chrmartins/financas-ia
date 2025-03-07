import { TransactionType, TransactionCategory, TransactionPaymentMethod } from "@prisma/client";

export interface SerializedTransaction {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  date: string;
  createdAt: string;
  updatedAt: string;
}