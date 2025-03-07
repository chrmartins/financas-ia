import { auth, clerkClient } from "@clerk/nextjs/server";
import { checkTransactionsLimit } from "./check-transactions-limit";

export async function canUserAddTransaction() {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await clerkClient.users.getUser(userId);
  const isPremium = user.publicMetadata.subscriptionPlan === "premium";

  // Se for premium, sempre pode adicionar
  if (isPremium) return true;

  // Se não for premium, verifica o limite
  const { hasReachedLimit } = await checkTransactionsLimit(userId);
  return !hasReachedLimit;
}