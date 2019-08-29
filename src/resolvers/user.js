import { User } from '../models';
import mongoose from 'mongoose';
import { UserInputError } from 'apollo-server-express';
import Joi from 'joi';
import { SignUp, SignIn } from '../schemas';
import * as Auth from '../auth';

export default {
    Query: {
        me: (root, args, { req }, info ) => {
            return User.findById(req.session.userId)
        },
        users: (root, args, { req }, info) => {
            return User.find({});
        },
        user: (root, args, { req }, info) => {
            if(!mongoose.Types.ObjectId.isValid(args.id)){
                return new UserInputError(`${args.id} is not valid ObjectID.`)
            }
            return User.findById(args.id);
        }
    },
    Mutation: {
        signUp: async (root, args, { req }, info) => {
            await Joi.validate(args, SignUp, { abortEarly: false });
            const user = await User.create(args);
            req.session.userId = user.id;
            return user;
        },
        signIn: async (root, args, { req }, info ) => {
            // const { userId } = req.session ? req.session : false;
            // if ( userId ){ 
            //     return User.findById(req.session.userId);
            // }
            await Joi.validate(args, SignIn, { abortEarly: false });
            const user = await Auth.attemptSignIn(args.email, args.password);
            req.session.userId = user.id;
            return user;
        },
        signOut : (root, args, { req, res }, info) => {
            return Auth.signOut(req, res);
        }
    }
}