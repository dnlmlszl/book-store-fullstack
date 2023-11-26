import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { UserProvider } from './context/UserContext.jsx';
import { setContext } from '@apollo/client/link/context';

import { ALL_BOOKS } from './queries/queries.js';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('bookAPIToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // uri: 'http://localhost:5000/graphql',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

client.query({ query: ALL_BOOKS }).then((response) => {
  const books = response.data.allBooks;
  console.log(books);
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
