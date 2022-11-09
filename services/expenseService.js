import Category from '../models/Expense.js';
import walletsService from './walletsService.js';

class expenseService {
    async getExpenseCategories(ownerId) {
        const expenseCategories = await Category.find({ownerId});

        return expenseCategories;
    }

    async getExpenseCategory(id) {
        const expenseCategory = await Category.findOne({id});

        return expenseCategory;
    }

    async renameExpenseCategory(id, newTitle) {
        const expense = await this.getExpenseCategory(id);

        expense.title = newTitle;
        expense.save();
        
        return expense;
    }

    async changeExpenseCategoryCurrency(id, newCurrency) {
        const expense = await this.getExpenseCategory(id);

        expense.currency = newCurrency;
        expense.save();
        
        return expense;
    }

    async changeExpenseCategoryIcon(id, newIcon) {
        const expense = await this.getExpenseCategory(id);

        expense.thumbnail = newIcon;
        expense.save();
        
        return expense;
    }

    async changeExpenseCategoryFields(id, newTitle, newCurrency, newIcon) {
        if (newTitle) {
            await this.renameExpenseCategory(id, newTitle);
        }

        if (newCurrency) {
            await this.changeExpenseCategoryCurrency(id, newCurrency);
        }

        if (newIcon) {
            await this.changeExpenseCategoryIcon(id, newIcon);
        }
    }

    async createExpenseCategory(ownerId, title, thumbnail, id, currency) {
        const newExpenseCategory = await Category.create({
            ownerId,
            title,
            thumbnail,
            id,
            currency
        });

        return newExpenseCategory;
    }

    async deleteExpenseCategory(id) {
        const deletedExpenseCategory = await Category.deleteOne({id});
        
        return deletedExpenseCategory;
    }

    async transferMoney(fromWalletId, toExpenseId, amount) {
        const fromWallet = await walletsService.getWallet(fromWalletId);
        const toExpense = await this.getExpenseCategory(toExpenseId);

        fromWallet.amount = fromWallet.amount - amount;
        toExpense.amount = toExpense.amount + amount;

        fromWallet.save();
        toExpense.save();

        return {
            fromWallet,
            toExpense
        }
    }
}

export default new expenseService();