"use server";
import { db } from "@/app/_lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isMatch } from "date-fns";
import OpenAI from "openai";

export const generateAiReport = async (month: string) => {
  if (!isMatch(month, "MM")) {
    throw new Error("Invalid month");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await clerkClient().users.getUser(userId);
  const userHasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
  if (!userHasPremiumPlan) {
    throw new Error("User has no premium plan");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const transactions = await db.transaction.findMany({
    where: {
      date: {
        gte: new Date(`2024-${month}-01`),
        lt: new Date(`2024-${month}-31`),
      },
    },
  });

  if (transactions.length === 0) {
    throw new Error("No transactions found for the specified month");
  }

  const content = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. Cite sempre no final do relatório uma pequena frase positiva em português de algum escritor ou pessoa renomada do mercado financeiro mundial. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{VALOR}-{TIPO}-{CATEGORIA}. São elas:
  ${transactions
    .map((transaction) => {
      if (
        !transaction.date ||
        !transaction.amount ||
        !transaction.type ||
        !transaction.category
      ) {
        throw new Error("Invalid transaction data");
      }
      return `${transaction.date.toLocaleDateString(
        "pt-BR",
      )}-R$${transaction.amount}-${transaction.type}-${transaction.category}`;
    })
    .join(";")}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em gestão e organização de finanças pessoais. Você ajuda as pessoas a organizarem melhor as suas finanças.",
        },
        {
          role: "user",
          content,
        },
      ],
    });

    if (!completion.choices || !completion.choices[0]?.message?.content) {
      throw new Error("Failed to generate AI report");
    }

  return completion.choices[0].message.content;
};
