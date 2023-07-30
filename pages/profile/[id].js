"use client"
/* eslint-disable react/jsx-curly-brace-presence */
import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  Box,
  Tab,
  Typography,
  Tabs,
  Link,
  IconButton,
  Snackbar,
  Switch,
  Alert,
  AlertTitle,
  Tooltip,
  TextField,
  ClickAwayListener,
  Button,
  ButtonBase,
  Chip,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { Twitter, Instagram, Share } from "@mui/icons-material"
import { Add, Edit, Global, Verify } from "iconsax-react";
import { gql } from "@apollo/client";
import Modal from "../../components/core/Modal";
import client from "../../apollo/apolloClient";
import Router, { useRouter } from "next/router";
import MyNFT from "../../components/profile/MyNFT";
import ForSale from "../../components/profile/ForSale";
import CreatorPanel from "../../components/profile/CreatorPanel";
import Activity from "../../components/profile/Activity";
import { Avatar } from "@mui/material";
import { ConnectKitButton } from "connectkit"
import {
  getUserDetails,
  GET_TRANSACTION_BY_USER,
  GET_TRANSACTION_HOLDING,
  GET_ACTIVITIES_BY_USER,
  GET_COLLECTIONS_BY_USER_ID,
} from "../../apollo/api/query";
import {
  applyForCreator,
  CREATE_NFT_TRANSACTION,
  generateHypervergeToken,
  UpdateKYC,
} from "../../apollo/api/mutations";
import CopyContent from "../../components/core/CopyContent";
import { truncateAddress } from "../../utility";
import Loader from "../../components/core/Loader";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../store/slices/authSlice";
import PageTransition from "../../components/core/PageTransition";
import { ethers } from "ethers";
import { MARKETPLACE, IOX } from "../../contracts/Addresses";
import MARKETPLACE_ABI from "../../contracts/InocyxMarketplace_ABI.json";
import IOXTOKEN_ABI from "../../contracts/InocyxToken_ABI.json"
import { LIMITED_EDITION, LIMITED_TIME } from "../../contracts/Addresses";
import LimitedEditionABI from "../../contracts/LimitedEditionNFT_ABI.json"
import LimitedTimeABI from "../../contracts/LimitedTimeNFT_ABI.json"
import USER_CREATED_ERC721_ABI from "../../contracts/ERC721.json"
import USER_CREATED_ERC1155_ABI from "../../contracts/ERC1155.json"
import LottieLoader from "../../components/core/LottieLoader";
import { POLYGON_MUMBAI_RPC, TRANSACTION_ENDPOINT } from "../../constants";
import Created from "../../components/profile/Created"
import Collections from "../../components/profile/Collections";
import SharePopover from "../../components/core/SharePopover";
import CreatedNFT from "../../components/profile/CreateNFT";

const INITIAL_STATUS = {
  status: '',
  title: '',
  description: ""
}
function Profile() {
  const [userInfo, setUser] = useState({});
  const [mynft, setMyNft] = useState([]);
  const [saleModal, setSaleModal] = useState({});
  const [selectedNft, setSelectedNFT] = useState({});
  const [info, setInfo] = useState({})
  const [applyCreator, setApplyCreator] = useState(false);
  // const [verifyModal, setVerifyModal] = useState(false);
  const [showChooseType, setShowChooseType] = useState(false);
  const [created, setCreated] = useState([]);
  const [forSale, setForSale] = useState([]);
  const [sellPrice, setSellPrice] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');
  const [activity, setActivity] = useState([]);
  const [collections, setCollections] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [loader, setLoader] = useState(false);
  const [isMyProfile, setisMyProfile] = useState(false);
  const currentUser = useSelector(selectAuthUser)
  // const [account, setAccount] = useState('');
  const [pan, setPan] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const [showSnack, setShowSnack] = useState("");
  const { isConnected, address } = useAccount();
  const account = address;
  const [transactionStatus, setTransactionStatus] = useState(INITIAL_STATUS);
  useEffect(() => {
    setLoader(true);
    const user = JSON.parse(localStorage.getItem('metadata'))
    setisMyProfile(user?._id === router.query.id)
    setValue(router.query.tab === 'created' ? 2 : 0)
    client.query({
      query: GET_TRANSACTION_HOLDING,
      variables: { userId: router?.query?.id }
    }).then(res => {
      let activities = res?.data?.getTransactionHoldingHistory
      const sales = activities?.filter(acty => acty?.list_quantity && acty?.list_quantity > 0)
      const collected = activities?.filter(acty => acty?.quantity > 0)
      setMyNft(collected)
      setForSale(sales)
    })
    client
      .query({
        query: getUserDetails,
        variables: { id: router?.query?.id, walletAddress: address, transactionType: "all" },
      })
      .then((res) => {
        if (res?.data?.getUserById) {
          setUser(res?.data?.getUserById);
          setCreated(res?.data?.getUserById?.createdNft)
          setLoader(false);
        }
      })
      .catch((e) => {
        // console.log(e);
      });
    client
      .query({
        query: GET_COLLECTIONS_BY_USER_ID,
        variables: { userId: router?.query?.id, name: "" }
      })
      .then((res) => {
        console.log(res?.data?.getCollectionsByUserId);
        setCollections(res?.data?.getCollectionsByUserId ?? []);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [id, account, router]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('metadata'))
    client.query({
      query: GET_ACTIVITIES_BY_USER,
      variables: { userId: router?.query?.id, transactionType: transactionType }
    }).then(res => {
      let activities = res?.data?.getActivitiesByUserId
      setActivity(activities)
    })
  }, [transactionType]);

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

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box className="py-4">
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  /// image, full name, pan_db_name, pan_number, liveness_selfie

  const handler = (HyperKycResult) => {
    try {
      if (
        HyperKycResult?.status === "auto_approved" ||
        HyperKycResult?.status === "needs_review"
      ) {
        client
          .mutate({
            mutation: UpdateKYC,
            variables: {
              id: userInfo?.id,
              success: true,
              status: HyperKycResult.status,
              kycDetails: JSON.stringify(HyperKycResult.details),
            },
          })
          .then(() => {
            client
              .query({
                query: getUserDetails,
                variables: { id: id, transactionType: "all" },
              })
              .then((res) => {
                if (res?.data?.getUser) {
                  setUser(res?.data?.getUser);
                  setShowSnack("Verified Successfully");
                  setTimeout(() => {
                    setShowSnack("");
                  }, 3000);
                }
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => { });
      } else {
        setShowSnack("Error while verifying");
        setTimeout(() => {
          setShowSnack("");
        }, 3000);
      }
    } catch (e) {
      setShowSnack("Error while verifying");
      setTimeout(() => {
        setShowSnack("");
      }, 3000);
    }
  };

  const handleKYC = async () => {
    try {
      if (window) {
        client
          .mutate({
            mutation: generateHypervergeToken,
          })
          .then((res) => {
            const hyperKycConfig = new window.HyperKycConfig(
              `${res.data.generateHypervergeToken.result}`,
              "FM_DBCheck",
              userInfo?.userID
            );

            window.HyperKYCModule.launch(hyperKycConfig, handler);
          });
      }
    } catch (e) {
      setShowSnack("Error while verifying");
      setTimeout(() => {
        setShowSnack("");
      }, 3000);
    }
  };


  async function handleSellNFT(nftMetadata) {
    const RpcProvider = new ethers.providers.JsonRpcProvider(
      POLYGON_MUMBAI_RPC
    );
    const { isOpenEdition, isUserCreated, nftType } = nftMetadata
    const userMetadata = JSON.parse(window.localStorage.getItem('metadata'))
    if (!isConnected) {
      setInfo({ type: 'error', message: "Please connect your wallet to make transactions" });
      setTimeout(() => {
        setInfo({});
      }, 3000)
      return
    }
    setSaleModal({})
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
      let signerAddress = await signer.getAddress();
      let limitedTimeRead = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, RpcProvider); // 
      let limitedTimeWrite = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, signer);
      let limitedEditionRead = new ethers.Contract(LIMITED_EDITION, LimitedEditionABI, RpcProvider); // 
      let limitedEditionWrite = new ethers.Contract(LIMITED_EDITION, LimitedEditionABI, signer);
      let currentReadContract = limitedEditionRead, currentWriteContract = limitedEditionWrite, currentContract = LIMITED_EDITION;

      if (isUserCreated) {
        let userContractRead = new ethers.Contract(nftMetadata.collectionaddress, nftType === 'erc721' ? USER_CREATED_ERC721_ABI : USER_CREATED_ERC1155_ABI, RpcProvider)
        let userContractWrite = new ethers.Contract(nftMetadata.collectionaddress, nftType === 'erc721' ? USER_CREATED_ERC721_ABI : USER_CREATED_ERC1155_ABI, signer)
        currentReadContract = userContractRead
        currentWriteContract = userContractWrite
        currentContract = nftMetadata.collectionaddress
      } else if (isOpenEdition) {
        currentReadContract = limitedTimeRead
        currentWriteContract = limitedTimeWrite
        currentContract = LIMITED_TIME
      }

      let marketplaceContractRead = new ethers.Contract(MARKETPLACE, MARKETPLACE_ABI, RpcProvider);
      let marketplaceContractWrite = new ethers.Contract(MARKETPLACE, MARKETPLACE_ABI, signer);
      const current_listingId = await marketplaceContractRead.callStatic.listingId()
      console.log(current_listingId, currentContract, signerAddress, currentReadContract, currentWriteContract)
      // let isApproved = await currentReadContract.callStatic.isApprovedForAll(signerAddress, MARKETPLACE)
      let iox = new ethers.Contract(IOX, IOXTOKEN_ABI, signer);
      // if (!isApproved) {
      if (nftType === 'erc1155') {
        let tx = await currentWriteContract.setApprovalForAll(MARKETPLACE, true);
        await tx.wait()
      } else if (nftType === 'erc721') {
        let tx = await currentWriteContract.approve(MARKETPLACE, nftMetadata.tokenID);
        await tx.wait()
      }
      // }
      const ether = ethers.utils.parseEther(sellPrice.toString()); // TODO
      const wei = ether.toString();
      let balance = await iox.callStatic.balanceOf(signerAddress)
      console.log(balance, wei, sellPrice, LIMITED_TIME, nftMetadata)
      // if (balance >= wei) {
      let listTicket = await marketplaceContractWrite.listNFT(currentContract, nftMetadata.tokenID, sellQuantity, wei)
      await listTicket.wait();
      const hash = await provider.getTransactionReceipt(listTicket.hash)
      const listingId = hash.logs?.[hash.logs.length - 1]?.topics?.[1]
      console.log('list', listingId, hash, current_listingId)
      client.mutate({
        mutation: CREATE_NFT_TRANSACTION,
        variables: {
          nftId: nftMetadata._id,
          ownerId: userMetadata._id,
          price: sellPrice,
          hash: hash.transactionHash,
          buyerId: '',
          listingId: (parseInt(current_listingId) + 1).toString(),
          quantity: parseInt(sellQuantity),
          sellerId: userMetadata._id,
          transactionType: 'list'
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
      // } else {
      //   setTransactionStatus({
      //     status: 'error',
      //     title: 'Not Enough Balance',
      //     description: "Your transaction is failed while processing in the Polygon network because of not enough IYX balance."
      //   })
      //   setTimeout(() => {
      //     setTransactionStatus(INITIAL_STATUS)
      //   }, 3000)
      // }
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
      // setIsTransactionProcessing(false)
    }
  }

  return (
    <PageTransition>
      <Loader isLoading={loader} />
      <Head>
        <title>Inocyx | Moon Marketplace</title>
        <script
          async
          src="https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/hyperverge-web-sdk@5.2.4/src/sdk.min.js"
        ></script>
      </Head>
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
      <Modal open={transactionStatus.status.length > 0} backdropClosable={false} closable={false}>
        <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
          <LottieLoader loader_name={transactionStatus.status} loading={true} loop={true} />
          <h3 className="font-KronaOne text-xl self-center text-center " >{transactionStatus.title}</h3>
          <span className="my-2 text-md opacity-60 self-center text-center" >{transactionStatus.description}</span>
        </div>
      </Modal>
      {/* <img
        src={userInfo?.banner ?? '/dummyBanner.png'}
        alt="Backgroud"
        className=" fixed top-14 left-0 z-0 h-36 w-full md:h-48 object-cover"
        style={{ zIndex: -10 }}
      /> */}
      {/* <Snackbar
        open={showSnack?.length > 0}
        autoHideDuration={6000}
        message={showSnack}
      /> */}

      <div className="relative -mt-6">
        <Image
          src={userInfo?.banner ?? '/dummyBanner.png'}
          alt="Your Alt Text"
          width={1000}
          height={200}
          placeholder="blur"
          blurDataURL="/dummyBanner.png"
          className="w-full h-[100px] md:h-[200px] object-cover  "
        />
        <div className="absolute z-10  inset-0 bg-gradient-to-t from-forground to-transparent"></div>
      </div>

      <div className="relative text-white z-50  font-sans max-w-screen-2xl mx-auto -mt-10 flex flex-col md:flex-row gap-4 justify-between w-11/12">
        <div className="flex flex-row items-center md:justify-center justify-start gap-4">
          <Avatar
            src={userInfo?.profilePic}
            className="border-[1px] border-white md:w-24 md:h-24 w-20 h-20"
          />
          <div className="flex flex-col items-start gap-4 w-full mx-auto ">
            <div className="flex flex-col items-start gap-2 justify-center">
              <span className="font-sans font-bold text-xl md:text-5xl mt-2">
                {userInfo?.displayName}
              </span>
              {!isMyProfile ?
                <div className="flex flex-row items-center gap-6" >
                  <p className="font-sans flex flex-row gap-1">
                    {userInfo?.shortBio}
                  </p>
                </div> :
                account ? <div className="flex flex-row items-center gap-6" >
                  <p className="font-sans flex flex-row gap-1">
                    <span className="opacity-60" >Address</span>
                    <Link target="_blank" href={`${TRANSACTION_ENDPOINT}/address/${account}`} className="hover:text-primary" >
                      {truncateAddress(account)}
                    </Link>
                  </p>
                </div> :
                  <ConnectKitButton.Custom>
                    {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
                      return <ButtonBase className="rounded-full" onClick={show} >
                        <Chip clickable label="Connect wallet" />
                      </ButtonBase>
                    }}
                  </ConnectKitButton.Custom>
              }
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 max-w-min overflow-x-auto no-scroll" >
          {userInfo?.isCreator === false ? <ButtonBase className="rounded-full" onClick={() => setApplyCreator(true)}>
            <div className="flex flex-row items-center gap-3 border-[1px] border-white/40 px-4 p-2 rounded-full text-white">
              <Verify size={18} />
              <p className="text-sm">Creator</p>
            </div>
          </ButtonBase> : <ButtonBase className="rounded-full" onClick={() => setShowChooseType(true)} >
            <div className="flex flex-row items-center gap-2 btn-gradient p-2 px-4 rounded-full text-white font-medium hover:brightness-90">
              <Add size={20} />
              <p className="text-sm">Create</p>
            </div>
          </ButtonBase>
          }
          {isMyProfile ? <div className="flex flex-row items-center gap-2">
            <Link href="/edit-profile">
              <ButtonBase className="rounded-full min-w-max">
                <div className="flex flex-row items-center gap-3 border-[1px] border-white/40 px-4 p-2 rounded-full text-white">
                  <Edit size={16} />
                  <p className="text-sm">Edit profile</p>
                </div>
              </ButtonBase>
            </Link>
            <ButtonBase className="rounded-full min-w-max" onClick={handleKYC}>
              <div className="flex flex-row items-center gap-3 border-[1px] border-white/40 px-4 p-2 rounded-full text-white">
                <Verify size={18} />
                <p className="text-sm">Verify KYC</p>
              </div>
            </ButtonBase>
          </div> : null}
          <SharePopover label="Share" icon={<Share />} >
            <Link href={userInfo?.twitter} target="_blank">
              <IconButton>
                <Twitter />
              </IconButton>
            </Link>
            <Link href={userInfo?.instagram} target="_blank">
              <IconButton>
                <Instagram />
              </IconButton>
            </Link>
            <Link href={userInfo?.website} target="_blank">
              <IconButton>
                <Global />
              </IconButton>
            </Link>
          </SharePopover>
        </div>
      </div>
      {/* </div> */}

      <div className="z-50 mx-auto max-w-screen-2xl font-sans text-white w-11/12">
        <Tabs
          variant="scrollable"
          value={value}
          style={{ marginTop: 20 }}
          onChange={handleChange}
          className="mt-4"
        >
          <Tab
            {...a11yProps(0)}
            label={`Collected (${mynft?.length ?? 0})`}
          />
          <Tab
            {...a11yProps(1)}
            label={`For Sale (${forSale?.length ?? 0})`}
          />
          <Tab
            {...a11yProps(2)}
            label={`Created (${created?.length ?? 0})`}
          />
          <Tab
            {...a11yProps(3)}
            label={`Collections (${collections?.length ?? 0})`}
          />
          <Tab
            {...a11yProps(4)}
            label="Activity"
          />
        </Tabs>

        <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
          <TabPanel value={value} index={0}>
            <MyNFT isMyProfile={isMyProfile} loading={loader} setSaleModal={setSaleModal} data={mynft} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ForSale loading={loader} data={forSale} click={setSelectedNFT} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Created loading={loader} data={created} setSaleModal={setSaleModal} isMyProfile={isMyProfile} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Collections loading={loader} data={collections} />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Activity loading={loader} data={activity} transactionType={transactionType} setTransactionType={setTransactionType} />
          </TabPanel>

        </SwipeableViews>
      </div>

      <Modal open={applyCreator} handleClose={setApplyCreator}>
        <CreatorPanel assets={forSale} />
      </Modal>

      <Modal open={Object.keys(saleModal).length > 0} handleClose={() => setSaleModal({})}>
        <div className="z-50 flex w-11/12 md:w-3/5 max-w-screen-md flex-col items-start  justify-center rounded-xl bg-background p-8 transition-all">
          <p className="mb-4 w-full border-b-2 border-white/10 p-2 text-lg font-bold">
            Selling Price
          </p>
          <div className="flex flex-row items-start justify-start">
            <img
              src={saleModal?.nftData?.itemImage}
              className="h-16 w-16 self-center"
              alt="image"
            />
            <p className="ml-4 self-center text-lg font-bold">{saleModal?.nftData?.itemName}</p>
          </div>

          <div className="my-2 mx-auto mt-4 flex w-full flex-col items-center justify-between">
            <TextField
              label="Price"
              variant="outlined"
              type="number"
              value={sellPrice}
              inputMode="number"
              className="w-full my-6"
              onChange={(e) => setSellPrice(e.target.value)}
            />
            <div className="w-full mb-6">
              <TextField
                label={`Quantity (${saleModal?.quantity})`}
                variant="outlined"
                type="number"
                value={sellQuantity}
                InputProps={{ inputProps: { min: 0, max: saleModal?.quantity } }}
                inputMode="number"
                className="w-full mb-1"
                onChange={(e) => setSellQuantity(e.target.value)}
              />
              {sellQuantity > saleModal?.quantity && <p className="font-spaceMonoregular mr-4 mt-0 self-start text-xs tracking-wide text-red-600">
                <span>Max available Quantity is {saleModal?.quantity}</span>
              </p>}
            </div>
            <Button
              disabled={parseInt(sellPrice) <= 0 || parseInt(sellQuantity) > parseInt(saleModal?.quantity)}
              className=" w-content self-start px-8 rounded-xl text-white btn-gradient p-3 hover:brightness-110"
              onClick={() => handleSellNFT(saleModal?.nftData)}
            >
              Submit
            </Button>
          </div>
          {/* 
          <div className="my-2 mx-auto flex w-full flex-row items-center justify-between">
            <p className="text-lg">Conduct Auction</p>
            <Switch defaultChecked />
          </div>

          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-start">
              <p className="text-lg">Start Date</p>
              <input className="w-full p-4" type="text" placeholder="date" />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-lg">End Date</p>
              <input className="w-full p-4" type="text" placeholder="date" />
            </div>
          </div> */}
          {/* 
          <div className="my-2 mx-auto flex w-full flex-row items-center justify-between">
            <div className="flex flex-col items-start">
              <p className="text-lg">Service Fee (percent%)</p>
              <p className="text-sm opacity-60 ">Supporting text</p>
            </div>
            <p className="ml-6 self-center text-lg font-bold">0.01 Matic</p>
          </div>

          <div className="my-2 mx-auto flex w-full flex-row items-center justify-between">
            <p className="text-lg">You earnings</p>
            <p className="ml-6 self-center text-lg font-bold">
            </p>
          </div> */}
        </div>
      </Modal>
      <Modal open={showChooseType} backdropClosable={false} handleClose={() => setShowChooseType(false)}>
        <CreatedNFT />
      </Modal>

    </PageTransition>
  );
}

export default Profile;
