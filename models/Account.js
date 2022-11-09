import mongoose, { Schema } from 'mongoose';

const AccountSchema = mongoose.Schema({
    ownerId: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    amount: {type: String, required: true},
    goal: {type: String, required: true},
    id: {type: String, required: true},
});

export default mongoose.model('Account', AccountSchema);