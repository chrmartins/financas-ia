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
    <nav className="border-b border-solid px-4 py-3 md:px-6">
      {/* Layout responsivo unificado */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
        {/* Primeira linha: Logo e UserButton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <BarChart className="text-green-600 md:size-8" size={24} strokeWidth={4} />
            <h1 className="text-lg font-bold md:text-4xl">NOControle</h1>
          </div>
          
          {/* UserButton - sempre visível */}
          <div className="flex flex-col items-center gap-1 md:hidden">
            <UserButton showName={false} />
            <span
              className={`text-xs font-semibold ${
                isPremium ? "text-green-500" : "text-muted-foreground"
              }`}
            >
              {isPremium ? "Premium" : "Básico"}
            </span>
          </div>
        </div>

        {/* Segunda linha mobile / Meio desktop: Links de navegação */}
        <div className="flex justify-center gap-4 md:gap-8">
          <NavLinks />
        </div>

        {/* UserButton para desktop */}
        <div className="hidden md:flex md:items-center md:gap-4">
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
      </div>
     </nav>
   );
};

export default Navbar;
