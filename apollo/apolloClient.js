import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  ssrMode: true,
  uri: 'https://api2.inocyx.com/graphql',
  cache: new InMemoryCache(),
});

export default client;
