import authService from '../services/authService.js';
import walletsService from '../services/walletsService.js';

class walletsController {
    async getWallets(request, response) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const ownerId = await authService.getUserId(token);

            const wallets = await walletsService.getWallets(ownerId);

            response.status(200).json({
                status: 200,
                data: wallets
            });
        } catch (e) {
            console.log(e);
            response.status(404).json({
                status: 404,
                message: 'Not found'
            });
        }
    }

    async createWallet(request, response) {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const ownerId = await authService.getUserId(token);
            const {title, thumbnail, id, currency} = request.body;

            const newWallet = await walletsService.createWallet(ownerId, title, thumbnail, id, currency);

            response.status(201).json({
                status: 201,
                message: `Wallet ${title} successfully created`,
                data: newWallet
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

export default new walletsController();