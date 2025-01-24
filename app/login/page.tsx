import { Button } from "../_components/ui/button";
import { BarChart, LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
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
          <h1 className="text-4xl font-bold">SEControle</h1>
        </div>
        <h1 className="mb-3 text-4xl font-bold pb-6">Bem-vindo</h1>
        <p className="mb-8 text-muted-foreground pb-6">
          A SEControle é uma plataforma de gestão financeira que utiliza IA para
          monitorar suas movimentações, e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>
        <SignInButton>
          <Button className="p-8 border-green-400 rounded-full" variant="outline">
            <LogInIcon className="mr-2" />
            Fazer login ou criar conta
          </Button>
        </SignInButton>
      </div>
    </div>
  );
};

export default LoginPage;
