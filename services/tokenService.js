import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';

class tokenService{
    createTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {expiresIn: '5s'});
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {expiresIn: '30s'});

        return {accessToken, refreshToken};
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({userId});

        if (!tokenData) {
            return await Token.create({userId, refreshToken});
        }

        tokenData.refreshToken = refreshToken;
        await tokenData.save();
    }

    async validateToken(token, secretKey) {
        return jwt.verify(token, secretKey);
    }
}   

export default new tokenService();