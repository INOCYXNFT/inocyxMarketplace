/* eslint-disable @next/next/next-script-for-ga */
import dynamic from "next/dynamic";
import Head from "next/head";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion"
import PropTypes from "prop-types";
import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { getInfo, setInfo } from "../store/slices/utilSlice";
import { useSelector } from "react-redux";

const Footer = dynamic(() => import("../components/core/Footer"));
const Header = dynamic(() => import("../components/core/Header"));

const ROUTES_DISCRETE_HEADER = ["inocyx", "auth", "login", "signup"];
const ROUTES_DISCRETE_FOOTER = ["inocyx", "auth", "maps", "login", "signup"];

function Layout({ children }) {
  const router = useRouter();
  const [activePage, setActivePage] = useState("")
  const info = useSelector(getInfo)
  useEffect(() => {
    setActivePage(router.pathname.split('/')?.[1])
  }, [router, activePage])

  const footer = !ROUTES_DISCRETE_FOOTER.includes(router.route.slice(1)) ? <Footer /> : null;
  const header = !ROUTES_DISCRETE_HEADER.includes(router.route.slice(1)) ? <><Header activePage={activePage} /><div className="mt-16" /></> : null;

  return (
    <>
      <Head>
        <meta
          name="description"
          content="Buy, Sell and Trade Bitcoin & other cryptocurrencies from the world’s leading cryptocurrency exchange, INOCYX."
        />
        <meta name="keywords" content="Metaverse" />

        <meta property="og:type" content="image/jpeg" />
        <meta property="og:url" content="https://www.inocyx.com/" />
        <meta property="og:image" content="/icon_152x152.png" />
        <meta property="og:image:secure_url" content="/icon_152x152.png" />
        <meta property="og:image:alt" content="Logo of Inocyx" />
        <meta property="og:image:width" content="152" />
        <meta property="og:image:height" content="152" />
        <meta property="og:site_name" content="Inocyx" />
        <meta name="theme-color" content="#081223" />
        <link rel="canonical" href="https://www.inocyx.com/" />
        {/* Windows Phone  */}
        <meta name="msapplication-navbutton-color" content="#081223" />
        {/* iOS Safari */}
        <meta name="apple-mobile-web-app-status-bar-style" content="#081223" />
        <link rel="icon" href="/favicon.ico" />

        <noscript>
          <iframe
            title="gtag"
            src="https://www.googletagmanager.com/ns.html?id=GTM-NKWJVJS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <title>Inocyx | NFT Marketplace</title>
      </Head>
      <Snackbar
        open={Object.keys(info)?.length > 0}
        autoHideDuration={6000}
        // onClose={() => setInfo({})}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        style={{ zIndex: 99999 }}
      >
        <Alert variant="filled" onClose={() => setInfo({})} severity={info.type} sx={{ width: '100%' }}>
          <AlertTitle>{info.type}</AlertTitle>
          {info.message}
        </Alert>
      </Snackbar>
      {header}
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="w-full"
      >
        {children}
      </motion.div>
      {footer}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.array,
};

export default Layout;
