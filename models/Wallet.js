import mongoose, { Schema } from 'mongoose';

const WalletSchema = mongoose.Schema({
    ownerId: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    amount: {type: Number, default: 0},
    thumbnail: {type: String, required: true},
    id: {type: String, required: true},
    categoryName: {type: String, default: "wallets"},
    currency: {type: String, required: true},
});

export default mongoose.model('Wallet', WalletSchema);