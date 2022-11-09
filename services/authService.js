import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

class authService {
    async registration(username, password) {
        const candidate = await User.findOne({username});
        if (candidate) {
            throw new Error({message: 'User already exist'});
        }

        const hashedPassword = await bcrypt.hash(password, 3);
        const newUser = await User.create({username, password: hashedPassword});

        return newUser;
    }

    async login(username, password) {
        const candidate = await User.findOne({username});
        if (!candidate) {
            throw new Error({message: 'User not found'});
        }

        const isPasswordValid = await bcrypt.compare(password, candidate.password);
        if (!isPasswordValid) {
            throw new Error({message: 'Invalid password'});
        }

        return {username: candidate.username, password: candidate.password, id: candidate._id};
    }

    async getUserId(token) {
        const username = jwt.verify(token, process.env.ACCESS_SECRET).username;
        const user = await User.findOne({username});
        const ownerId = user._id;
        return ownerId;
    }
}

export default new authService();