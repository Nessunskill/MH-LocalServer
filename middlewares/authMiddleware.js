import tokenService from '../services/tokenService.js';

class authMiddleWare {
    async validateUser(request, response, next) {
        try {
            const authorization = request.headers.authorization;
            
            if (!authorization) {
                return response.status(401).json({message: 'Not authorized'});
            }

            const accessToken = request.headers.authorization.split(' ')[1];
            await tokenService.validateToken(accessToken, process.env.ACCESS_SECRET);

            next();
        } catch (e) {
            return response.status(401).json({message: 'Not authorized', status: 401})
        }
    }
}

export default new authMiddleWare();