import { AuthenticationError } from 'apollo-server-express';
import { User } from './models';

const signedIn = req => req.session.userId;

export const ensureSignedIn = req => {
    if(!signedIn(req)){
        throw new AuthenticationError('must be signin')
    }
}

export const ensureSignedOut = req => {
    if(signedIn(req)){
        throw new AuthenticationError('must be sign out');
    }
}

export const attemptSignIn = async (email, password) => {
    const user = await User.findOne({email});
    if (!user){
        throw new AuthenticationError('Email not found')
    }
    if (! await user.matchesPassword(password)){
        throw new AuthenticationError('Password incorrect')
    }
    return user;
}

export const signOut = (req, res) => new Promise(
    (resolve, reject) => {
        req.session.destroy(err => {
            if (err) reject(err);
            res.clearCookie('sid');
            resolve(true);
        })
    }
)