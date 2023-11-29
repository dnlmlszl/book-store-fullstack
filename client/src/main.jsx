import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  split,
} from '@apollo/client';
import { UserProvider } from './context/UserContext.jsx';
import { setContext } from '@apollo/client/link/context';

import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { ALL_BOOKS } from './queries/queries.js';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('bookAPIToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = new HttpLink({
  uri: 'http://localhost:5000',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:5000',
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Book: {
        keyFields: ['title'],
      },
    },
  }),
  link: splitLink,
});

client
  .query({ query: ALL_BOOKS })
  .then((response) => {
    const books = response.data.allBooks;
    console.log(books);
  })
  .catch((error) => {
    console.error('Error fetching books:', error);
  });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <UserProvider>
        <App />
      </UserProvider>
    </ApolloProvider>
  </React.StrictMode>
);
