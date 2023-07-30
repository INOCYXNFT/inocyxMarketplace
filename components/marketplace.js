import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import ArtistList from "./marketplace1/ArtistList";
import Link from "next/link";
import client from "../apollo/apolloClient";
import Image from "next/image";
import EastIcon from "@mui/icons-material/East"

import Hero from "./landing/Hero";
import About from "./landing/About";
import Celebrity from "./landing/Celebrity";

import {
  getArtists,
  getUpcomingCollection,
  spotlightNFT,
  getAllCollectionStats,
  getAllCollections,
} from "../apollo/api/query";
import Loader from "./core/Loader";
import CollectionTable from "./Table/CollectionTable1";
import MockDetails from "./landing/MockDetails";
import EmptyState from "./core/EmptyState";

function MarketplaceLandingPage() {
  const [collections, setCollections] = useState([]);
  const [artists, setArtists] = useState([]);
  const [upcomingCollections, setUpcomingCollections] = useState([]);
  const [spotlight, setSpotlight] = useState([]);
  const [loader, setLoader] = useState(false);

  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  const slides = [
    {
      url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80",
    },

    {
      url: "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80",
    },
    {
      url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    setLoader(true);
    client
      .query({
        query: getAllCollections,
        variables: {
          name: '',
          sort: 1
        }
      })
      .then((result) => {
        setCollections(result?.data?.getAllCollections);
      })
      .catch(() => { });
    client
      .query({
        query: getArtists,
      })
      .then((result) => {
        setArtists(result?.data?.getArtists);
      })
      .catch(() => { });
    client
      .query({
        query: spotlightNFT,
      })
      .then((result) => {
        setSpotlight(result?.data?.spotlightNFT);
      })
      .catch(() => { });
    client
      .query({
        query: getUpcomingCollection,
      })
      .then((result) => {
        setUpcomingCollections(result?.data?.getUpcomingCollection);
        setLoader(false);
      })
      .catch(() => { });
  }, []);

  return (
    <div className="text-white ">
      <Head>
        <title>Inocyx | On the Moon Marketplace</title>
      </Head>
      <Loader isLoading={loader} />

      {/* Gradient for Hero Section */}
      <div className="gradient_hero ">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 w-full h-full">
            <Image
              src="/hero_bg.webp"
              alt="Background Image"
              width={100}
              height={100}
              className="w-full opacity-40 h-[100vh] object-cover"
            />
          </div>

          <div className="relative w-full max-w-screen-2xl mx-auto z-10">
            <Hero />
            <MockDetails />
          </div>
        </div>
      </div>

      {/* About Section and Celebrities */}

      <div className="relative">
        <div className="absolute top-0 left-0 right-0 w-full h-full object-cover ">
          <Image
            src="/about.svg"
            alt="Background Image"
            width={100}
            height={100}
            className="w-full h-3/4 object-cover"
          />
        </div>
        <div className="relative  w-full max-w-screen-2xl mx-auto ">
          <About />
        </div>
      </div>

      <div className="relative  w-full mt-20   ">
        <Celebrity />
      </div>

      <section className="relative ">
        <div className="absolute top-0 left-0 right-0 w-full object-cover">
          <Image
            src="/feature_bg.webp"
            alt="Background Image"
            width={100}
            height={100}

            className="w-full h-[100%] opacity-40 object-cover "
          />
        </div>
        <div className="flex flex-col gap-10">
          <ArtistList artists={artists} />
          <div className="relative  flex flex-col w-11/12 mb-10 mx-auto items-start ">
            <div className="flex flex-row items-center w-full">
              <span className="md:text-5xl text-lg font-normal font-KronaOne self-center  p-3 ">
                Top Collections
              </span>

              <Link href="/collections">
                <div className="flex flex-row gap-1 items-center">
                  <button className="px-4 py-2 rounded-lg text-white hover:text-white text-lg font-mulish">
                    View all
                  </button>
                  <svg width={0} height={0}>
                    <linearGradient id="linearColors" x1={1} y1={0} x2={1} y2={1}>
                      <stop offset={0} stopColor="rgba(6, 209, 248, 1)" />
                      <stop offset={1} stopColor="rgba(222, 23, 158, 1)" />
                    </linearGradient>
                  </svg>

                  <EastIcon
                    sx={{ fill: "url(#linearColors)" }}
                    className="text-white text-2xl animate-bounce"
                  />
                </div>
              </Link>
            </div>
            {collections?.length ? <CollectionTable collection_data={collections} /> : <div className="w-full flex items-center justify-center " >
              <EmptyState description="No collections to show" />
            </div>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MarketplaceLandingPage;
