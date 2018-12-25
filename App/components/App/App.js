import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

import Restaurants from '../Restaurants/Restaurants';
import Search from '../Search/Search';

import { AppProvider } from '../Context/AppProvider';
import { GRAPHQL_API_URL } from '../../utils/constants';

const httpLink = new HttpLink({ uri: GRAPHQL_API_URL });

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const middlewareLink = new ApolloLink((operation, forward) => {
  return forward(operation)
});

const link = ApolloLink.from([
  middlewareLink,
  errorLink,
  httpLink,
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const AppNav = createStackNavigator(
  {
    Restaurants: {
      screen: Restaurants,
    },
    Search: {
      screen: Search,
    },
  },
  {
    initialRouteName: 'Restaurants',
    navigationOptions: {
      header: null,
    },
    headerMode: 'screen',
    cardStyle: { backgroundColor: '#E9F2FB' },
  },
);

export const RootNavigator = createSwitchNavigator(
  {
    AppNav: {
      screen: AppNav,
      path: null
    },
  },
  {
    initialRouteName: 'AppNav',
    navigationOptions: {
      header: null
    },
  }
);

const App = () => (
  <ApolloProvider client={client}>
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  </ApolloProvider>
);

export default App;
