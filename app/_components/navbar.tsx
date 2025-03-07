"use client";

import { UserButton } from "@clerk/nextjs";
import { BarChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  isPremium?: boolean;
}

const Navbar = ({ isPremium }: NavbarProps) => {
  const pathname = usePathname();
  return (
    <nav className="flex justify-between border-b border-solid px-8 py-4">
      <div className="flex items-center gap-10">
        <div className="flex items-center space-x-3">
          <BarChart className="text-green-600" size={36} strokeWidth={4} />{" "}
          <h1 className="text-4xl font-bold">SEControle</h1>
        </div>
        {/* <Image src="/logo.svg" width={173} height={39} alt="Finance AI" /> */}
        <Link
          href="/"
          className={
            pathname === "/"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Dashboard
        </Link>
        <Link
          href="/transactions"
          className={
            pathname === "/transactions"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Transações
        </Link>
        <Link
          href="/subscription"
          className={
            pathname === "/subscription"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Assinatura
        </Link>
      </div>
      {/* DIREITA */}
      
      <div className="flex flex-col items-center gap-1">
        <UserButton showName />
        <span className={`text-xs font-semibold ${isPremium ? 'text-primary' : 'text-muted-foreground'}`}>
          {isPremium ? 'Premium' : 'Básico'}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
