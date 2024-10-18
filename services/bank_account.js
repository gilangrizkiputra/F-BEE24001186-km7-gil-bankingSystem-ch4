const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class bankAccount {
  constructor(bankName, bankAccountNumber, balance, userId) {
    this.bankName = bankName;
    this.bankAccountNumber = bankAccountNumber;
    this.balance = balance;
    this.userId = userId;
  }

  async createBankAccount() {
    return await prisma.bankAccount.create({
      data: {
        bankName: this.bankName,
        bankAccountNumber: this.bankAccountNumber,
        balance: this.balance,
        userId: this.userId,
      },
    });
  }

  async getAllBankAccounts() {
    return await prisma.bankAccount.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async getBankAccountById(id) {
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
  }

  async updateBankAccount(id) {
    try {
      const bankAccount = await prisma.bankAccount.update({
        where: {
          id: Number(id),
        },
        data: {
          bankName: this.bankName,
          bankAccountNumber: this.bankAccountNumber,
          balance: this.balance,
        },
      });
      return bankAccount;
    } catch (error) {
      throw new Error("Bank account not found or update failed");
    }
  }

  async depositMoney(id, amount) {
    try {
      const bankAccount = await prisma.bankAccount.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!bankAccount) {
        throw new Error("Bank account not found");
      }

      const updatedBankAccount = await prisma.bankAccount.update({
        where: {
          id: Number(id),
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return updatedBankAccount;
    } catch (error) {
      throw new Error("Bank account not found or deposit failed");
    }
  }

  async withdrawMoney(id, amount) {
    try {
      const bankAccount = await prisma.bankAccount.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!bankAccount) {
        throw new Error("Bank account not found");
      }

      const updatedBankAccount = await prisma.bankAccount.update({
        where: {
          id: Number(id),
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
      return updatedBankAccount;
    } catch (error) {
      throw new Error("Bank account not found or deposit failed");
    }
  }

  async deleteBankAccount(id) {
    try {
      const deletedBankAccount = await prisma.bankAccount.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!deletedBankAccount) {
        throw new Error("Bank account not found");
      }

      await prisma.deleteBankAccount.delete({
        where: {
          id: Number(id),
        },
      });
      return deletedBankAccount;
    } catch (error) {
      throw new Error("Bank account not found or delete failed");
    }
  }
}

module.exports = bankAccount;
