import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class BankAccount {
  constructor(bankName, bankAccountNumber, balance, userId) {
    this.bankName = bankName;
    this.bankAccountNumber = bankAccountNumber;
    this.balance = balance;
    this.userId = userId;
  }

  async createBankAccount() {
    try {
      return await prisma.bankAccount.create({
        data: {
          bankName: this.bankName,
          bankAccountNumber: this.bankAccountNumber,
          balance: this.balance,
          userId: this.userId,
        },
      });
    } catch (error) {
      throw new Error("Internal server error");
    }
  }

  async depositMoney(id, amount) {
    try {
      return await prisma.bankAccount.update({
        where: {
          id: Number(id),
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    } catch (error) {
      throw new Error("Bank account not found or deposit failed");
    }
  }

  async withdrawMoney(id, amount) {
    try {
      return await prisma.bankAccount.update({
        where: {
          id: Number(id),
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    } catch (error) {
      throw new Error("Bank account not found or withdraw failed");
    }
  }

  async getAllBankAccounts() {
    try {
      return await prisma.bankAccount.findMany({
        orderBy: {
          id: "asc",
        },
      });
    } catch (error) {
      throw new Error("Internal server error");
    }
  }

  async getBankAccountById(id) {
    try {
      return await prisma.bankAccount.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          id: true,
          bankName: true,
          bankAccountNumber: true,
          balance: true,
          userId: true,
          user: {
            select: {
              name: true,
              profile: {
                select: {
                  identityType: true,
                  identityNumber: true,
                  address: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new Error("Bank account not found");
    }
  }

  async updateBankAccount(id) {
    try {
      return await prisma.bankAccount.update({
        where: {
          id: Number(id),
        },
        data: {
          bankName: this.bankName,
          bankAccountNumber: this.bankAccountNumber,
          balance: this.balance,
        },
      });
    } catch (error) {
      throw new Error("Bank account not found or update failed");
    }
  }

  async deleteBankAccount(id) {
    try {
      return await prisma.bankAccount.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw new Error("Bank account not found or delete failed");
    }
  }
}

