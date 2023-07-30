"use client"
import React, { Fragment, useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import { Avatar, IconButton, Tab, Tabs, Box } from "@mui/material";
import client from "../../apollo/apolloClient";
import SearchBox from "../../components/core/SearchBox";
import SortOrder from "../../components/core/SortOrder";
import NFT from "../../components/core/NFT";
import Router, { useRouter } from "next/router";
import { LAND_ADDRESS, TRANSACTION_ENDPOINT } from "../../constants";
import Loader from "../../components/core/Loader";
import { useQuery } from "@apollo/client";
import { NFT_TYPES, NFT_SORTING, NFT_STATUS } from "../../constants";
import {
  getLandsByCollectionID,
  getNFTSByCollectionID,
  GetCollectionById,
  GET_ACTIVITIES_BY_COLLECTION_ID,
} from "../../apollo/api/query";
import Selector from "../../components/core/SortOrder";
import Image from "next/image";
import PageTransition from "../../components/core/PageTransition";
import { NFTSkeleton } from "../../components/core/SkeletonHub";
import EmptyState from "../../components/core/EmptyState";
import Link from "next/link";
import { truncateAddress } from "../../utility";
import { Share, Twitter } from "@mui/icons-material";
import { Global, Instagram } from "iconsax-react";
import TabPanel from "../../components/core/TabPanel";
import Items from "../../components/collections/Items";
import Activity from "../../components/collections/Activity";


let INIT_FILTER = {
  collectionId: "",
  text: "",
  categoryId: "",
  minPrice: "1",
  maxPrice: "",
  limit: 10,
  pageCount: 1,
  nftType: "",
  status: "all",
  filterBy: "all"
}

const tabs = [
  {
    name: "Items",
    path: "items"
  },
  {
    name: "Activity",
    path: "activity"
  }
]

function Collections() {
  const [allNFTs, setAllNFTs] = useState([]);
  const [globalNFTCollection, setGlobalNFTCollection] = useState({});
  const [filtered, setFiltered] = useState([]);
  const [activities, setActivities] = useState([]);
  const [query, setQuery] = useState("");
  const [listOption, setListOption] = useState(0);
  const [priceOption, setPriceOption] = useState(0);
  const router = useRouter();
  const descriptionRef = useRef()
  const desContainerRef = useRef()
  const [loader, setLoader] = useState(false);
  const [filterProperties, setFilterProperties] = useState(INIT_FILTER)
  const [collectionType, setCollectionType] = useState('')
  INIT_FILTER.collectionId = router.query.id
  const { data, loading, error, refetch } = useQuery(getNFTSByCollectionID, {
    variables: INIT_FILTER
  })
  // const metadata = JSON.parse(localStorage.getItem('metadata'));
  const [transactionType, setTransactionType] = useState("");
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    // window.location.href = window.location.href + "#" + tabs[newValue].path
    setTabIndex(newValue);
  };

  const getCollectionStats = useCallback((id) => {
    setLoader(true);
    client
      .query({
        query: GetCollectionById,
        variables: {
          collectionId: id,
          isLand: false
        },
      })
      .then((result) => {
        console.log(result)
        setCollectionType(result?.data?.getCollectionById?.nftType)
        setGlobalNFTCollection(result?.data?.getCollectionById);
        setLoader(false);
      })
      .catch((e) => {
        console.log(e)
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    client
      .query({
        query: GET_ACTIVITIES_BY_COLLECTION_ID,
        variables: { collectionId: router.query.id, transactionType: transactionType }
      })
      .then((res) => {
        console.log(res?.data?.getActivitiesByCollectionId);
        setActivities(res?.data?.getActivitiesByCollectionId);
      })
      .catch((error) => {
        // console.log(error.message);
      })
  }, [transactionType]);

  useEffect(() => {
    if (router.isReady) {
      getCollectionStats(router.query.id);
      setFilterProperties(prev => Object.assign(prev, { collectionId: router.query.id, nftType: collectionType }))
      refetch(filterProperties)
    }
    if (desContainerRef.current.scrollHeight < descriptionRef.current.offsetHeight) {
      console.log(desContainerRef.current.scrollHeight, descriptionRef.current.offsetHeight)
      document.getElementById('show_more').style.display = 'none'
    }
  }, [router, collectionType]);

  useEffect(() => {
    if (query?.length) {
      setFiltered(
        allNFTs.filter(
          (nft) =>
            nft.itemName.indexOf(query) !== -1 ||
            nft.itemName.toLowerCase().indexOf(query) !== -1
        )
      );
    } else {
      setFiltered(allNFTs);
    }
  }, [query]);

  useEffect(() => {
    if (listOption === 1) {
      setFiltered(allNFTs.filter((nft) => nft.forSale === true));
    } else setFiltered(allNFTs);
  }, [listOption]);

  useEffect(() => {
    if (data?.getNFTSByCollectionID) {
      setAllNFTs(data?.getNFTSByCollectionID)
    }
  }, [data, filterProperties])

  function handleFilterPropertyChange(type, value) {
    switch (type) {
      case 'search':
        setFilterProperties(prevProp => Object.assign(prevProp, { text: value }))
        break;
      case 'sort':
        setFilterProperties(prevProp => Object.assign(prevProp, { sort: value }))
        break;
      case 'minPrice':
        setFilterProperties(prevProp => Object.assign(prevProp, { minPrice: value }))
        break;
      case 'maxPrice':
        setFilterProperties(prevProp => Object.assign(prevProp, { maxPrice: value }))
        break;
      case 'latestList':
        setFilterProperties(prevProp => Object.assign(prevProp, { latestList: value }))
        break;
      case 'status':
        setFilterProperties(prevProp => Object.assign(prevProp, { status: value }))
        break;
      case 'nftType':
        setFilterProperties(prevProp => Object.assign(prevProp, { nftType: value }))
        break;
      case 'filter':
        setFilterProperties(prevProp => Object.assign(prevProp, { filterBy: value }))
        break;
    }
    // console.log(filterProperties, type, value)
    refetch(filterProperties)
  }

  function handleShowMore(showRef) {
    if (descriptionRef.current.classList.contains('description-text-clip')) {
      descriptionRef.current.classList.remove('description-text-clip')
      showRef.textContent = 'Show less'
    } else {
      descriptionRef.current.classList.add('description-text-clip')
      showRef.textContent = 'Show more'
    }
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    refetch({
      variables: {
        transactionType: transactionType
      }
    })
  }, [transactionType])

  return (
    <PageTransition>
      <Head>
        <title>Inocyx | On the Moon Marketplace</title>
      </Head>
      <Loader isLoading={loader} />

      <div className="relative -mt-6">
        <Image
          src={globalNFTCollection?.banner ?? "/collection_banner.svg"}
          alt="Your Alt Text"
          width={1000}
          height={1000}
          className="w-full h-[200px] md:h-[300px] object-cover "
        />
        <div className="absolute z-10  inset-0 bg-gradient-to-t from-forground to-transparent"></div>
      </div>

      <div className="relative text-white w-11/12 z-50  font-sans max-w-screen-2xl mx-auto -mt-20 flex flex-col gap-4">
        <div className="flex md:flex-row flex-col gap-2">
          <Avatar
            src={globalNFTCollection.collectionImageURL}
            className="-mt-12 border-[1px] border-white w-24 h-24"
          />

          <div className="flex flex-col items-start gap-4 w-full mx-auto ">
            <div className="flex flex-col items-start gap-2 justify-center md:-mt-12">
              <span className="font-sans font-bold text-2xl md:text-5xl mt-2">
                {globalNFTCollection.collectionName}
              </span>
              <div className="flex flex-row items-center gap-6" >
                <p className="font-sans flex flex-row gap-1">
                  <span className="opacity-60" >By</span><span className="hover:text-primary" >{truncateAddress(globalNFTCollection.creatorAddress)}</span>
                </p>
                <p className="font-sans flex flex-row gap-1">
                  <span className="opacity-60" >Address</span>
                  <Link target="_blank" href={`${TRANSACTION_ENDPOINT}/address/${globalNFTCollection.collectionAddress}`} className="hover:text-primary" >
                    {truncateAddress(globalNFTCollection.collectionAddress)}
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-between w-full gap-4 md:gap-36">
              <div className="w-full" ref={desContainerRef} >
                <span className="description-text-clip md:w-4/5 w-full opacity-60" ref={descriptionRef}>
                  {globalNFTCollection.collectionDescription}
                </span>
                <p id="show_more" className="cursor-pointer hover:underline" onClick={(e) => handleShowMore(e.target)}>Show more</p>
              </div>
              <div className="flex flex-row gap-2 md:gap-8 items-center md:w-4/5 w-full justify-between" >
                <div className="flex flex-col items-start" >
                  <p className="opacity-50 md:text-md text-sm" >Floor price</p>
                  <p className="md:text-2xl text-lg font-bold" >{globalNFTCollection?.floorPrice ?? 0}</p>
                </div>
                <div className="w-[1px] h-10 bg-gradient-to-t from-transparent via-white to-transparent" />
                <div className="flex flex-col items-start" >
                  <p className="opacity-50 md:text-md text-sm" >Volume</p>
                  <p className="md:text-2xl text-lg font-bold" >{globalNFTCollection?.volume ?? 0}</p>
                </div>
                <div className="w-[1px] h-10 bg-gradient-to-t from-transparent via-white to-transparent" />
                <div className="flex flex-col items-start" >
                  <p className="opacity-50 md:text-md text-sm" >Items</p>
                  <p className="md:text-2xl text-lg font-bold" >{globalNFTCollection?.totalItems ?? 0}</p>
                </div>
                <div className="w-[1px] h-10 bg-gradient-to-t from-transparent via-white to-transparent" />
                <div className="flex flex-col items-start" >
                  <p className="opacity-50 md:text-md text-sm" >Owners</p>
                  <p className="md:text-2xl text-lg font-bold" >{globalNFTCollection?.owners ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>




        {/* <div className="  mx-auto mt-4 hidden w-11/12 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-7 gap-4 md:grid max-w-screen-2xl">
          <SearchBox onChange={handleFilterPropertyChange} />
          <Selector
            value={filterProperties.nftType}
            label="Type"
            onChange={handleFilterPropertyChange}
            options={NFT_TYPES}
          />
          <Selector
            value={filterProperties.status}
            label="Status"
            onChange={handleFilterPropertyChange}
            options={NFT_STATUS}
          />
          <Selector
            value={filterProperties.filterBy}
            label="Filter"
            onChange={handleFilterPropertyChange}
            options={NFT_SORTING}
          />
        </div> */}

        {/* {loading ? <NFTSkeleton /> :
          allNFTs && allNFTs.length ? (
            <div className="mx-auto grid w-11/12 grid-cols-2 gap-y-10 gap-x-4 pt-14 pb-10 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-screen-2xl ">
              {allNFTs.map((asset) => (
                <NFT
                  key={asset.id}
                  asset={asset}
                  transaction={asset}
                  onClick={() => Router.push(`/asset/${asset._id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState description="No NFT to display" />
          )} */}
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
          {tabs.map((tab, index) => (
            <Tab label={tab.name}  {...a11yProps(index)} />
          ))}
        </Tabs>
        <TabPanel value={tabIndex} index={0} >
          <Items handleFilter={handleFilterPropertyChange} loading={loading} data={data?.getNFTSByCollectionID} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1} >
          <Activity loading={loading} data={activities} transactionType={transactionType} setTransactionType={setTransactionType} />
        </TabPanel>
      </div>


    </PageTransition>
  );
}

export default Collections;
