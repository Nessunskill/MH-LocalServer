import authService from '../services/authService.js';
import tokenService from '../services/tokenService.js';
import User from '../models/User.js';
import Token from '../models/Token.js';
import Icons from '../models/Icons.js';
import Wallet from '../models/Wallet.js';
import Income from '../models/Income.js';
import expenseService from '../services/expenseService.js';
import { nanoid } from 'nanoid';
import incomeService from '../services/incomeService.js';
import walletsService from '../services/walletsService.js';

class authController {
    async registration(request, response) {
        try {
            const {username, password} = request.body;

            const user = await authService.registration(username, password);
     
            await incomeService.createIncome(user._id, "Зарплата", "https://imageup.ru/img67/4045630/card.png", nanoid(), "MDL");
            await incomeService.createIncome(user._id, "Фриланс", "https://imageup.ru/img247/4045638/invest.png", nanoid(), "USD");

            await walletsService.createWallet(user._id, "Наличные", "https://imageup.ru/img81/4045639/moneybag.png", nanoid(), "MDL");
            await walletsService.createWallet(user._id, "Карта евро", "https://imageup.ru/img67/4045630/card.png", nanoid(), "EUR");

            await expenseService.createExpenseCategory(user._id, "Еда вне дома", "https://imageup.ru/img38/4045635/fastfood.png", nanoid(), "MDL");
            await expenseService.createExpenseCategory(user._id, "Проезд", "https://imageup.ru/img50/4045644/taxi.png", nanoid(), "MDL");
            await expenseService.createExpenseCategory(user._id, "Видеоигры", "https://imageup.ru/img210/4045636/games.png", nanoid(), "MDL");
            await expenseService.createExpenseCategory(user._id, "Сотовая связь", "https://imageup.ru/img281/4045633/cellular.png", nanoid(), "MDL");

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
            
            const tokens = tokenService.createTokens({username});
            response.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true});
            tokenService.saveToken(user.id, tokens.refreshToken);
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