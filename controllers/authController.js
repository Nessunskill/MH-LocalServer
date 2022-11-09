import authService from '../services/authService.js';
import tokenService from '../services/tokenService.js';
import User from '../models/User.js';
import Token from '../models/Token.js';
import expenseService from '../services/expenseService.js';
import { nanoid } from 'nanoid';
import incomeService from '../services/incomeService.js';
import walletsService from '../services/walletsService.js';

class authController {
    async registration(request, response) {
        try {
            const {username, password} = request.body;

            const user = await authService.registration(username, password);
     
            await incomeService.createIncome(user._id, "Зарплата", "https://i.ibb.co/Y2Q4SVY/money5.png", nanoid(), "MDL");
            await incomeService.createIncome(user._id, "Фриланс", "https://i.ibb.co/4jDJtkJ/money4.png", nanoid(), "USD");

            await walletsService.createWallet(user._id, "Наличные", "https://i.ibb.co/dPG6H1X/money9.png", nanoid(), "MDL");
            await walletsService.createWallet(user._id, "Карта евро", "https://i.ibb.co/J2dTSJK/credit-card-4.png", nanoid(), "EUR");

            await expenseService.createExpenseCategory(user._id, "Еда вне дома", "https://i.ibb.co/hRHLHkh/hot-dog.png", nanoid(), "MDL");
            await expenseService.createExpenseCategory(user._id, "Проезд", "https://i.ibb.co/dm1jKFr/bus.png", nanoid(), "MDL");
            await expenseService.createExpenseCategory(user._id, "Видеоигры", "https://i.ibb.co/nrHJYq8/joystick.png", nanoid(), "MDL");
            await expenseService.createExpenseCategory(user._id, "Сотовая связь", "https://i.ibb.co/V2ZB0C1/hand-phones.png", nanoid(), "MDL");

            response.status(200).json({username: user.username, password: user.password});
        } catch (e) {
            console.log(e);
            response.status(400).json({message: 'User already exist'});
        }
    }

    async login(request, response) {
        try {          
            const {username, password} = request.body;
            const user = await authService.login(username, password);
            
            const tokens = await tokenService.createTokens({username});
            await response.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true});
            
            console.log(tokens.refreshToken)

            await tokenService.saveToken(user.id, tokens.refreshToken);

            response.status(200).json({
                status: 200,
                data: {
                    username: user.username, 
                    accessToken: tokens.accessToken, 
                    refreshToken: tokens.refreshToken
                }
            });
        } catch (e) {
            console.log(e)
            response.status(404).json({
                status: 404,
                message: 'Invalid username or password',
            });
        }
    }

    async logout(request, response) {
        try {
            const cookie = request.cookies.refreshToken;
            
            await Token.deleteOne({refreshToken: cookie})

            response.status(200).json({
                message: 'Logout',
                status: 200
            })
        } catch (e) {
            console.log(e);
        }
    }

    async refresh(request, response) {
        try {
            const token = request.cookies.refreshToken;
            await tokenService.validateToken(token, process.env.REFRESH_SECRET);

            const tokenData = await Token.findOne({refreshToken: token});
            const tokenOwner = await User.findOne({_id: tokenData.userId});

            const newTokens = tokenService.createTokens({username: tokenOwner.username});
            
            response.cookie('refreshToken', newTokens.refreshToken);
            tokenData.refreshToken = newTokens.refreshToken;
            tokenData.save();
            response.status(200).json({accessToken: newTokens.accessToken, user: tokenOwner, refreshToken: newTokens.refreshToken});
        } catch (e) {
            console.log(e);
            response.status(401).json({message: 'Not authorized'});
        }
    }
}

export default new authController();