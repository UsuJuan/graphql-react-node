import Joi from 'joi';

const email = Joi.string().email().required().label('Email');
const username = Joi.string().alphanum().min(4).max(30).required().label('Username');
const name = Joi.string().max(254).required().label('Name');
const password = Joi.string().regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/).label('password').options({
    language: {
        string : {
            regex : {
                base: 'must have at least one lowercase letter, one uppercase letter, one digit and one special character'
            }
        }
    }
})

export const SignUp = Joi.object().keys({
    email, username, name, password
})

export const SignIn = Joi.object().keys({
    email, password
})