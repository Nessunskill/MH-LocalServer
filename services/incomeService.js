import Income from '../models/Income.js';
import walletsService from './walletsService.js';

class incomeSerivce {
    async getIncomeSources(ownerId) {
        const incomeSources = await Income.find({ownerId});

        return incomeSources;
    }

    async getIncome(id) {
        const income = await Income.findOne({id});

        return income;
    }

    async renameIncome(id, newTitle) {
        const income = await this.getIncome(id);

        income.title = newTitle;
        income.save();
        
        return income;
    }

    async changeIncomeCurrency(id, newCurrency) {
        const income = await this.getIncome(id);

        income.currency = newCurrency;
        income.save();
        
        return income;
    }

    async changeIncomeIcon(id, newIcon) {
        const income = await this.getIncome(id);

        income.thumbnail = newIcon;
        income.save();
        
        return income;
    }

    async changeIncomeFields(id, newTitle, newCurrency, newIcon) {
        if (newTitle) {
            await this.renameIncome(id, newTitle);
        }

        if (newCurrency) {
            await this.changeIncomeCurrency(id, newCurrency);
        }

        if (newIcon) {
            await this.changeIncomeIcon(id, newIcon);
        }
    }

    async createIncome(ownerId, title, thumbnail, id, currency) {
        const newIncome = await Income.create({
            ownerId,
            title,
            thumbnail,
            id,
            currency
        });

        return newIncome;
    }

    async deleteIncome(id) {
        const deletedIncome = await Income.deleteOne({id});
        
        return deletedIncome;
    }

    async transferMoney(fromIncomeId, toWalletId, amount) {
        const fromIncome = await this.getIncome(fromIncomeId);
        const toWallet = await walletsService.getWallet(toWalletId);

        fromIncome.amount = fromIncome.amount + amount;
        toWallet.amount = toWallet.amount + amount;

        fromIncome.save();
        toWallet.save();

        return {
            fromIncome,
            toWallet
        }
    }
}

export default new incomeSerivce();