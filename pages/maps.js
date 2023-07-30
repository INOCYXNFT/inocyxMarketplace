import React, { useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import PageTransition from "../components/core/PageTransition";
import Lottie from "react-lottie-player";
import LottieLoader from "../components/core/LottieLoader";

export default function Maps() {
  const MapWithNoSSR = dynamic(() => import("../components/maps/MapContainer"), {
    ssr: false
  });

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => document.body.style.overflow = "auto"
  }, [])

  return (
    <PageTransition>
      <main>
        <Head>
          <title>Inocyx | On the Moon Marketplace</title>
        </Head>
        <div id="map" style={{ height: "100vh", width: "100%" }}>
          <MapWithNoSSR />
          <div className="h-[100vh] w-full fixed inset-0 items-center justify-center text-neutral-300 text-7xl bg-background backdrop-blur-xl bg-opacity-60 font-bold z-50 flex flex-col">
            <LottieLoader loader_name="map" loop={true} width={400} height={400} />
            <h1 className="font-sans text-4xl -mt-12" >Coming Soon...</h1>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
