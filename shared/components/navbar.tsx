"use client";

import { UserButton } from "@clerk/nextjs";
import { BarChart, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

interface NavbarProps {
  isPremium?: boolean;
}

const Navbar = ({ isPremium }: NavbarProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Links de navegação compartilhados
  const NavLinks = ({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) => (
    <>
      <Link
        href="/"
        onClick={onClick}
        className={`${
          mobile
            ? "block w-full rounded-lg px-4 py-3 text-left text-base transition-colors hover:bg-muted"
            : "px-2 py-2 text-sm transition-colors hover:text-primary md:px-4 md:text-base"
        } ${
          pathname === "/" ? "font-bold text-primary" : "text-muted-foreground"
        }`}
      >
        Dashboard
      </Link>
      <Link
        href="/transactions"
        onClick={onClick}
        className={`${
          mobile
            ? "block w-full rounded-lg px-4 py-3 text-left text-base transition-colors hover:bg-muted"
            : "px-2 py-2 text-sm transition-colors hover:text-primary md:px-4 md:text-base"
        } ${
          pathname === "/transactions"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }`}
      >
        Transações
      </Link>
      <Link
        href="/subscription"
        onClick={onClick}
        className={`${
          mobile
            ? "block w-full rounded-lg px-4 py-3 text-left text-base transition-colors hover:bg-muted"
            : "px-2 py-2 text-sm transition-colors hover:text-primary md:px-4 md:text-base"
        } ${
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
    <>
      <nav className="flex items-center justify-between border-b border-solid px-4 py-3 md:px-6">
        {/* Logo */}
         <div className="flex items-center gap-2 md:gap-4">
           <BarChart className="text-green-600 h-6 w-6 md:h-8 md:w-8" strokeWidth={4} />
           <h1 className="text-lg font-bold md:text-2xl lg:text-4xl">NOControle</h1>
         </div>

        {/* Links de navegação - Desktop */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <NavLinks />
        </div>

        {/* Lado Direito */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Botão de usuário - Desktop */}
          <div className="hidden flex-col items-center gap-1 md:flex">
            <UserButton showName />
            <span
              className={`text-xs font-semibold ${
                isPremium ? "text-green-500" : "text-muted-foreground"
              }`}
            >
              {isPremium ? "Premium" : "Básico"}
            </span>
          </div>

          {/* Botão de usuário - Mobile (apenas avatar) */}
          <div className="md:hidden">
            <UserButton />
          </div>

          {/* Menu hambúrguer - Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="border-b bg-background px-4 py-4 md:hidden">
          <div className="space-y-2">
            <NavLinks mobile onClick={() => setIsMobileMenuOpen(false)} />
            {/* Status Premium no menu mobile */}
            <div className="mt-4 rounded-lg bg-muted p-3">
              <span
                className={`text-sm font-semibold ${
                  isPremium ? "text-green-500" : "text-muted-foreground"
                }`}
              >
                Plano: {isPremium ? "Premium" : "Básico"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
