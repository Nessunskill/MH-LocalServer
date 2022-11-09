import authService from '../services/authService.js';
import expenseService from '../services/expenseService.js';

class categoriesController {
    async getExpenseCategories(request, response) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const ownerId = await authService.getUserId(token);
            
            const expenseCategories = await expenseService.getExpenseCategories(ownerId);
            response.status(200).json({
                status: 200,
                data: expenseCategories
            })
        } catch (e) {
            console.log(e);
        }
    }

    async createExpenseCategory(request, response) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const ownerId = await authService.getUserId(token);
            const {title, thumbnail, id, currency} = request.body;

            const newExpenseCategory = await expenseService.createExpenseCategory(ownerId, title, thumbnail, id, currency);

            response.status(201).json({
                status: 201,
                message: `Category ${title} successfully created`,
                data: newExpenseCategory
            });        
        } catch (e) {
            console.log(e);
            response.status(400).json({message: 'Something went wrong'});
        }
    }
}

export default new categoriesController();