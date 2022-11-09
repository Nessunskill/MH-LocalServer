import mongoose, { Schema } from 'mongoose';

const TokenSchema = mongoose.Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true},
});

export default mongoose.model('Token', TokenSchema);