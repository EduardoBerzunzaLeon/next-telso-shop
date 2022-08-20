import mongoose, { Schema, model, Model } from 'mongoose';
import { IUser } from '../interfaces';

const userSchema = new Schema({
    name: { type: 'string', required: true },
    email: { type: 'string', required: true, unique: true },
    password: { type: 'string', required: true },
    role: {
        type: String,
        enum: {
            values: ['admin', 'client', 'super-user', 'SEO'],
            message: '{VALUE} no es un role válido',
            default: 'client',
            required: true
        }
    }
},  {
    timestamps: true,
});

const User:Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;
