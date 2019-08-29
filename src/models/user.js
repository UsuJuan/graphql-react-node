import mongoose, { Schema } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { User } from '../models'

const userSchema = new Schema({
    name: String,
    username: String,
    password: String,
    chats: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    email: {
        type: String,
        validate: {
            validator: email => User.doesntExist({ email }),
            message: ({ value }) => `Email ${value} has already exist.`
        }
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function(next) {
    try {
        if(this.isModified('password')){
            this.password = await hash(this.password, 10);
        }
    } catch(err) {
        next(err)
    }
    next();
})

userSchema.statics.doesntExist = async function (options) {
    return await this.where(options).countDocuments() === 0
}

userSchema.methods.matchesPassword = function(password) {
    return compare(password, this.password);
}

export default mongoose.model('User', userSchema);