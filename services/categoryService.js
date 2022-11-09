import Category from "../models/Expense.js";
import Income from "../models/Income.js";
import Wallet from "../models/Wallet.js";

class categoryService {
    async findCategoryInDB(id) {
        const wallets = Wallet;
        const categories = Category;
        const incomeSources = Income;

        let currentCategory;

        if (await incomeSources.findOne({id: id})) {
            currentCategory = await incomeSources.findOne({id: id});
        } else if (await wallets.findOne({id: id})) {
            currentCategory = await wallets.findOne({id: id});
        } else {
            currentCategory = await categories.findOne({id: id});
        }

        return currentCategory;
    }
}

export default new categoryService();