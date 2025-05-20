import { toast } from "@/shared/hooks/use-toast";

export function showPremiumLimitToast() {
  toast({
    title: "Limite de transações atingido",
    description: "Você atingiu o limite de 10 transações do plano básico.",
    action: (
      <a
        href="/subscription"
        className="text-sm font-medium text-primary hover:underline"
      >
        Upgrade para Premium
      </a>
    ),
    duration: 5000,
  });
}
