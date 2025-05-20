"use client";

import { UserButton } from "@clerk/nextjs";
import { BarChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Importar usePathname

interface NavbarProps {
  isPremium?: boolean;
}

const Navbar = ({ isPremium }: NavbarProps) => {
  const pathname = usePathname(); // Obter o pathname atual

  // Links de navegação compartilhados com classes responsivas
  const NavLinks = () => (
    <>
      <Link
        href="/"
        className={`block px-2 py-2 text-sm transition-colors hover:text-primary md:px-4 md:text-base ${
          pathname === "/" ? "font-bold text-primary" : "text-muted-foreground"
        }`}
      >
        Dashboard
      </Link>
      <Link
        href="/transactions"
        className={`block px-2 py-2 text-sm transition-colors hover:text-primary md:px-4 md:text-base ${
          pathname === "/transactions"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }`}
      >
        Transações
      </Link>
      <Link
        href="/subscription"
        className={`block px-2 py-2 text-sm transition-colors hover:text-primary md:px-4 md:text-base ${
          pathname === "/subscription"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }`}
      >
        Assinatura
      </Link>
    </>
  );

  return (
    <nav className="flex items-center justify-between border-b border-solid px-4 py-3 md:px-6">
      {/* Lado Esquerdo: Logo e Links de Navegação (Desktop) */}
      <div className="flex items-center gap-6 md:gap-12">
        <div className="flex items-center gap-3 md:gap-4">
          <BarChart className="text-green-600" size={32} strokeWidth={4} />
          <h1 className="text-2xl font-bold md:text-4xl">NOControle</h1>
        </div>
        {/* Links de navegação - visíveis em todas as telas */}
        <div className="ml-1 flex items-center pl-1 sm:ml-2 md:ml-4 lg:ml-6">
          <div className="flex items-center gap-1 sm:gap-3 md:gap-6 lg:gap-8">
            <NavLinks />
          </div>
        </div>
      </div>

      {/* Lado Direito: UserButton */}
      <div className="flex items-center gap-4">
        {/* Botão de usuário */}
        <div className="flex flex-col items-center gap-1">
          <UserButton showName />
          <span
            className={`text-xs font-semibold ${
              isPremium ? "text-green-500" : "text-muted-foreground"
            }`}
          >
            {isPremium ? "Premium" : "Básico"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
