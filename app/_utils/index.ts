interface Transaction {
  amount: number;
  date: Date;
  [key: string]: unknown; // Add this if there are other dynamic properties
}

export function serializeTransaction(transaction: Transaction) {
    return {
      ...transaction,
      amount: transaction.amount.toString(), // Serializa Decimal como string
      date: transaction.date.toISOString(), // Serializa Date como string
    };
  }