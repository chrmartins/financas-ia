import { prisma } from "@/shared/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, { params }: any) {
  const { id } = await params;
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada ou não pertence ao usuário" },
        { status: 404 },
      );
    }

    await prisma.transaction.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir transação:", error);
    return NextResponse.json(
      { error: "Erro ao excluir transação" },
      { status: 500 },
    );
  }
}
