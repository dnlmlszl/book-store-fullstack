require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const connectDB = require('./db/connect');

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const app = express();

const typeDefs = require('./schema');
const resolvers = require('./resolvers_wr');

const User = require('./models/user');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

app.use(cors());

app.use(express.json());

(async () => {
  await server.start();
  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      path: '/graphql',
      context: async ({ req }) => {
        let currentUser = null;
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
          const token = auth.substring(7);
          try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            currentUser = await User.findById(decodedToken.id)
              .populate('authors')
              .populate('books');
          } catch (error) {
            console.error('There was an error when authenticated', error);
          }
        }
        return { currentUser };
      },
    })
  );
})();

app.use(express.static('dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
