import { TransactionType, TransactionCategory, TransactionPaymentMethod } from "@prisma/client";

export interface SerializedTransaction {
  id: string;
  type: TransactionType;
  name: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  paymentMethod: TransactionPaymentMethod;
  createdAt: string;
  updatedAt: string;
  userId: string;
}