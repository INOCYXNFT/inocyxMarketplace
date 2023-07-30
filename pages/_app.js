import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import dynamic from "next/dynamic";
import Layout from "./layout";
import { AnimatePresence } from "framer-motion"
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
// Wallet
import { createConfig, WagmiConfig } from "wagmi";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import lightTheme from "../theme";
import client from "../apollo/apolloClient";
import "../styles/globals.css";
import firebaseConfig from "../firebaseConfig";
const TopProgressBar = dynamic(
  () => {
    return import("../components/core/PageProgress");
  },
  { ssr: false }
);
import { wrapper } from "../store"
import { Provider } from "react-redux"
import { polygonMumbai } from "wagmi/chains"

const web3client = createConfig(
  getDefaultConfig({
    appName: "Inocyx",
    // alchemyId: "jmW5WrDrbXQ60zXkyZBeCSCqYcjOoLJl",
    chains: [polygonMumbai],
  }),
);

if (!firebase?.apps?.length) {
  firebase.initializeApp(firebaseConfig);
}

const MyApp = ({ Component, ...rest }) => {
  const { store } = wrapper.useWrappedStore(rest)
  const { pageProps } = rest;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <ThemeProvider theme={lightTheme}>
            <WagmiConfig config={web3client} >
              <ConnectKitProvider debugMode>
                <Layout>
                  <CssBaseline />
                  <TopProgressBar />
                  <Component {...pageProps} />
                </Layout>
              </ConnectKitProvider>
            </WagmiConfig>
          </ThemeProvider>
        </ApolloProvider>
      </Provider>
    </AnimatePresence>
  );
};

export default MyApp;
