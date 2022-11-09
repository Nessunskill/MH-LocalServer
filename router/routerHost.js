import authMiddleware from '../middlewares/authMiddleware.js';
import { Router } from 'express';
import authController from '../controllers/authController.js';
import accountsController from '../controllers/accountsController.js';
import categoriesController from '../controllers/categoriesController.js';
import balanceController from '../controllers/balanceController.js';
import transactionController from '../controllers/transactionController.js';
import walletsController from '../controllers/walletsController.js';
import incomeSourcesController from '../controllers/incomeSourcesController.js';
import categoriesChangesController from '../controllers/categoriesChangesController.js';
const router = new Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/users', authController.getUsers);
router.get('/refresh', authController.refresh);

router.post('/category/change/:id', categoriesChangesController.renameCategory);
router.post('/category/currency/:id', categoriesChangesController.changeCurrency);
router.post('/category/remove/:id', categoriesChangesController.removeCategory);
router.post('/category/removefull/:id', categoriesChangesController.removeCategoryWithTransactions);

router.get('/test', authController.testFunc)

router.get('/wallets', walletsController.getWallets);
router.post('/wallets', walletsController.createWallet);
router.post('/wallets/balance', walletsController.addMoneyToWallet);
router.post('/wallets/remove/:id', walletsController.removeWallet);
router.post('/wallets/transfer/', walletsController.transferMoney);

router.get('/income', incomeSourcesController.getIncomeSources);
router.post('/income', incomeSourcesController.createIncomeSource);

router.post('/accounts', accountsController.createAccount);
router.get('/accounts', accountsController.getAllAccounts);
router.post('/accounts/balance', accountsController.addMoneyToAccount);
router.post('/accounts/remove/:id', accountsController.removeAccount);

router.get('/icons', categoriesController.getAllIcons);
router.post('/categories', categoriesController.createCategory);
// router.post('/categories/title/:id', categoriesController.changeCategoryTitle);
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/spendings', categoriesController.calculateAllSpending);


router.get('/balance', balanceController.calculateBalance);

router.post('/transactions/remove/:id', transactionController.removeTransaction);
router.post('/transactions', transactionController.createTransaction);
router.get('/transactions', transactionController.getAllTransactions);
export default router;