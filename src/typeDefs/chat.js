import { gql } from 'apollo-server-express';

export default gql `
    type Chat {
        id: ID!
        title: String!
        users: [User!]!
        messages: [Message!]!
        lastMessage: Message
        createdAt: String!
        updatedAt: String!
    }
`