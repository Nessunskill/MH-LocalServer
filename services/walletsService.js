import Wallet from '../models/Wallet.js';

class walletsSerivce {
    async getWallets(ownerId) {
        const wallets = await Wallet.find({ownerId});

        return wallets;
    }

    async getWallet(id) {
        const wallet = await Wallet.findOne({id});

        return wallet;
    }

    async renameWallet(id, newTitle) {
        const wallet = await this.getWallet(id);

        wallet.title = newTitle;
        wallet.save();
        
        return wallet;
    }
    
    async changeWalletCurrency(id, newCurrency) {
        const wallet = await this.getWallet(id);

        wallet.currency = newCurrency;
        wallet.save();
        
        return wallet;
    }

    async changeWalletIcon(id, newIcon) {
        const wallet = await this.getWallet(id);

        wallet.thumbnail = newIcon;
        wallet.save();
        
        return wallet;
    }

    async changeWalletFields(id, newTitle, newCurrency, newIcon) {
        if (newTitle) {
            await this.renameWallet(id, newTitle);
        }

        if (newCurrency) {
            await this.changeWalletCurrency(id, newCurrency);
        }

        if (newIcon) {
            await this.changeWalletIcon(id, newIcon);
        }
    }

    async createWallet(ownerId, title, thumbnail, id, currency) {
        const newWallet = await Wallet.create({
            ownerId,
            title,
            thumbnail,
            id,
            currency
        });

        return newWallet;
    }

    async deleteWallet(id) {
        const deletedWallet = await Wallet.deleteOne({id});
        
        return deletedWallet;
    }

    async transferMoney(fromWalletId, toWalletId, amount) {
        const fromWallet = await this.getWallet(fromWalletId);
        const toWallet = await this.getWallet(toWalletId);

        fromWallet.amount = fromWallet.amount - amount;
        toWallet.amount = toWallet.amount + amount;

        fromWallet.save();
        toWallet.save();

        return {
            fromWallet,
            toWallet
        }
    }
}

export default new walletsSerivce();