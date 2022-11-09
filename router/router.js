import authMiddleware from '../middlewares/authMiddleware.js';
import { Router } from 'express';
import authController from '../controllers/authController.js';
import expensesController from '../controllers/expensesController.js';
import transactionController from '../controllers/transactionController.js';
import walletsController from '../controllers/walletsController.js';
import incomeSourcesController from '../controllers/incomeSourcesController.js';
import categoriesChangesController from '../controllers/categoriesChangesController.js';
import iconsController from '../controllers/iconsController.js';
const router = new Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);

router.post('/category/changefields/:id', authMiddleware.validateUser, categoriesChangesController.changeCategoryFields);
router.post('/category/remove/:id', authMiddleware.validateUser, categoriesChangesController.removeCategory);
router.post('/category/removefull/:id', authMiddleware.validateUser, categoriesChangesController.removeCategoryWithTransactions);

router.get('/icons', authMiddleware.validateUser, iconsController.getIcons);

router.get('/income', authMiddleware.validateUser, incomeSourcesController.getIncomeSources);
router.post('/income', authMiddleware.validateUser, incomeSourcesController.createIncomeSource);

router.get('/wallets', authMiddleware.validateUser, walletsController.getWallets);
router.post('/wallets', authMiddleware.validateUser, walletsController.createWallet);

router.post('/categories', authMiddleware.validateUser, expensesController.createExpenseCategory);
router.get('/categories', authMiddleware.validateUser, expensesController.getExpenseCategories);


router.get('/transactions', authMiddleware.validateUser, transactionController.getAllTransactions);

router.post('/transactions/changedate/:id', authMiddleware.validateUser, transactionController.changeTransactionDate);
router.post('/transactions/remove/:id', authMiddleware.validateUser, transactionController.removeTransaction);
router.post('/transactions', authMiddleware.validateUser, transactionController.createTransaction);
router.post('/transactions/changeamount/:id', authMiddleware.validateUser, transactionController.changeTransactionAmount);
export default router;