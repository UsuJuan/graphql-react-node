import express from "express";
import { ApolloServer, gql } from 'apollo-server-express';
import mongoose from "mongoose";
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from './config';
import schemaDirectives from './directives';
import cors from 'cors';

(async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/graphql', { useNewUrlParser: true });
        const app = express();

        const RedisStore = connectRedis(session);
        const store = new RedisStore({
            host: REDIS_HOST,
            port: REDIS_PORT
        })

        var whitelist = ['http://localhost:3000','http://localhost:4000']
        var corsOptions = {
          credentials: true,
          origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
              callback(null, true)
            } else {
              callback(new Error('Not allowed by CORS'))
            }
          }
        }

        app.use(cors(corsOptions));

        app.use(session({
            store,
            name: 'sid',
            secret: 'secretKey',
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 2,
                sameSite: true
            }
        }))

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            schemaDirectives,
            context: ({ req, res }) => ({ req, res })
        })
        server.applyMiddleware({ app });

        app.get('/api/v1/todos', (req, res) => {
          console.log('REQ ===> ', req.headers.cookie);
          // var cookie = req.headers.cookie.split('=')[1];
          // console.log('cookie json ==> ', JSON.parse(cookie) );
          res.status(200).send({
            success: 'true',
            message: 'todos retrieved successfully'
          })
        });

        app.listen({ port: 4000 }, () =>
            console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
        );
    } catch(e){
        console.error(e);
    }
})()
