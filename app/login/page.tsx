import { Button } from "@/shared/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { BarChart, LogInIcon } from "lucide-react";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }
  return (
    <div className="grid h-full min-h-screen">
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center p-8">
        <div className="flex items-center justify-center space-x-4 pb-16">
          <BarChart className="text-green-600" size={36} strokeWidth={4} />{" "}
          <h1 className="text-4xl font-bold">NOControle</h1>
        </div>
        <h1 className="mb-3 pb-6 text-4xl font-bold">Bem-vindo</h1>
        <p className="mb-8 pb-6 text-muted-foreground">
          A NOControle é uma plataforma de gestão financeira para facilitar o
          controle do seu orçamento.
        </p>
        <SignInButton>
          <Button
            className="inline-flex items-center justify-center rounded-full border-green-400 px-6 py-3 font-bold"
            variant="outline"
          >
            <LogInIcon className="mr-2 h-5 w-5" />
            <span>Fazer login ou criar conta</span>
          </Button>
        </SignInButton>
      </div>
    </div>
  );
};

export default LoginPage;
