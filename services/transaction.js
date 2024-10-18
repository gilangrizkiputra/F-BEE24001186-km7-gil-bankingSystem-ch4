const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class transaction {
  constructor(sourceAccountId, destinationAccountId, amount) {
    this.sourceAccountId = sourceAccountId;
    this.destinationAccountId = destinationAccountId;
    this.amount = amount;
  }
  async sendMoney() {
    return await prisma.$transaction(async (prisma) => {
      const sourceAccount = await prisma.bankAccount.findUnique({
        where: { id: this.sourceAccountId },
      });

      if (!sourceAccount) {
        throw new Error("Source account not found");
      }

      if (sourceAccount.balance < this.amount) {
        throw new Error("Insufficient balance");
      }

      await prisma.bankAccount.update({
        where: { id: this.sourceAccountId },
        data: {
          balance: { decrement: this.amount },
        },
      });

      await prisma.bankAccount.update({
        where: { id: this.destinationAccountId },
        data: {
          balance: { increment: this.amount },
        },
      });

      return await prisma.transaction.create({
        data: {
          sourceAccountId: this.sourceAccountId,
          destinationAccountId: this.destinationAccountId,
          amount: this.amount,
        },
      });
    });
  }

  async getAllTransactions() {
    return await prisma.transaction.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async getTransactionById(id) {
    return await prisma.transaction.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        sourceAccount: true,
        destinationAccount: true,
      },
    });
  }
}

module.exports = transaction;
