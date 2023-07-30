import React, { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { TablePagination } from "@mui/material";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import Link from "next/link";
import SearchBox from "../../components/core/SearchBox";
import Selector from "../../components/core/SortOrder";
import { NFT_SORTING } from "../../constants";
import client from "../../apollo/apolloClient";
import { getAllCategory, getAllCollections } from "../../apollo/api/query";
import Loader from "../../components/core/Loader";
import CollectionTable1 from "../../components/Table/CollectionTable1";
import PageTransition from "../../components/core/PageTransition";
import { useQuery } from "@apollo/client";

let INIT_FILTER = {
  name: "",
  sort: 1
}

function Collections() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [allCategories, setAllCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loader, setLoader] = useState(false);
  const [allNFTs, setAllNFTs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  const [priceOption, setPriceOption] = useState(0);
  const [listOption, setListOption] = useState(0);
  // const [cateogries, setCategories] = useState(0);
  const [filterProperties, setFilterProperties] = useState(INIT_FILTER)
  const { data, loading, error, refetch } = useQuery(getAllCollections, {
    variables: filterProperties
  })
  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (data?.getAllCollections) {
      setCollections(data?.getAllCollections)
    }
  }, [data, loading])

  useEffect(() => {
    setLoader(true);
    client
      .query({
        query: getAllCategory,
      })
      .then((result) => {
        setAllCategories(result?.data?.getAllCategory);
        setLoader(false);
      })
      .catch((e) => {
        setLoader(false);
      });
  }, []);

  function handleFilterPropertyChange(type, value) {
    switch (type) {
      case 'search':
        setFilterProperties(prevProp => Object.assign(prevProp, { name: value }))
        break;
      case 'filter':
        setFilterProperties(prevProp => Object.assign(prevProp, { sort: value }))
        break;
    }
    refetch(filterProperties)
  }

  return (
    <PageTransition>
      <Loader isLoading={loading} />
      {/* <div className="h-56 bg-gradient-to-r from-gray-900/20 via-[#343C47] to-gray-900/20 mb-10 justify-center overflow-hidden">
        <div className="flex flex-col items-center" >
          <h1 className="md:text-4xl text-2xl font-bold mt-12 font-sans">
            Top Collections
          </h1>
          <p className="my-2 font-sans text-lg text-center opacity-60 w-1/3">
          The largest digital marketplace NFTs ranked by volume, floor price and other statistics! Stop saying tomorrow and start now! Start to save your asset.
        </p>
        </div>
        <div className='z-0 absolute top-[64px] w-full' >
          <Image
            src="/collections_bg.svg"
            alt="Backgroud"
            className="object-cover w-full h-56"
            width={100}
            height={100}
          />
        </div>
      </div> */}

      <div className="hero_gradient_page">
        <div className="relative ">
          <Image
            src="/hero_bg.webp"
            alt="Your Alt Text"
            width={100}
            height={100}
            className="w-full h-[300px] object-cover "
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 gap-6 flex flex-col justify-center items-center text-white">
            <h1 className=" font-bold font-KronaOne md:text-4xl text-3xl">
              {" "}
              Top collections
            </h1>
            <p className="font-mulish font-normal md:text-xl text-lg text-center opacity-60">
              The largest digital marketplace NFTs ranked by volume, floor price
              and other <br /> statistics! Stop saying tomorrow and start now!
              Start to save your asset.
            </p>
          </div>
        </div>
      </div>

      <section>
        {/* <div className="  mx-auto -mt-10 hidden w-11/12 grid-cols-6 gap-4 md:grid">
          <SearchBox onChange={handleFilterPropertyChange} />
          <Selector
            value={filterProperties.sort}
            label="Filter"
            onChange={handleFilterPropertyChange}
            options={NFT_SORTING}
          />
        </div> */}
        <div className="mx-auto w-11/12 ">
          <CollectionTable1 collection_data={collections} />
        </div>

      </section>

    </PageTransition>
  );
}

export default Collections;
