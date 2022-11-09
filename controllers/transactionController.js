import Transaction from '../models/Transaction.js';
import authService from '../services/authService.js';
import categoryService from '../services/categoryService.js';
import transactionService from '../services/transactionService.js';
import incomeService from '../services/incomeService.js';
import walletsService from '../services/walletsService.js';
import expenseService from '../services/expenseService.js';

class transactionCategory {
    async createTransaction(request, response) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const ownerId = await authService.getUserId(token);

            const {fromId, toId, amount, date, description, transactionType, id} = request.body;

            const createdTransaction = await transactionService.createTransaction(fromId, toId, amount, date, description, transactionType, id, ownerId);

            response.status(201).json({
                status: 201,
                message: 'Transaction created successfully',
                data: createdTransaction
            });
        } catch (e) {
            console.log(e);
            response.status(400).json({message: 'Check all fields and try again'});
        }
    }

    async getAllTransactions(request, response) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const ownerId = await authService.getUserId(token);

            const transactions = await transactionService.getAllTransactions(ownerId);

            response.status(200).json({
                staus: 200,
                data: transactions,
            })
        } catch (e) {
            console.log(e);
        }
    }

    async removeTransaction(request, response) {
        try {
            const {id} = request.params;
            const currentTransaction = await transactionService.getTransaction(id);

            const {amount, fromId, toId, transactionType} = currentTransaction;

            if (transactionType === 'income') {
                await incomeService.transferMoney(fromId, toId, -amount);
            }

            if (transactionType ===  "transfer") {
                await walletsService.transferMoney(fromId, toId, -amount);
            }

            if (transactionType === "expense") {
                await expenseService.transferMoney(fromId, toId, -amount);   
            }

            const deletedTransaction = await transactionService.deleteTransaction(id);
            response.status(200).json({
                status: 200,
                message: `Transaction ${id} successfully removed`,
                data: deletedTransaction
            });
        } catch (e) {
            console.log(e);
            response.status(400).json({message: `Something went wrong`});
        }
    }

    async changeTransactionDate(request, response) {
        try {
            const {id} = request.params;
            const {newDate} = request.body;

            const transaction = await transactionService.getTransaction(id);

            transaction.date = newDate;
            transaction.save();          

            response.status(201).json({
                status: 201,
                message: `Transaction #${id} date changed to ${newDate}`
            });
        } catch (e) {
            console.log(e);
        }
    }

    async changeTransactionAmount(request, response) {
        try {
            const {id} = request.params;
            const {newAmount} = request.body;

            const transaction = await transactionService.getTransaction(id);
            const fromDB = await categoryService.findCategoryInDB(transaction.fromId);
            const toDB = await categoryService.findCategoryInDB(transaction.toId);

            switch(transaction.transactionType) {
                case "income":
                    if (fromDB) {
                        fromDB.amount = fromDB.amount - Number(transaction.amount) + Number(newAmount);
                        fromDB.save();
                    }
                    if (toDB) {
                        toDB.amount = toDB.amount - Number(transaction.amount) + Number(newAmount);
                        toDB.save();
                    }
                    break;
                case "transfer":
                    if (fromDB) {
                        fromDB.amount = fromDB.amount + Number(transaction.amount) - Number(newAmount);
                        fromDB.save();
                    }
                    if (toDB) {
                        toDB.amount = toDB.amount - Number(transaction.amount) + Number(newAmount);
                        toDB.save();
                    }
                    break;
                case "expense":
                    if (fromDB) {
                        fromDB.amount = fromDB.amount + Number(transaction.amount) - Number(newAmount);
                        fromDB.save();
                    }
                    if (toDB) {
                        toDB.amount = toDB.amount - Number(transaction.amount) + Number(newAmount);
                        toDB.save();
                    }
                    break;
                default:
                    break;
            }

            transaction.amount = newAmount;
            transaction.save();

            response.status(200).json({
                status: 200,
                message: `Transaction #${id} amount changed to ${newAmount}`
            });
        } catch (e) {
            console.log(e);
        }
    }

}

export default new transactionCategory();