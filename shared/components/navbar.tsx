"use client";

import { UserButton } from "@clerk/nextjs";
import { BarChart, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface NavbarProps {
  isPremium?: boolean;
}

const Navbar = ({ isPremium }: NavbarProps) => {
  const pathname = usePathname();

  // Links de navegação para desktop
  const DesktopNavLinks = () => (
    <>
      <Link
        href="/"
        className={`px-2 py-2 text-sm transition-colors hover:text-primary md:px-4 md:text-base ${
          pathname === "/" ? "font-bold text-primary" : "text-muted-foreground"
        }`}
      >
        Dashboard
      </Link>
      <Link
        href="/transactions"
        className={`px-2 py-2 text-sm transition-colors hover:text-primary md:px-4 md:text-base ${
          pathname === "/transactions"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }`}
      >
        Transações
      </Link>
      <Link
        href="/subscription"
        className={`px-2 py-2 text-sm transition-colors hover:text-primary md:px-4 md:text-base ${
          pathname === "/subscription"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }`}
      >
        Assinatura
      </Link>
    </>
  );

  // Links de navegação para mobile sidebar
  const MobileNavLinks = () => (
    <div className="space-y-4">
      <Link
        href="/"
        className={`block w-full rounded-lg px-4 py-3 text-left text-base transition-colors hover:bg-muted ${
          pathname === "/" ? "font-bold text-primary" : "text-muted-foreground"
        }`}
      >
        Dashboard
      </Link>
      <Link
        href="/transactions"
        className={`block w-full rounded-lg px-4 py-3 text-left text-base transition-colors hover:bg-muted ${
          pathname === "/transactions"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }`}
      >
        Transações
      </Link>
      <Link
        href="/subscription"
        className={`block w-full rounded-lg px-4 py-3 text-left text-base transition-colors hover:bg-muted ${
          pathname === "/subscription"
            ? "font-bold text-primary"
            : "text-muted-foreground"
        }`}
      >
        Assinatura
      </Link>
    </div>
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
          <DesktopNavLinks />
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

          {/* Menu hambúrguer - Mobile com Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <BarChart className="h-6 w-6 text-green-600" strokeWidth={4} />
                  NOControle
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                <MobileNavLinks />
                {/* Status Premium na sidebar */}
                <div className="mt-8 rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-2">
                    <UserButton />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Minha Conta</span>
                      <span
                        className={`text-xs font-semibold ${
                          isPremium ? "text-green-500" : "text-muted-foreground"
                        }`}
                      >
                        Plano: {isPremium ? "Premium" : "Básico"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>


    </>
  );
};

export default Navbar;
