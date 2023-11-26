const { GraphQLError } = require('graphql');
const { PubSub } = require('graphql-subscriptions');

const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pubsub = new PubSub();

const resolvers = {
  Query: {
    authorCount: async () => await Author.collection.countDocuments(),
    bookCount: async () => await Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {};

      if (args.author) {
        const author = await Author.findOne({
          name: args.author,
        });

        if (author) {
          query.author = author._id;
        } else {
          return {};
        }
      }

      if (args.genre) {
        query.genres = { $in: [args.genre] };
      }

      return await Book.find(query).populate('author');
    },
    allAuthors: async () => {
      const authors = await Author.find({});

      return Promise.all(
        authors.map(async (author) => {
          const books = await Book.find({ author: author._id });

          return {
            ...author._doc,
            bookCount: books.length,
          };
        })
      );
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Book: {
    author: async (root, args, context) => {
      const author = await Author.findOne({
        _id: root.author,
      });
      return author;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (await Book.findOne({ title: args.title })) {
        throw new GraphQLError('Book already exists', {
          extensions: {
            code: 'BAD_BOOK_INPUT',
            invalidArgs: args.title,
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }

      const newBook = new Book({ ...args, author: author._id });
      await newBook.save();

      return newBook;
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });

      if (!author) return null;

      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError('Saving born failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      }

      return author;
    },
    addAuthor: async (root, args, context) => {
      if (await Author.findOne({ name: args.name })) {
        throw new GraphQLError('Author already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        });
      }

      const newAuthor = new Author({
        name: args.name,
        born: args.born,
      });

      await newAuthor.save();

      return newAuthor;
    },
    createUser: async (root, args) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);

      const user = new User({ username: args.username, passwordHash });

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user) {
        throw new GraphQLError('Wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const passwordCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash);

      if (!passwordCorrect) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },
  },
};

module.exports = resolvers;
