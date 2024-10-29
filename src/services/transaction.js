import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class Transaction {
  constructor(sourceAccountId, destinationAccountId, amount, prismaClient = prisma) {
    this.sourceAccountId = sourceAccountId;
    this.destinationAccountId = destinationAccountId;
    this.amount = amount;
    this.prisma = prismaClient;
  }

  async sendMoney() {
    try {
      const sourceAccount = await this.prisma.bankAccount.findUnique({
        where: { id: this.sourceAccountId },
      });

      if (!sourceAccount) {
        throw new Error("Source account not found");
      }

      if (sourceAccount.balance < this.amount) {
        throw new Error("Insufficient balance");
      }

      await this.prisma.bankAccount.update({
        where: { id: this.sourceAccountId },
        data: {
          balance: { decrement: this.amount },
        },
      });

      await this.prisma.bankAccount.update({
        where: { id: this.destinationAccountId },
        data: {
          balance: { increment: this.amount },
        },
      });

      return await this.prisma.transaction.create({
        data: {
          sourceAccountId: this.sourceAccountId,
          destinationAccountId: this.destinationAccountId,
          amount: this.amount,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllTransactions() {
    try {
      return await this.prisma.transaction.findMany({
        orderBy: {
          id: "asc",
        },
      });
    } catch (error) {
      throw new Error("Internal server error");
    }
  }

  async getTransactionById(id) {
    try {
      return await this.prisma.transaction.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          sourceAccount: true,
          destinationAccount: true,
        },
      });
    } catch (error) {
      throw new Error("Transaction not found");
    }
  }
}
