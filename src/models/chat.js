import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema({
    title: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {
    timestamps: true
})

export default mongoose.model('Chat', chatSchema);