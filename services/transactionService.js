import Transaction from "../models/Transaction.js";
import walletsService from "./walletsService.js";
import incomeService from "./incomeService.js";
import expenseService from "./expenseService.js";

class transactionService {
    async getAllTransactions(ownerId) {
        const transactions = await Transaction.find({ownerId: ownerId});

        return transactions;
    }

    async getTransaction(id) {
        const transaction = await Transaction.findOne({id});

        return transaction;
    }

    async createTransaction(fromId, toId, amount, date, description, transactionType, transactionId, ownerId) {
        if (transactionType === "income") {
            return await this.createIncome(fromId, toId, amount, ownerId, transactionId, date);
        }

        if (transactionType === "transfer") {
            return await this.createTransfer(fromId, toId, amount, ownerId, transactionId, date);
        }

        if (transactionType === "expense") {
            return await this.createExpense(fromId, toId, amount, ownerId, transactionId, date, description);
        }
    }

    async createIncome(fromIncome, toWallet, amount, ownerId, transactionId, date) {
        const data = await incomeService.transferMoney(fromIncome, toWallet, amount);

        const newTransaction = {
            ownerId,
            id: transactionId,
            amount,
            date,
            fromId: data.fromIncome.id,
            fromTitle: data.fromIncome.title,
            fromIcon: data.fromIncome.thumbnail,
            toId: data.toWallet.id,
            toTitle: data.toWallet.title,
            toIcon: data.toWallet.thumbnail,
            transactionType: "income",
        }

        await Transaction.create(newTransaction);

        return newTransaction;
    }

    async createTransfer(fromWallet, toWallet, amount, ownerId, transactionId, date) {
        const data = await walletsService.transferMoney(fromWallet, toWallet, amount);

        const newTransaction = {
            ownerId,
            id: transactionId,
            amount,
            date,
            fromId: data.fromWallet.id,
            fromTitle: data.fromWallet.title,
            fromIcon: data.fromWallet.thumbnail,
            toId: data.toWallet.id,
            toTitle: data.toWallet.title,
            toIcon: data.toWallet.thumbnail,
            transactionType: "transfer",
        }

        await Transaction.create(newTransaction);

        return newTransaction;
    }

    async createExpense(fromWallet, toExpense, amount, ownerId, transactionId, date, description) {
        const data = await expenseService.transferMoney(fromWallet, toExpense, amount);

        const newTransaction = {
            ownerId,
            id: transactionId,
            amount,
            date,
            fromId: data.fromWallet.id,
            fromTitle: data.fromWallet.title,
            fromIcon: data.fromWallet.thumbnail,
            toId: data.toExpense.id,
            toTitle: data.toExpense.title,
            toIcon: data.toExpense.thumbnail,
            transactionType: "expense",
            description,
        }

        await Transaction.create(newTransaction);

        return newTransaction;
    }

    async findTransactionsByCategory(id) {
        const incomeTransactions = await Transaction.find({transactionType: 'income', fromId: id});
        const transferTransactions = [...await Transaction.find({transactionType: 'transfer', toId: id}), ...await Transaction.find({transactionType: 'transfer', fromId: id})];
        const expenseTransactions = await Transaction.find({transactionType: 'expense', fromId: id});

        return [...incomeTransactions, ...transferTransactions, ...expenseTransactions];
    }

    async findAllTransactions(category) {
        const allTransactions = [];

        if (category.categoryName === "incomeSources") {
            allTransactions.push(...await Transaction.find({fromId: category.id}));
        }

        if (category.categoryName === "wallets") {
            allTransactions.push(...await Transaction.find({fromId: category.id}));
            allTransactions.push(...await Transaction.find({toId: category.id}));
        }

        if (category.categoryName === "expenses") {
            allTransactions.push(...await Transaction.find({toId: category.id}));
        }

        return allTransactions;
    }

    async removeSelectedTransactions(transactions) {
        const incomeTransactions = transactions.filter(item => item.transactionType === "income");
        const transferTransactions = transactions.filter(item => item.transactionType === "transfer");
        const expenseTransactions = transactions.filter(item => item.transactionType === "expense");

        for (let i = 0; i < incomeTransactions.length; i++) {
            const income = await incomeService.getIncome(incomeTransactions[i].fromId);
            const wallet = await walletsService.getWallet(incomeTransactions[i].toId);
            const transactionAmount = incomeTransactions[i].amount;
            const currentTransaction = incomeTransactions[i];

            if (income) {
                income.amount = income.amount - transactionAmount;
            }

            if (wallet) {
                wallet.amount = wallet.amount - transactionAmount;
            }

            income.save();
            wallet.save();
            await Transaction.deleteOne(currentTransaction);
        }

        for (let i = 0; i < transferTransactions.length; i++) {
            const fromWallet = await walletsService.getWallet(transferTransactions[i].fromId);
            const toWallet = await walletsService.getWallet(transferTransactions[i].toId);
            const transactionAmount = transferTransactions[i].amount;
            const currentTransaction = transferTransactions[i];

            if (fromWallet) {
                fromWallet.amount = fromWallet.amount + transactionAmount;
            }

            if (toWallet) {
                toWallet.amount = toWallet.amount - transactionAmount;
            }

            fromWallet.save();
            toWallet.save();
            await Transaction.deleteOne(currentTransaction);
        }

        for (let i = 0; i < expenseTransactions.length; i++) {
            const wallet = await walletsService.getWallet(expenseTransactions[i].fromId);
            const expense = await expenseService.getExpenseCategory(expenseTransactions[i].toId);
            const transactionAmount = expenseTransactions[i].amount;
            const currentTransaction = expenseTransactions[i];

            if (wallet) {
                wallet.amount = wallet.amount + transactionAmount;
            }

            if (expense) {
                expense.amount = expense.amount - transactionAmount;
            }

            wallet.save();
            expense.save();
            await Transaction.deleteOne(currentTransaction);
        }
    }

    async deleteTransaction(id) {
        const deletedTransaction = await Transaction.deleteOne({id});

        return deletedTransaction;
    }
}

export default new transactionService();
