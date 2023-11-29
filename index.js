require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

const { expressMiddleware } = require('@apollo/server/express4');

const connectDB = require('./db/connect');

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

const typeDefs = require('./schema');
const resolvers = require('./resolvers_wr');
const User = require('./models/user');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.set('debug', true);

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
  })
);
app.use(hpp());
app.use(xss());

const httpServer = http.createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/',
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

(async () => {
  await server.start();
  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
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
