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
        id: String!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        id: String!
        genres: [String!]!
    }
    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
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
`;

module.exports = typeDefs;
