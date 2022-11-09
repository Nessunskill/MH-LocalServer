import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    balance: {type: String, required: true, default: '0'},
});

export default mongoose.model('User', UserSchema);