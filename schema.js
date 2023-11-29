const typeDefs = `

    type User {
        username: String!
        authors: [Author!]!
        books: [Book!]!
        id: ID!
    }

    type Token {
        value: String!
    }

    type Author {
        name: String!
        born: Int
        bookCount: Int!
        id: ID!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String!]!
    }
    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        booksByGenre(genre: String!): [Book!]!
        me: User
    }

    type Mutation {
        addBook(
            title: String!
            published: Int!
            author: String!
            genres: [String!]!
        ) : Book!

        editAuthor(
            name: String!
            setBornTo: Int!
        ) : Author

        addAuthor(
            name: String!
            born: Int
        ) : Author

        createUser(
            username: String!
            password: String!
        ) : User

        login(
            username: String!
            password: String!
        ) : Token
    }

    type Subscription {
        bookAdded: Book!
    }
`;

module.exports = typeDefs;
