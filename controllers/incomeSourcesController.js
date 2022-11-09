import authService from '../services/authService.js';
import incomeService from '../services/incomeService.js';

class incomeSourcesController {
    async getIncomeSources(request, response) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const ownerId = await authService.getUserId(token);

            const incomeSources = await incomeService.getIncomeSources(ownerId);
            response.status(200).json({
                status: 200,
                data: incomeSources
            });
        } catch (e) {
            response.status(404).json({
                status: 404,
                message: 'Not found'
            });
        }
    }

    async createIncomeSource(request, response) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const ownerId = await authService.getUserId(token);

            const {title, thumbnail, id, currency} = request.body;

            const newIncomeSource = await incomeService.createIncome(ownerId, title, thumbnail, id, currency);

            response.status(201).json({
                status: 201,
                message: `Income source ${title} successfully created`,
                data: newIncomeSource
            });
        } catch (e) {
            console.log(e);
            response.status(400).json({
                status: 400,
                message: 'Something went wrong...'
            });
        }
    }
}

export default new incomeSourcesController();