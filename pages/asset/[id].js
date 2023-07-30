/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-undef */
"use client"
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  AlertTitle,
  CircularProgress,
  Avatar,
  ButtonBase,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { CurrencyBitcoin } from "@mui/icons-material";

import {
  Edit,
  ShareOutlined,
  MoreVertOutlined,
  CheckCircle,
} from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";
import { gql } from "@apollo/client";
import client from "../../apollo/apolloClient";
import MarketplaceABI from "../../contracts/MarketplaceABI";
import ABI from "../../contracts/contractABI";
import { useRouter } from "next/router";
import { getNFTByID, getUserDetails } from "../../apollo/api/query";
import { CREATE_NFT_TRANSACTION, burnNFT, reportNFT } from "../../apollo/api/mutations";
// import Bids from "../../components/assets/Bids";
import { isMobileChecker, truncateAddress } from "../../utility";
// import Stats from "../../components/assets/Stats";
import Offers from "../../components/assets/Offers";
import Modal from "../../components/core/Modal";
import DropDown from "../../components/core/DropDown";
import CopyContent from "../../components/core/CopyContent";
import { LAND_ADDRESS, POLYGON_MUMBAI_RPC } from "../../constants/index";
import Loader from "../../components/core/Loader";
import { useAccount } from "wagmi";
import PropertyDetails from "../../components/core/PropertyDetails";
import ShareDetails from "../../components/core/ShareDetails";
import AssetidHero from "../../components/core/AssetidHero";
import AssetDetails from "../../components/core/AssetDetails";
import AssetImage from "../../components/core/AssetImage";
import PageTransition from "../../components/core/PageTransition";
import { ethers } from "ethers"
import { MARKETPLACE } from "../../contracts/Addresses";
import MARKETPLACE_ABI from "../../contracts/InocyxMarketplace_ABI.json"
import LimitedEditionABI from "../../contracts/LimitedEditionNFT_ABI.json"
import LimitedTimeABI from "../../contracts/LimitedTimeNFT_ABI.json"
import IOXTOKEN_ABI from "../../contracts/InocyxToken_ABI.json"
import { LIMITED_EDITION, LIMITED_TIME, IOX } from "../../contracts/Addresses"
import LottieLoader from "../../components/core/LottieLoader";
import moment, { min } from "moment";
import EmptyState from "../../components/core/EmptyState";
import { TickCircle } from "iconsax-react";
import Link from "next/link";
const MARKETPLACE_ADDRESS = "0x5c9c886d6074520CAEDd60729D286153A68930E9";
import TabPanel from "../../components/core/TabPanel";
import Overview from "../../components/assets/Overview";
import Sales from "../../components/assets/Sales";
import Activity from "../../components/collections/Activity";
import ActivityTable from "../../components/assets/Activity";
import Bids from "../../components/assets/Bids";

const tabs = [
  {
    name: "Overview",
    path: "overview"
  },
  {
    name: "Sales",
    path: "sales"
  },
  // {
  //   name: "Bids",
  //   path: "bid"
  // },
  {
    name: "Activity",
    path: "activity"
  },
]

const INITIAL_STATUS = {
  status: '',
  title: '',
  description: ""
}
const NftDetails = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sellModal, setSellModal] = useState(false);
  const [price, setPrice] = useState();
  const [info, setInfo] = useState({})
  const [nft, setNft] = useState(null);
  const [loader, setLoader] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  // const [copied, setCopied] = useState(false)
  const open = Boolean(anchorEl);
  const [addProperty, setAddProperty] = useState("");
  const [addPropertyPopup, setAddPropertyPopup] = useState(false);
  const [burnModal, setBurnModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState(0);
  const [buyModal, setBuyModal] = useState(false);
  // const [bidModal, setBidModal] = useState(false)
  const [offerModal, setOfferModal] = useState(false);
  const [offer, setOffer] = useState({});
  const [showSnack, setShowSnack] = useState("");
  const [properties, setProperties] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const { isConnected, address } = useAccount();
  const account = address;
  const [transactionStatus, setTransactionStatus] = useState(INITIAL_STATUS);
  const [buyableAssets, setBuyableAssets] = useState([])
  const [minAsset, setMinAsset] = useState({})
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();

  const id = router.query.id;

  const mintLand = gql`
    mutation MintLand($uniqueID: String!, $wallet: String!) {
      mintLand(uniqueID: $uniqueID, wallet: $wallet) {
        id
        tokenID
        itemDescription
        collectionID
        itemImage
        itemName
        location
        country
        isMinted
        forSale
        ownerAddress
        collectionDetails {
          id
          collectionAddress
        }
      }
    }
  `;

  const purchaseNFT = gql`
    mutation PurchaseNFT($uniqueID: String!, $buyer: String!) {
      purchaseNFT(uniqueID: $uniqueID, buyer: $buyer) {
        id
        tokenID
        itemDescription
        collectionID
        itemImage
        itemName
        location
        country
        isMinted
        forSale
        ownerAddress
      }
    }
  `;

  const PutOnSale = gql`
    mutation PutOnSale(
      $uniqueID: String!
      $price: String!
      $isLand: Boolean!
      $contractListingID: String!
    ) {
      putOnSale(
        uniqueID: $uniqueID
        price: $price
        isLand: $isLand
        contractListingID: $contractListingID
      ) {
        id
        tokenID
        itemDescription
        collectionID
        itemImage
        itemName
        location
        country
        isMinted
        forSale
        ownerAddress
      }
    }
  `;

  const cancelListingNFT = gql`
    mutation cancelNFTSale($uniqueID: String!) {
      cancelNFTSale(uniqueID: $uniqueID) {
        id
      }
    }
  `;

  const AddCustomInfo = gql`
    mutation AddCustomInfo($id: String!, $content: String!) {
      addCustomInfo(id: $id, content: $content) {
        id
        tokenID
        itemDescription
        collectionID
        customInfo
        itemImage
        itemName
        location
        country
        isMinted
        forSale
        ownerAddress
      }
    }
  `;

  const handleProperty = (id) => {
    setLoader(true);
    client
      .mutate({
        mutation: AddCustomInfo,
        variables: {
          id,
          content: addProperty,
        },
      })
      .then((res) => {
        setLoader(false);
        setAddPropertyPopup(false);
        // setInfo(res.data.addCustomInfo);
      })
      .catch(() => {
        setLoader(false);
        setAddPropertyPopup(false);
      });
  };

  const mintNFT = async () => {
    setLoader(true);

    // if (nft?.isMinted && nft?.forSale) {
    //   navigate("/nftDetails");
    //   setLoader(false);
    // } else if (account && account) {
    //   const sendOptions = {
    //     contractAddress: "0xB09D4e5e682d98Ec9AfE734596A3F57B6d5Dc5a7",
    //     functionName: "mintLand",
    //     abi: ABI,
    //     msgValue: Moralis.Units.ETH("0.001"),
    //   };

    //   const transaction = await Moralis.executeFunction(sendOptions);

    //   // Wait until the transaction is confirmed
    //   await transaction.wait();
    //   client
    //     .mutate({
    //       mutation: mintLand,
    //       variables: {
    //         uniqueID: nft?.id,
    //         buyer: account,
    //       },
    //     })
    //     .then((res) => {
    //       setLoader(false);
    //       return true;
    //     });
    // }
  };

  const buyNft = async () => {
    setLoader(true);
    // if (
    //   account &&
    //   nft?.currentSale?.contractListingID != null
    // ) {
    //   const sendOptions = {
    //     contractAddress: MARKETPLACE_ADDRESS,
    //     functionName: "buyAssetFromListing",
    //     abi: MarketplaceABI,
    //     msgValue: Moralis.Units.ETH(nft?.currentSale?.listPrice),
    //     params: {
    //       listingId: nft?.currentSale?.contractListingID,
    //       erc20Address: "0x0000000000000000000000000000000000000000",
    //     },
    //   };

    //   try {
    //     const transaction = await Moralis.executeFunction(sendOptions);
    //     // --> "0x39af55979f5b690fdce14eb23f91dfb0357cb1a27f387656e197636e597b5b7c"

    //     // Wait until the transaction is confirmed
    //     await transaction.wait();
    //     client
    //       .mutate({
    //         mutation: purchaseNFT,
    //         variables: {
    //           uniqueID: nft?.id,
    //           buyer: account,
    //         },
    //       })
    //       .then(() => {
    //         window.location.reload();
    //         setLoader(false);
    //       });
    //   } catch (e) {
    //     setLoader(false);
    //   }
    // }
  };

  const burnNft = async () => {
    setLoader(true);
    // let options;
    // if (nft?.tokenType == "ERC721") {
    //   options = {
    //     type: nft?.tokenType?.toLowerCase(),
    //     receiver: "0x0000000000000000000000000000000000000000",
    //     contractAddress: nft?.collectionDetails?.collectionAddress,
    //     tokenId: nft?.tokenID,
    //   };
    // } else {
    //   options = {
    //     type: nft?.tokenType?.toLowerCase(),
    //     receiver: "0x0000000000000000000000000000000000000000",
    //     contractAddress: nft?.collectionDetails?.collectionAddress,
    //     tokenId: nft?.tokenID,
    //     amount: 1,
    //   };
  }

  const sellNFT = async () => {
    // setLoader(true);
    // if (account) {
    //   const readOptions = {
    //     contractAddress:
    //       LAND_ADDRESS == router.query.id
    //         ? "0xB09D4e5e682d98Ec9AfE734596A3F57B6d5Dc5a7"
    //         : "0x098AcD423f9Df8b5D041B9925669Ea2dEFc18C7B",
    //     functionName: "isApprovedForAll",
    //     abi: ABI,
    //     params: {
    //       account,
    //       operator: MARKETPLACE_ADDRESS,
    //     },
    //   };

    //   const isApproved = await Moralis.executeFunction(readOptions);
    //   console.log("message==>", account, isApproved);

    //   if (!isApproved) {
    //     const approveAll = {
    //       contractAddress:
    //         LAND_ADDRESS == router.query.id
    //           ? "0xB09D4e5e682d98Ec9AfE734596A3F57B6d5Dc5a7"
    //           : "0x098AcD423f9Df8b5D041B9925669Ea2dEFc18C7B",
    //       functionName: "setApprovalForAll",
    //       abi: ABI,
    //       params: {
    //         approved: true,
    //         operator: MARKETPLACE_ADDRESS,
    //       },
    //     };

    //     await Moralis.executeFunction(approveAll);
    //   }

    //   // isApproved = parent(isApproved._hex);

    //   const sendOptions = {
    //     contractAddress: MARKETPLACE_ADDRESS,
    //     functionName: "createListing",
    //     abi: MarketplaceABI,
    //     // msgValue: Moralis.Units.ETH(price),
    //     params: {
    //       isErc721: LAND_ADDRESS !== nft?.collectionDetails?.collectionID,
    //       nftAddress:
    //         LAND_ADDRESS == router.query.id
    //           ? "0xB09D4e5e682d98Ec9AfE734596A3F57B6d5Dc5a7"
    //           : "0x098AcD423f9Df8b5D041B9925669Ea2dEFc18C7B",
    //       tokenIds: [nft?.tokenID],
    //       price: Moralis.Units.ETH(price),
    //       seller: account,
    //       amount: 1,
    //       erc20Address: "0x0000000000000000000000000000000000000000",
    //     },
    //   };

    //   console.log(sendOptions);

    //   try {
    //     const ListingIdRead = {
    //       contractAddress: MARKETPLACE_ADDRESS,
    //       functionName: "getCurrentListingID",
    //       abi: MarketplaceABI,
    //     };

    //     const message = await Moralis.executeFunction(ListingIdRead);

    //     const transaction = await Moralis.executeFunction(sendOptions);
    //     // --> "0x39af55979f5b690fdce14eb23f91dfb0357cb1a27f387656e197636e597b5b7c"

    //     // Wait until the transaction is confirmed
    //     await transaction.wait();
    //     client
    //       .mutate({
    //         mutation: PutOnSale,
    //         variables: {
    //           uniqueID: nft?.id,
    //           price,
    //           isLand: LAND_ADDRESS === nft.collectionDetails.collectionID,
    //           contractListingID: parseInt(message?._hex)?.toString(),
    //         },
    //       })
    //       .then((res) => {
    //         window.location.reload();
    //         setLoader(false);
    //       });
    //   } catch (e) {
    //     console.log(e);
    //     setLoader(false);
    //   }
    // }
  };

  const cancelNFT = async () => {
    setLoader(true);
    // if (
    //   isAuthenticated &&
    //   account &&
    //   account &&
    //   nft?.currentSale?.contractListingID != null
    // ) {
    //   const sendOptions = {
    //     contractAddress: MARKETPLACE_ADDRESS,
    //     functionName: "cancelListing",
    //     abi: MarketplaceABI,
    //     // msgValue: Moralis.Units.ETH(price),
    //     params: {
    //       listingId: nft?.currentSale?.contractListingID,
    //       erc20Address: "0x0000000000000000000000000000000000000000",
    //     },
    //   };

    //   try {
    //     const readOptions = {
    //       contractAddress: MARKETPLACE_ADDRESS,
    //       functionName: "getCurrentListingID",
    //       abi: MarketplaceABI,
    //     };

    //     const message = await Moralis.executeFunction(readOptions);
    //     const transaction = await Moralis.executeFunction(sendOptions);
    //     // --> "0x39af55979f5b690fdce14eb23f91dfb0357cb1a27f387656e197636e597b5b7c"

    //     // Wait until the transaction is confirmed
    //     await transaction.wait();
    //     client
    //       .mutate({
    //         mutation: cancelListingNFT,
    //         variables: {
    //           uniqueID: nft?.id,
    //         },
    //       })
    //       .then((res) => {
    //         window.location.reload();
    //         setLoader(false);
    //       });
    //   } catch (e) {
    //     setLoader(false);
    //   }
    // }
  };

  const handleSubmit = (type) => {
    switch (type) {
      case "buy":
        setBuyModal(true);
        break;
      case "mint":
        mintNFT();
        break;
      case "sell":
        sellNFT();
        break;
      // case 'update':
      //   updateNFT();
      //   break;
      case "cancel":
        cancelNFT();
        break;
      default:
        break;
    }
  };

  function getNFTApi() {
    setLoader(true);
    if (router?.query?.id?.length > 0) {
      const myAddress = window.localStorage.getItem("walletAddress");
      setWalletAddress(myAddress);
      client
        .query({
          query: getNFTByID,
          variables: {
            nftId: id,
          },
        })
        .then(async (result) => {
          setNft(result?.data?.getNFTByID);
          console.log(result?.data?.getNFTByID)
          const buyAsset = result?.data?.getNFTByID?.transactionHistory.filter(history => history.transactionType === 'list' && history.isSale)
          setBuyableAssets(buyAsset)
          const highestList = buyAsset.sort((asset_a, asset_b) => parseInt(asset_a.price) - parseInt(asset_b.price))
          if (highestList?.length > 0) {
            setMinAsset(highestList?.[0]);
          }
          const user = JSON.parse(window.localStorage.getItem('metadata'))
          setUserDetails(user)
          // client
          //   .query({
          //     query: getUserDetails,
          //     variables: {
          //       walletAddress: result?.data?.getNFTByID?.ownerAddress,
          //     },
          //   })
          //   .then((result) => {
          //     setUserDetails(result?.data?.getUser);
          //   })
          //   .catch((e) => {
          //     // console.log(e);
          //   });
          const property = await fetch(result?.data?.getNFTByID?.metaDataURL)
            .then((res) => res.json())
            .then((data) => data);
          setLoader(false);
          setProperties(property?.properties ?? property?.attributes);
        })
        .catch((e) => {
          console.log(e)
          setLoader(false);
        });
    }
  }

  useEffect(() => {
    getNFTApi()
  }, [id, router]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleShareModel = (media) => {
    if (isMobileChecker() && navigator.share) {
      navigator
        .share({
          title: `${nft?.itemName}`,
          url: window.location.href,
        })
        .then(() => { });
    } else {
      setShareModal(true);
    }
  };

  const handleShare = (media) => {
    let url = "";
    switch (media) {
      case "facebook":
        url = `https://www.facebook.com/dialog/share?app_id=474205870770523&href=${window.location.href}&display=popup`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${nft?.itemName + " by " + nft?.ownerAddress
          }&url=${window.location.href
          }&hashtags=web3,inocyx,metaverse&via=inocyx`;
        break;
      case "whatsapp":
        url = `whatsapp://send?text=This is my new NFT: ${window.location.href}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle/?url=${window.location.href}`;
        break;
    }
    window.open(media == "whatsapp" ? url : encodeURI(url), "_blank");
  };

  const reasons = [
    {
      id: 1,
      name: "Not a valid NFT",
    },
    {
      id: 2,
      name: "NFT duplicates",
    },
    {
      id: 3,
      name: "Price is high",
    },
  ];

  const handleReport = () => {
    setLoader(true);
    if (router?.query?.id) {
      client
        .mutate({
          mutation: reportNFT,
          variables: {
            userID: userInfo?.userID,
            collectionID: nft?.collectionID,
            tokenID: nft?.tokenID,
            reason: reasons[reportReason].name,
          },
        })
        .then((result) => {
          setReportModal(false);
          setShowSnack("Asset Reported!");
          setTimeout(() => {
            setShowSnack("");
          }, 3000);
          setLoader(false);
        })
        .catch((e) => {
          setLoader(false);
        });
    }
  };

  const handleBurn = () => {
    if (router?.query?.id) {
      client
        .mutate({
          mutation: burnNFT,
          variables: {
            id: router.query.id,
            userID: userInfo?.userID,
            isLand: LAND_ADDRESS === nft.collectionDetails.collectionID,
          },
        })
        .then((result) => {
          setBurnModal(false);
          setShowSnack("Burn Succeeded!");
          setTimeout(() => {
            setShowSnack("");
          }, 3000);
          setLoader(false);
        })
        .catch((e) => {
          setLoader(false);
        });
    }
  };

  const handleOwnedRedirect = () => {
    if (walletAddress === nft.ownerAddress || account === nft.ownerAddress) {
      router.push(`/profile/${nft.ownerAddress}`);
    } else if (userDetails?.isCreator) {
      router.push(`/creator/${nft.ownerAddress}`);
    } else {
      router.push(`/profile/${nft.ownerAddress}`);
    }
  };

  const bids_data = [
    {
      price: "3.48WETH",
      usd_price: "4,923.09",
      date: "21-01-2023",
      person: "4b90efa9ec1a22d0...",
    },
    {
      price: "3.48WETH",
      usd_price: "4,923.09",
      date: "21-01-2023",
      person: "4b90efa9ec1a22d0...",
    },

  ];


  async function handleBuyNFT(buyInfo) {
    const RpcProvider = new ethers.providers.JsonRpcProvider(
      POLYGON_MUMBAI_RPC
    );
    const { isOpenEdition } = nft
    const { listingId, nftId, price, quantity, sellerId } = buyInfo
    const userMetadata = JSON.parse(window.localStorage.getItem('metadata'))
    if (!isConnected) {
      setInfo({ type: 'error', message: "Please connect your wallet to make transactions" });
      setTimeout(() => {
        setInfo({});
      }, 3000)
      return
    }
    setTransactionStatus({
      status: 'progress',
      title: 'Transaction in progress',
      description: "Your transaction is being processed by the Polygon network. You will be notified when it has been completed."
    })
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
      let signer = provider.getSigner();
      // let signerAddress = await signer.getAddress();

      // let limitedTimeRead = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, RpcProvider); // 
      // let limitedTimeWrite = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, signer);
      // let limitedEditionRead = new ethers.Contract(LIMITED_EDITION, LimitedEditionABI, RpcProvider); // 
      // let limitedEditionWrite = new ethers.Contract(LIMITED_EDITION, LimitedEditionABI, signer);
      // 10
      // 0xc1e62d171b5a699c519df13fb894ed35a23036cfabe3701b2b5346e213f939d8
      // 10
      // 0xd5b14924648473bdb50bb5d9991885849d54b731acd51ced7d0074e923df1947

      // 0x0000000000000000000000000000000000000000000000000000000000000001

      // 0x0000000000000000000000000000000000000000000000000000000000000002

      // 0x178d8b32437ca6162a528046df79d3a95e04fdb42a8eb6f0116e68d7e9a8d84e
      let marketplaceContractRead = new ethers.Contract(MARKETPLACE, MARKETPLACE_ABI, RpcProvider);
      let marketplaceContractWrite = new ethers.Contract(MARKETPLACE, MARKETPLACE_ABI, signer);
      let iox = new ethers.Contract(IOX, IOXTOKEN_ABI, signer);
      const ether = ethers.utils.parseEther(price);
      const wei = ether.toString();
      let approved = await iox.approve(MARKETPLACE, wei)
      await approved.wait()
      const hash = await provider.getTransactionReceipt(approved.hash)
      console.log(hash)
      let buy = await marketplaceContractWrite.buyNFT(listingId)
      await buy.wait()
      const buyhash = await provider.getTransactionReceipt(buy.hash)
      client.mutate({
        mutation: CREATE_NFT_TRANSACTION,
        variables: {
          nftId: nftId,
          ownerId: userMetadata._id,
          price: price,
          hash: buyhash.transactionHash,
          buyerId: userMetadata._id,
          listingId: listingId,
          quantity: parseInt(quantity),
          sellerId: sellerId,
          transactionType: 'trade'
        }
      }).then(() => {
        setTransactionStatus({
          status: 'completed',
          title: 'Transaction completeted',
          description: "Your transaction is processed by the Polygon network."
        })
        setTimeout(() => {
          setTransactionStatus(INITIAL_STATUS)
          window.location.reload()
        }, 3000)
      })
    } catch (e) {
      console.log(e)
      setTransactionStatus({
        status: 'error',
        title: 'Transaction failed',
        description: "Your transaction is failed while processing in the Polygon network."
      })
      setTimeout(() => {
        setTransactionStatus(INITIAL_STATUS)
      }, 3000)
    }
  }

  async function handleCancelListing(listingInfo) {
    const { listingId, quantity, price } = listingInfo
    const userMetadata = JSON.parse(window.localStorage.getItem('metadata'))
    if (!isConnected) {
      setInfo({ type: 'error', message: "Please connect your wallet to make transactions" });
      setTimeout(() => {
        setInfo({});
      }, 3000)
      return
    }
    setTransactionStatus({
      status: 'progress',
      title: 'Transaction in progress',
      description: "Your transaction is being processed by the Polygon network. You will be notified when it has been completed."
    })
    const RpcProvider = new ethers.providers.JsonRpcProvider(
      POLYGON_MUMBAI_RPC
    );
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
      let signer = provider.getSigner();
      let marketplaceRead = new ethers.Contract(MARKETPLACE, MarketplaceABI, RpcProvider)
      // let listing = await marketplaceRead.callStatic.listings('3')
      // console.log('listing', listing)
      let marketplaceWrite = new ethers.Contract(MARKETPLACE, MarketplaceABI, signer);
      const cancelListing = await marketplaceWrite.cancelListing(listingId) // listingId
      await cancelListing.wait()
      const hash = await provider.getTransactionReceipt(cancelListing.hash)
      console.log(hash)
      setTransactionStatus({
        status: 'completed',
        title: 'Transaction completeted',
        description: "Your transaction is processed by the Polygon network."
      })
      client.mutate({
        mutation: CREATE_NFT_TRANSACTION,
        variables: {
          nftId: nft._id,
          ownerId: userMetadata._id,
          listingId: listingId,
          quantity: parseInt(quantity),
          price: price,
          hash: hash.transactionHash,
          buyerId: "",
          sellerId: userMetadata._id,
          transactionType: 'cancel'
        }
      }).then(() => {
        setTransactionStatus({
          status: 'completed',
          title: 'Transaction completeted',
          description: "Your transaction is processed by the Polygon network."
        })
        setTimeout(() => {
          setTransactionStatus(INITIAL_STATUS)
          window.location.reload()
        }, 3000)
      })
    } catch (error) {
      console.log(error)
      setTransactionStatus({
        status: 'error',
        title: 'Transaction failed',
        description: "Your transaction is failed while processing in the Polygon network."
      })
    }
  }

  function handleActionClick(asset) {
    if (userDetails?._id === asset?.ownerId) {
      handleCancelListing(asset)
    } else {
      handleBuyNFT(asset)
    }
  }
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    // window.location.href = window.location.href + "#" + tabs[newValue].path
    setTabIndex(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return nft && Object.keys(nft)?.length > 0 ? (
    <PageTransition>
      <div className="flex-1 max-w-screen-2xl text-white py-6">
        <Snackbar
          open={Object.keys(info)?.length > 0}
          autoHideDuration={6000}
          onClose={() => setInfo({})}
          anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          style={{ zIndex: 99999 }}
        >
          <Alert variant="filled" onClose={() => setInfo({})} severity={info.type} sx={{ width: '100%' }}>
            <AlertTitle>{info.type}</AlertTitle>
            {info.message}
          </Alert>
        </Snackbar>
        <Modal open={loadingModal} backdropClosable={false} closable={false}>
          <CircularProgress />
        </Modal>
        <Loader isLoading={loader} />
        <Head>
          <title>Inocyx | On the Moon Marketplace</title>
        </Head>
        <Modal open={transactionStatus.status.length > 0} backdropClosable={false} closable={false}>
          <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
            <LottieLoader loader_name={transactionStatus.status} loading={true} loop={true} />
            <h3 className="font-KronaOne text-xl self-center " >{transactionStatus.title}</h3>
            <span className="my-2 text-md opacity-60 self-center text-center" >{transactionStatus.description}</span>
          </div>
        </Modal>

        {/* <AssetidHero /> */}
        <div className="grid grid-cols-12 mt-0 md:mt-14 gap-6 w-full md:w-11/12 mx-auto relative no-scroll" >
          <AssetImage handleShareModel={handleShareModel} refreshPage={getNFTApi} handleBuy={handleBuyNFT} handleCancel={handleCancelListing} nft={nft} buyableAssets={buyableAssets} />
          <div className="md:sticky top-28 right-0 overflow-auto col-span-12 md:col-span-4 flex flex-col items-start md:w-full mx-auto w-11/12 gap-6">

            <div className="flex flex-col gap-3 items-start w-full" >
              <Link href={`/collections/${nft?.collectionDetails?.collectionID}`} className="flex flex-row items-center gap-2" >
                <Avatar className="w-6 h-6" src={nft?.collectionDetails?.imageURL} />
                <p className="font-sans text-md md:text-xl" >{nft?.collectionDetails?.name}</p>
                <TickCircle size="16px" variant="Bold" />
              </Link>
              <h1 className="md:text-3xl text-2xl font-sans font-semibold ">{nft?.itemName}</h1>
            </div>

            <div className="flex flex-row gap-10 w-full " >
              {nft?.creatorData?._id ? <div className="flex flex-row items-center gap-2">
                <Avatar src={nft?.creatorData?.profilePic} />
                <div className="flex flex-col items-start" >
                  <p className="text-sm font-sans opacity-60" >Creator</p>
                  <Link href={`/profile/${nft?.creatorData?._id}`} >
                    <p className="font-sans">{nft?.creatorData?.displayName}</p>
                  </Link>
                </div>
              </div> : null}

              {/* <div className="flex flex-row items-center gap-2">
                <Avatar />
                <div className="flex flex-col items-start" >
                  <p className="text-sm font-sans opacity-60" >Current owner</p>
                  <p className="font-sans">{truncateAddress('0xdafssfsdfasdfdsafsafas')}</p>
                </div>
              </div> */}
            </div>

            {minAsset?.price ? <div className="flex flex-col items-center p-3 md:p-6 border-[1px] border-white/20 w-full rounded-xl gap-4" >
              {<div className="flex font-sans flex-col items-start bg-white/5 w-full p-4 rounded-xl">
                <p className="opacity-60" >Price</p>
                <p className="font-bold font-sans text-2xl" >{minAsset?.price} IYX</p>
              </div>}
              <ButtonBase className="w-full rounded-full" onClick={() => handleActionClick(minAsset)} >
                <button className="w-full font-sans bg-primary p-4 rounded-full" >
                  {userDetails?._id === minAsset?.seller?._id ? "Cancel" : `Buy now for ${minAsset?.price} IYX`}
                </button>
              </ButtonBase>
              {userDetails?._id === minAsset?.seller?._id ? null : <ButtonBase disabled className="w-full rounded-full" >
                <button className="w-full font-sans border-[1px] border-white/10 p-4 rounded-full" >
                  Place a bid
                </button>
              </ButtonBase>}
            </div> : <div className="flex flex-col items-center p-6 border-[1px] border-white/20 w-full rounded-xl gap-4" >No Sales</div>}

          </div>
          <div className="md:col-span-8 col-span-12 w-11/12 md:mt-4 mx-auto flex flex-col items-center justify-center">
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
              {tabs.map((tab, index) => (
                <Tab label={tab.name}  {...a11yProps(index)} />
              ))}
            </Tabs>
            <TabPanel value={tabIndex} index={0} >
              <Overview nft={nft} />
            </TabPanel>
            <TabPanel value={tabIndex} index={1} >
              <Sales handleBuy={handleBuyNFT} handleCancel={handleCancelListing} nfts={buyableAssets} />
            </TabPanel>
            {/* <TabPanel value={tabIndex} index={2} >
              <Bids />
            </TabPanel> */}
            <TabPanel value={tabIndex} index={2} >
              <ActivityTable data={nft?.transactionHistory} />
            </TabPanel>

          </div>
        </div>

        <Modal
          open={sellModal && sellModal?.length > 0}
          handleClose={setSellModal}
        >
          <div className="z-50 flex w-1/3 flex-col items-center justify-center rounded-xl bg-gray-900 p-8 transition-all">
            <p className="py-4 font-sans text-2xl">Fix a amount</p>
            {sellModal === "sell" || sellModal === "update" ? (
              <input
                type="tel"
                placeholder="Price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
                className="w-full rounded-lg bg-white/10 p-4 text-white outline-none"
              />
            ) : sellModal !== "cancel" ? (
              <p className="w-full bg-white/20 p-3">
                Price: {sellModal === "mint" ? "0.01" : "0"}
              </p>
            ) : (
              <p>Are sure you wanna delist?</p>
            )}
            <div className="mt-4 flex w-full flex-row items-center justify-center">
              <Button
                variant="contained"
                className="m-2 w-full self-start bg-primary py-3 font-sans text-xl"
                onClick={() =>
                  sellModal === "sell"
                    ? price > 0 && handleSubmit(sellModal)
                    : handleSubmit(sellModal)
                }
              >
                {loader ? <CircularProgress className="h-24 w-24" /> : "Confirm"}
              </Button>
              <Button
                variant="contained"
                className="m-2 w-full self-end bg-white/30 py-3 font-sans text-white"
                onClick={() => setSellModal(!sellModal)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {addPropertyPopup ? (
          <div className="absolute top-0 z-50 flex h-[100vh] w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-black/40 ">
            <div className="flex w-1/4 flex-col items-center justify-center bg-black p-4">
              <p className="py-4  font-sans text-2xl">Add Property</p>
              <input
                type="text"
                placeholder="Property"
                value={addProperty}
                onChange={(e) => {
                  setAddProperty(e.target.value);
                }}
                className="w-full p-3 text-black outline-none"
              />
              <Button
                variant="contained"
                className="mt-2 w-1/2 self-start bg-primary py-3 font-sans text-xl"
                onClick={() => handleProperty(nft.id)}
              >
                {loader ? <CircularProgress color="white" /> : "Save Property"}
              </Button>
              <Button
                variant="contained"
                className="mt-2 w-full self-end bg-white/30 py-3 font-sans text-white"
                onClick={() => setAddPropertyPopup(!addPropertyPopup)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <></>
        )}

        <Modal open={shareModal} handleClose={setShareModal}>
          <div className="z-50 flex w-11/12 md:w-1/4 flex-col items-center justify-center rounded-xl bg-gradient-to-tr from-primary/10 to-secondary/10 bg-forground p-8 transition-all font-sans">
            <p className="mb-4 w-full border-b-2 border-white/10 p-2 text-lg font-bold">
              Share {nft.itemName}
            </p>
            <div className="mb-4 flex w-full flex-row items-center self-start">
              {nft?.assetFormat === "mp4" ||
                nft?.assetFormat === "mov" ||
                nft?.assetFormat === "webm" ? (
                <video
                  playsInline
                  preload="auto"
                  muted
                  autoPlay
                  // poster="/image_loader.gif"
                  width={500}
                  // height={800}
                  className="h-20 w-20 rounded-xl object-cover"
                >
                  <source
                    src={nft.itemImage}
                    type={`video/${nft?.assetFormat}`}
                  />
                </video>
              ) : (
                <Image
                  src={nft.itemImage}
                  blurDataURL="/dummyAvatar.png"
                  placeholder="blur"
                  width={100}
                  height={100}
                  alt="img"
                  className="h-20 rounded-xl w-20"
                />
              )}
              <div className="ml-4">
                <p className="text-2xl font-bold ">{nft?.itemName}</p>
                <p className="text-sm font-sans opacity-50 ">
                  by {truncateAddress(nft?.ownerAddress)}
                </p>
              </div>
            </div>
            <div className="my-2 flex w-1/2 flex-row items-center justify-evenly">
              <div
                className="mx-2 cursor-pointer rounded-lg bg-white/5 p-4 text-white hover:bg-primary hover:text-black"
                onClick={() => handleShare("facebook")}
              >
                <FacebookIcon />
              </div>
              <div
                className="mx-2 cursor-pointer rounded-lg bg-white/5 p-4 text-white hover:bg-primary hover:text-black"
                onClick={() => handleShare("twitter")}
              >
                <TwitterIcon />
              </div>
              <div
                className="mx-2 cursor-pointer rounded-lg bg-white/5 p-4 text-white hover:bg-primary hover:text-black"
                onClick={() => handleShare("whatsapp")}
              >
                <WhatsAppIcon />
              </div>
              <div
                className="mx-2 cursor-pointer rounded-lg bg-white/5 p-4 text-white hover:bg-primary hover:text-black"
                onClick={() => handleShare("linkedin")}
              >
                <LinkedInIcon />
              </div>
            </div>

            <div className="mt-4 flex w-full flex-row items-center justify-center">
              <div className="font-oswaldregular w-11/12 truncate rounded-lg bg-white/5 p-3 text-white">
                {window.location.href}
              </div>
              <CopyContent content="href" />
            </div>
          </div>
        </Modal>

        <Modal open={reportModal} handleClose={setReportModal}>
          <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
            <h3 className="font-KronaOne text-2xl self-start " >Report</h3>
            <span className="my-2 text-lg opacity-60" >Describe why you think this NFT should be removed from marketplace</span>
            <label className="self-start py-3 mt-4" htmlFor="reasons" >I think this collection is...</label>
            <DropDown
              id="reasons"
              title={reasons[reportReason].name}
              options={reasons}
              selected={reportReason}
              setSelected={setReportReason}
            />
            <Button
              className="mt-6 w-content self-start px-8 rounded-xl text-white btn-gradient p-4 hover:brightness-110"
              onClick={() => handleReport()}
            >
              Submit
            </Button>
          </div>
        </Modal>

        <Modal open={burnModal} handleClose={setBurnModal}>
          <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
            <h3 className="font-KronaOne text-2xl self-start " >Burn</h3>
            <span className="my-2 text-lg opacity-60 self-start" >Are you sure that you want to burn the asset?</span>
            <Button
              className="mt-6 w-content self-start px-8 rounded-xl text-white btn-gradient p-4 hover:brightness-110"
              onClick={() => burnNft()}
            >
              Yes, burn
            </Button>
          </div>
        </Modal>

        <Modal open={buyModal} handleClose={setBuyModal}>
          <div className="z-50 flex w-1/4 flex-col items-start  justify-center rounded-xl bg-gray-900 p-8 transition-all">
            <p className="mb-4 w-full border-b-2 border-white/10 p-2 text-lg font-bold">
              Buy {nft.itemName}
            </p>
            <img
              src={nft.itemImage}
              className="h-64 w-64 self-center"
              alt="image"
            />
            <p className="mt-6 self-center text-2xl font-bold">{nft.itemName}</p>
            <div className="mt-2 flex flex-row items-center justify-center self-center">
              <CurrencyBitcoin className=" text-2xl" />
              <p className="self-center text-3xl font-bold">
                {nft?.currentSale?.listPrice}
              </p>
            </div>
            <button
              className="mt-6 w-full rounded-xl bg-primary p-4 hover:brightness-110"
              onClick={() => buyNft()}
            >
              Buy
            </button>
          </div>
        </Modal>

        <Modal open={offerModal} handleClose={setOfferModal}>
          <div className="z-50 flex w-1/4 flex-col items-start  justify-center rounded-xl bg-gray-900 p-8 transition-all">
            <p className="mb-4 w-full border-b-2 border-white/10 p-2 text-lg font-bold">{`${truncateAddress(
              offer?.from
            )}'s Offer`}</p>
            <div className="flex flex-row items-start justify-start">
              <img
                src={nft.itemImage}
                className="h-16 w-16 self-center"
                alt="image"
              />
              <p className="ml-4 self-center text-lg font-bold">{nft.itemName}</p>
            </div>

            <div className="my-2 mx-auto mt-4 flex w-full flex-row items-center justify-between">
              <p className="text-lg">Offer</p>
              <p className="ml-6 self-center text-lg font-bold">
                {offer.price} Matic
              </p>
            </div>

            <div className="my-2 mx-auto flex w-full flex-row items-center justify-between">
              <div className="flex flex-col items-start">
                <p className="text-lg">Service Fee (percent%)</p>
                <p className="text-sm opacity-60 ">Supporting text</p>
              </div>
              <p className="ml-6 self-center text-lg font-bold">0.01 Matic</p>
            </div>

            <div className="my-2 mx-auto flex w-full flex-row items-center justify-between">
              <p className="text-lg">You will get</p>
              <p className="ml-6 self-center text-lg font-bold">
                {parseFloat(offer.price - 0.01).toFixed(2)} Matic
              </p>
            </div>
            <button className="mt-6 w-full rounded-xl bg-primary p-4 hover:brightness-110">
              Accept Offer
            </button>
          </div>
        </Modal>

      </div>
    </PageTransition>
  ) : (
    <Loader isLoading={true} description="Loading..." />
  );
}

export default NftDetails;
