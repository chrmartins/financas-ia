"use client";

import { useEffect, useState } from "react";

export function SuppressHydrationWarning({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Remover atributos específicos adicionados por extensões do navegador que causam problemas de hidratação
    if (typeof window !== "undefined") {
      const bodyElement = document.querySelector("body");
      if (bodyElement && bodyElement.hasAttribute("cz-shortcut-listen")) {
        bodyElement.removeAttribute("cz-shortcut-listen");
      }
    }

    // Ajuste importante: Usar requestAnimationFrame para evitar flash de loading
    // Isso espera até que o navegador esteja pronto para renderizar
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  if (!isMounted) {
    // Renderizamos um espaço reservado com o mesmo tamanho para evitar layout shifts
    // e melhorar a percepção de velocidade
    return (
      <div
        style={{
          opacity: 0,
          minHeight: "100vh",
          display: "flex",
          position: "relative",
        }}
      >
        {children}
      </div>
    );
  }

  // Após a montagem, renderizamos normalmente
  return <>{children}</>;
}
