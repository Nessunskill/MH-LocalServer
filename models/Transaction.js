import mongoose, { Schema } from 'mongoose';

const TransactionSchema = mongoose.Schema({
    ownerId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    id: {type: String, required: true},

    amount: {type: Number, required: true},
    description: {type: String, default: ""},
    date: {type: String, required: true},

    fromId: {type: String, required: true},
    fromTitle: {type: String, required: true},
    fromIcon: {type: String, required: true},

    toId: {type: String, required: true},
    toTitle: {type: String, required: true},
    toIcon: {type: String, required: true},

    transactionType: {type: String, required: true},
});

export default mongoose.model('Transaction', TransactionSchema);