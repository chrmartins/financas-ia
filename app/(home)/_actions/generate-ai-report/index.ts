"use server";
import { prisma } from "@/shared/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { endOfMonth, isMatch, startOfMonth } from "date-fns";
import OpenAI from "openai";

export const generateAiReport = async (month: string) => {
  console.log("generateAiReport iniciado para mês:", month);

  if (!isMatch(month, "MM")) {
    console.error("Formato de mês inválido:", month);
    throw new Error("Invalid month");
  }

  // Extrai o mês como número no escopo principal para uso em toda a função
  const monthNum = parseInt(month, 10);

  const { userId } = await auth();
  if (!userId) {
    console.error("Usuário não autenticado");
    throw new Error("Unauthorized");
  }

  const user = await clerkClient().users.getUser(userId);
  console.log("Plano do usuário:", user.publicMetadata.subscriptionPlan);

  // Desativando temporariamente a verificação de plano premium para teste
  // const userHasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";
  const userHasPremiumPlan = true; // Forçando como true para teste

  if (!userHasPremiumPlan) {
    console.error("Usuário não tem plano premium");
    throw new Error("User has no premium plan");
  }

  console.log(
    "Verificando a chave da API:",
    process.env.OPENAI_API_KEY ? "Configurada" : "Não configurada",
  );
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Buscar transações tanto do ano atual quanto do anterior
  const currentYear = new Date().getFullYear();

  // Log para debug
  console.log("Ano atual:", currentYear);
  console.log("Mês selecionado:", month, "Mês numérico:", monthNum);

  // Primeiro, tentamos buscar as transações do ano atual
  const startDateCurrentYear = startOfMonth(
    new Date(`${currentYear}-${month}-01`),
  );
  const endDateCurrentYear = endOfMonth(new Date(`${currentYear}-${month}-01`));

  console.log(
    "Buscando transações (ano atual) de",
    startDateCurrentYear.toISOString(),
    "até",
    endDateCurrentYear.toISOString(),
  );

  const transactionsCurrentYear = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDateCurrentYear,
        lte: endDateCurrentYear,
      },
    },
  });

  console.log(
    "Transações do ano atual encontradas:",
    transactionsCurrentYear.length,
  );

  // Se não encontrou transações no ano atual, busca também no ano anterior
  let transactions = transactionsCurrentYear;

  if (transactionsCurrentYear.length === 0) {
    const previousYear = currentYear - 1;
    console.log("Tentando buscar transações no ano anterior:", previousYear);

    const startDatePreviousYear = startOfMonth(
      new Date(`${previousYear}-${month}-01`),
    );
    const endDatePreviousYear = endOfMonth(
      new Date(`${previousYear}-${month}-01`),
    );

    console.log(
      "Buscando transações (ano anterior) de",
      startDatePreviousYear.toISOString(),
      "até",
      endDatePreviousYear.toISOString(),
    );

    const transactionsPreviousYear = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDatePreviousYear,
          lte: endDatePreviousYear,
        },
      },
    });

    console.log(
      "Transações do ano anterior encontradas:",
      transactionsPreviousYear.length,
    );
    transactions = transactionsPreviousYear;

    // Se ainda não encontrou transações, tenta buscar em todos os anos
    if (transactionsPreviousYear.length === 0) {
      console.log("Tentando buscar transações para o mês em qualquer ano");

      const transactionsAnyYear = await prisma.transaction.findMany({
        where: {
          userId,
        },
      });

      // Adicionar log detalhado para entender o problema com março (mês 3)
      console.log("Analisando transações para filtrar pelo mês:", monthNum);

      // Mostrar algumas transações disponíveis para debug
      console.log("Amostra das transações disponíveis:");
      transactionsAnyYear.slice(0, 10).forEach((transaction, idx) => {
        console.log(
          `[${idx}] Data:`,
          transaction.date,
          "Mês:",
          transaction.date?.getMonth() + 1,
          "É string?:",
          typeof transaction.date === "string",
          "É Date?:",
          transaction.date instanceof Date,
        );
      });

      // Filtra as transações manualmente pelo mês
      const filteredTransactions = transactionsAnyYear.filter((transaction) => {
        // Verificar se a data está definida
        if (!transaction.date) {
          console.log("Transação sem data encontrada:", transaction.id);
          return false;
        }

        // Garantir que a data é um objeto Date
        const transactionDate =
          transaction.date instanceof Date
            ? transaction.date
            : new Date(transaction.date);

        // Verificar se a data é válida
        if (isNaN(transactionDate.getTime())) {
          console.log("Data inválida para transação:", transaction.id);
          return false;
        }

        const transactionMonth = transactionDate.getMonth() + 1; // +1 porque getMonth é baseado em zero

        console.log(
          `Transação ${transaction.id}: Data=${transactionDate.toISOString()}, Mês=${transactionMonth}, Desejado=${monthNum}`,
        );

        return transactionMonth === monthNum;
      });

      console.log(
        "Transações de qualquer ano para o mês selecionado:",
        filteredTransactions.length,
        "de um total de",
        transactionsAnyYear.length,
      );

      // Mostrar detalhes das transações filtradas
      if (filteredTransactions.length > 0) {
        console.log("Detalhes das transações filtradas:");
        filteredTransactions.forEach((t, idx) => {
          console.log(
            `[${idx}] ID: ${t.id}, Data: ${t.date}, Mês: ${t.date.getMonth() + 1}`,
          );
        });
      }

      transactions = filteredTransactions;
    }
  }

  console.log(
    "Total de transações encontradas após todas as tentativas:",
    transactions.length,
  );

  // Obter o nome do mês para exibir na mensagem de erro
  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const monthName = monthNames[monthNum - 1];

  if (transactions.length === 0) {
    console.log(
      `ERRO: Não foram encontradas transações para o mês ${monthNum} (${monthName})`,
    );
    throw new Error(
      `Não existem transações para ${monthName}. Adicione pelo menos uma transação para este mês para gerar o relatório.`,
    );
  } else {
    // Log para debug: mostra detalhes de todas as transações encontradas
    console.log(
      `SUCESSO: Foram encontradas ${transactions.length} transações para o mês ${monthNum} (${monthName})`,
    );
    console.log("Detalhes de todas as transações encontradas:");
    transactions.forEach((transaction, index) => {
      // Garantir que a data é um objeto Date
      const transactionDate =
        transaction.date instanceof Date
          ? transaction.date
          : new Date(transaction.date);

      console.log(`Transação ${index + 1}:`, {
        id: transaction.id,
        date: transactionDate.toISOString(),
        formattedDate: transactionDate.toLocaleDateString("pt-BR"),
        month: transactionDate.getMonth() + 1,
        year: transactionDate.getFullYear(),
        amount:
          typeof transaction.amount === "object"
            ? transaction.amount.toString()
            : transaction.amount,
        type: transaction.type,
        category: transaction.category,
      });
    });
  }

  // Melhorando o processamento para evitar problemas com o formato da data
  const content = `Gere um relatório com insights sobre as minhas finanças, com dicas e orientações de como melhorar minha vida financeira. Cite sempre no final do relatório uma pequena frase positiva em português de algum escritor ou pessoa renomada do mercado financeiro mundial. As transações estão divididas por ponto e vírgula. A estrutura de cada uma é {DATA}-{VALOR}-{TIPO}-{CATEGORIA}. São elas:
  ${transactions
    .map((transaction) => {
      if (
        !transaction.date ||
        !transaction.amount ||
        !transaction.type ||
        !transaction.category
      ) {
        console.error("Transação com dados inválidos:", transaction);
        throw new Error("Invalid transaction data");
      }

      // Garantir que a data é um objeto Date
      const transactionDate =
        transaction.date instanceof Date
          ? transaction.date
          : new Date(transaction.date);

      // Formatar valor corretamente
      const amount =
        typeof transaction.amount === "object"
          ? transaction.amount.toString()
          : transaction.amount;

      return `${transactionDate.toLocaleDateString(
        "pt-BR",
      )}-R$${amount}-${transaction.type}-${transaction.category}`;
    })
    .join(";")}`;

  console.log("Fazendo chamada para a API da OpenAI...");
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Usando um modelo mais comum
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

    console.log("Resposta recebida da OpenAI");

    if (!completion.choices || !completion.choices[0]?.message?.content) {
      console.error("Nenhum conteúdo retornado pela API");
      throw new Error("Failed to generate AI report");
    }

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao chamar a API da OpenAI:", error);
    throw error;
  }
};
