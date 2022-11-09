import mongoose, { Schema } from 'mongoose';

const IconsSchema = mongoose.Schema({
    icon: {type: String, required: true},
});

export default mongoose.model('Icons', IconsSchema);