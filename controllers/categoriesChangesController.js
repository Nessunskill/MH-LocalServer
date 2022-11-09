import categoryService from "../services/categoryService.js";
import expenseService from "../services/expenseService.js";
import incomeService from "../services/incomeService.js";
import transactionService from "../services/transactionService.js";
import walletsService from "../services/walletsService.js";

class categoriesChangesController {
    async changeCategoryFields(request, response) {
        try {
            const {id} = request.params;

            const {newTitle, newIcon, newCurrency, categoryType} = request.body;

            switch(categoryType) {
                case "income":
                    await incomeService.changeIncomeFields(id, newTitle, newCurrency, newIcon);
                    break;
                case "wallets":
                    await walletsService.changeWalletFields(id, newTitle, newCurrency, newIcon);
                    break;
                case "expenses":
                    await expenseService.changeExpenseCategoryFields(id, newTitle, newCurrency, newIcon);
                    break;
                default:
                    break;
            }

            response.status(200).json({
                status: 201
            });
            } catch (e) {
            console.log(e);
        }
    }

    async removeCategory(request, response) {
        try {
            const {id} = request.params;
            const {categoryType} = request.body;
            
            switch(categoryType) {
                case "income":
                    await incomeService.deleteIncome(id);
                    break;
                case "wallets":
                    await walletsService.deleteWallet(id);
                    break;
                case "expenses":
                    await expenseService.deleteExpenseCategory(id);
                    break;
                default:
                    break;
            }
            
            response.status(200).json({
                status: 200,
                message: `Category #${id} removed`,
            });
        } catch (e) {
            console.log(e);
        }
    }

    async removeCategoryWithTransactions(request, response) {
        try {
            const {id} = request.params;
            const {categoryType} = request.body;

            const category = await categoryService.findCategoryInDB(id);
            const transactions = await transactionService.findAllTransactions(category);
            await transactionService.removeSelectedTransactions(transactions);

            switch(categoryType) {
                case "income":
                    await incomeService.deleteIncome(id);
                    break;
                case "wallets":
                    await walletsService.deleteWallet(id);
                    break;
                case "expenses":
                    await expenseService.deleteExpenseCategory(id);
                    break;
                default:
                    break;
            }

            response.status(200).json({
                status: 200,
                message: `Category #${id} removed`,
            });
        } catch (e) {
            console.log(e);
        }
    }
}

export default new categoriesChangesController();