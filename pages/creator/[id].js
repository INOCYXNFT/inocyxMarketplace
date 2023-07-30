"use client"
/* eslint-disable react/jsx-curly-brace-presence */
import React, { useEffect, useState } from "react";
import Head from "next/head";
import {
  Box,
  Tab,
  Typography,
  Switch,
  Rating,
  Snackbar,
  Alert,
  ButtonBase,
  Tabs,
  Button,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import Modal from "../../components/core/Modal";
import client from "../../apollo/apolloClient";
import Router, { useRouter } from "next/router";
import SearchBox from "../../components/core/SearchBox";
import {
  WalletOutlined,
  FacebookOutlined,
  Twitter,
  Star,
} from "@mui/icons-material";
import Owned from "../../components/creator/Owned";
import Created from "../../components/creator/Created";
import { getCreatedNFTsByWallet, getUserDetails } from "../../apollo/api/query";
import CopyContent from "../../components/core/CopyContent";
import { followArtist, rateArtist } from "../../apollo/api/mutations";
import { truncateAddress } from "../../utility";
import Loader from "../../components/core/Loader";
import { useAccount } from "wagmi";
import Image from "next/image";
import { Avatar } from "@mui/material";
import PageTransition from "../../components/core/PageTransition";

function Profile() {
  const [userInfo, setUser] = useState({});
  const [saleModal, setSaleModal] = useState(false);
  const [selectedNft, setSelectedNFT] = useState({});
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState([]);
  const [rating, setRating] = useState(0);
  const [ratingModal, setRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [myInfo, setMyInfo] = useState("");
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [userRated, setUserRated] = useState({});
  const { id } = router.query;
  const { address } = useAccount();
  const account = address;

  useEffect(() => {
    if (id) {
      setLoader(true);
      client
        .query({
          query: getUserDetails,
          variables: { walletAddress: id },
        })
        .then((res) => {
          if (res?.data?.getUser) {
            setUser(res?.data?.getUser);
          }
        })
        .catch((e) => {
          // console.log(e);
        });
      client
        .query({
          query: getUserDetails,
          variables: { walletAddress: account },
        })
        .then((res) => {
          setMyInfo(res?.data?.getUser);
          const currentUser = userInfo?.artistStats?.filter(
            (e) => e?.userID === res?.data?.getUser?.userID
          );
          setUserRated(currentUser?.[0]);
        })
        .catch((e) => {
          // console.log(e);
        });

      client
        .query({
          query: getCreatedNFTsByWallet,
          variables: { walletAddress: id },
        })
        .then((res) => {
          if (res?.data?.getCreatedNFTsByWallet) {
            setCreated(res?.data?.getCreatedNFTsByWallet);
            setLoader(false);
          }
        })
        .catch((e) => {
          setLoader(false);
        });
    }
  }, [
    router
  ]);

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

  // getUser
  // owned - getAllNFTsByWallet
  // created - getCreatedNFTsByWallet
  // follow - followArtist
  // rate - rateArtist

  const handleFollow = () => {
    client
      .mutate({
        mutation: followArtist,
        variables: {
          followerUserID: myInfo?.userID,
          followingUserID: userInfo?.userID,
        },
      })
      .then((res) => {
        setUser(res?.data?.followArtist);
        const doc = res?.data?.artistStats?.filter(
          (e) => e?.userID === myInfo?.userID
        )[0];
        if (doc && doc.isFollower) {
          setShowSnack("Followed");
        } else setShowSnack("Unfollowed");
        setTimeout(() => {
          setShowSnack("");
        }, 3000);
      })
      .catch((e) => {
        setRatingModal(false);
      });
  };

  const handleRating = () => {
    client
      .mutate({
        mutation: rateArtist,
        variables: {
          fromUserID: myInfo?.userID,
          artistUserID: userInfo?.userID,
          rating: userRating,
        },
      })
      .then((res) => {
        setUser(res.data?.rateArtist);
        setShowSnack("Rated");
        setRatingModal(false);
        setTimeout(() => {
          setShowSnack("");
        }, 3000);
      })
      .catch((e) => {
        setRatingModal(false);
      });
  };

  const EmptyRatingIcon = (props) => {
    return (
      <svg
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M29.0365 5.19003L33.1431 13.4034C33.7031 14.5467 35.1965 15.6434 36.4565 15.8534L43.8998 17.09C48.6598 17.8834 49.7798 21.3367 46.3498 24.7434L40.5631 30.53C39.5831 31.51 39.0465 33.4 39.3498 34.7534L41.0065 41.9167C42.3131 47.5867 39.3031 49.78 34.2865 46.8167L27.3098 42.6867C26.0498 41.94 23.9731 41.94 22.6898 42.6867L15.7131 46.8167C10.7198 49.78 7.68645 47.5634 8.99312 41.9167L10.6498 34.7534C10.9531 33.4 10.4165 31.51 9.43645 30.53L3.64979 24.7434C0.243121 21.3367 1.33979 17.8834 6.09979 17.09L13.5431 15.8534C14.7798 15.6434 16.2731 14.5467 16.8331 13.4034L20.9398 5.19003C23.1798 0.733368 26.8198 0.733368 29.0365 5.19003Z"
          stroke="#FFAF2B"
          stroke-width="2.625"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  };
  const RatingIcon = (props) => {
    return (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.39414 33.3334C9.65081 32.1901 9.18414 30.5567 8.36748 29.7401L2.69748 24.0701C0.924143 22.2967 0.224144 20.4067 0.737477 18.7734C1.27414 17.1401 2.93081 16.0201 5.40414 15.6001L12.6841 14.3867C13.7341 14.2001 15.0175 13.2667 15.5075 12.3101L19.5208 4.26008C20.6875 1.95008 22.2741 0.666748 24.0008 0.666748C25.7275 0.666748 27.3141 1.95008 28.4808 4.26008L32.4941 12.3101C32.7975 12.9167 33.4275 13.5001 34.1041 13.8967L8.97414 39.0267C8.64748 39.3534 8.08748 39.0501 8.18081 38.5834L9.39414 33.3334ZM39.6341 29.7447C38.7941 30.5847 38.3275 32.1947 38.6075 33.3381L40.2175 40.3614C40.8941 43.2781 40.4741 45.4714 39.0275 46.5214C38.413 46.9509 37.6769 47.1717 36.9275 47.1514C35.7375 47.1514 34.3375 46.7081 32.7975 45.7981L25.9608 41.7381C24.8875 41.1081 23.1141 41.1081 22.0408 41.7381L15.2041 45.7981C12.6141 47.3147 10.3975 47.5714 8.97414 46.5214C8.43748 46.1247 8.04081 45.5881 7.78414 44.8881L36.1575 16.5147C37.2308 15.4414 38.7475 14.9514 40.2175 15.2081L42.5741 15.6047C45.0475 16.0247 46.7041 17.1447 47.2408 18.7781C47.7541 20.4114 47.0541 22.3014 45.2808 24.0747L39.6341 29.7447Z"
          fill="#FFAF2B"
        />
      </svg>
    );
  };
  return loader ? <Loader isLoading={loader} /> : (
    <PageTransition>
      <Head>
        <title>Inocyx | Moon Marketplace</title>
      </Head>

      {/* <Snackbar
        open={showSnack?.length > 0}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        autoHideDuration={6000}
        message={showSnack}
      >
        <Alert
          severity="success"
          sx={{ width: "100%", backgroundColor: "green" }}
        >
          {showSnack}
        </Alert>
      </Snackbar> */}

      {/* <Image
        src={userInfo?.banner ?? "/dummyBanner.png"}
        alt="Backgroud"
        className=" fixed top-14 left-0 z-0 h-[400px] w-full object-cover "
        style={{ zIndex: -10 }}
        width={100}
        height={100}
      /> */}

      <div className="relative ">
        <Image
          src="/profile_bg.svg"
          alt="Your Alt Text"
          width={100}
          height={100}
          className="w-full h-[200px] object-cover  "
        />
        <div className="absolute z-10  inset-0 bg-gradient-to-t from-forground to-transparent"></div>
      </div>

      <div className="relative z-50 mx-auto w-11/12 text-white  ">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="flex flex-row gap-6 items-center ">
            {/* <Image
          src={userInfo?.profilePic ?? "/dummyAvatar.png"}
          alt="profile"
          className="h-28 w-28 object-cover"
          width={100}
          height={100}
        /> */}
            <div className="">
              <div className="p-2 bg-gradient-to-r from-[#06D1F8] to-[#DE179E] rounded-full -mt-44">
                <Avatar src="/creator_profile.svg" className="w-24 h-24  " />
              </div>
            </div>

            <div className="flex flex-row items-start">
              <div className="flex w-full flex-col items-start justify-between md:flex-row -mt-10 ">
                <div className="flex flex-col items-start gap-4">
                  <div className="flex flex-row items-end justify-end">
                    <div className="mt-2 text-4xl font-normal font-KronaOne">
                      <div className="flex flex-row gap-3 items-center">
                        {userInfo?.displayName}{" "}
                        <span className="mx-2">
                          <Image
                            src="/tickcircle.svg"
                            alt="itemImage"
                            width={24}
                            height={24}
                          />
                        </span>
                      </div>
                    </div>
                    {id?.toLowerCase() === account?.toLowerCase() ? (
                      <span className="text-md ml-2 font-sans opacity-60">
                        (You)
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="mr-4 flex flex-row items-center">
                      <span className="ml-1 text-center text-md text-[#EF5DA8] font-mulish font-semibold">
                        @{truncateAddress(router.query.id)}
                      </span>
                    </div>
                    {userInfo?.ratings ? (
                      <div className="flex flex-row items-center">
                        <Star className="text-md " />
                        <span className="ml-1 text-center text-sm text-white">
                          {userInfo?.ratings}
                        </span>
                      </div>
                    ) : (
                      <></>
                    )}
                    {userInfo?.totalFollowers ? (
                      <span className="ml-1 text-center text-sm opacity-60">
                        {userInfo?.totalFollowers} followers
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className=" ml-2">
                    <p className="text-left text-lg font-mulish font-normal w-24 truncate ">
                      {userInfo?.shortBio}
                    </p>
                  </div>

                  <div className="flex flex-row items-center ml-2">
                    {!(id?.toLowerCase() === account?.toLowerCase()) &&
                      userRated &&
                      Object.keys(userRated)?.length ? (
                      <button
                        onClick={() => handleFollow()}
                        className="mr-1 rounded-lg bg-white/10 px-4 py-2 font-sans text-sm transition-all hover:bg-white/20"
                      >
                        {userRated?.isFollower ? "Following" : "Follow"}
                      </button>
                    ) : !(id?.toLowerCase() === account?.toLowerCase()) ? (
                      <button
                        onClick={() => handleFollow()}
                        className="mr-1 text-lg font-semibold bg-[#29B3EA] rounded-md text-white px-6 py-3 font-inter text-sm transition-all hover:bg-white/20"
                      >
                        Follow
                      </button>
                    ) : (
                      <></>
                    )}
                    {/* {!(id?.toLowerCase() === account?.toLowerCase()) ? (
              <button
                onClick={() => setRatingModal(true)}
                className="mr-1 rounded-lg bg-white/10 px-4 py-2 font-sans text-sm transition-all hover:bg-white/20"
              >
                {userRated && Object.keys(userRated)?.length
                  ? `Rated: ${userRated.ratings}`
                  : "Rate"}
              </button>
            ) : (
              <></>
            )} */}
                    {userInfo?.twitter ? (
                      <a
                        href={`https://twitter.com/${userInfo?.twitter}`}
                        className="mx-1 rounded-lg  px-4 py-2 font-sans text-sm transition-all "
                      >
                        <Twitter />
                      </a>
                    ) : (
                      <></>
                    )}
                    {/* {userInfo?.facebook ? (
              <a
                href={`https://twitter.com/${userInfo?.facebook}`}
                className="mx-1 rounded-lg bg-white/10 px-4 py-2 font-sans text-sm transition-all hover:bg-white/20"
              >
                <FacebookOutlined />
              </a>
            ) : (
              <></>
            )} */}
                    {/* <CopyContent content="href" /> */}
                  </div>

                  <div className="flex flex-row items-center gap-3 mt-2 ml-2">
                    <div className="flex flex-col bg-transparent border-[1px] border-white/40 px-8 py-4 rounded-md">
                      <span className="font-inter font-normal">Followers</span>
                      <div className="flex flex-row items-center gap-1">
                        <span className="font-inter font-semibold">3</span>
                      </div>
                    </div>
                    <div className="flex flex-col bg-transparent border-[1px] border-white/40 px-8 py-4 rounded-md">
                      <span className="font-inter font-normal">Ratings</span>
                      <div className="flex flex-row items-center gap-1">
                        <span className="font-inter font-semibold">1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 -mt-6">
            <ButtonBase className='rounded-full'>
              <div className='cursor-pointer border-2 rounded-full border-secondary/5 hover:border-secondary/10 ' >
                <Image
                  src="/export.svg"
                  width={24}
                  height={24}
                  className="w-12 rounded-full bg-[#080702]/50 p-3"
                />
              </div>
            </ButtonBase>
            <ButtonBase className='rounded-full' onClick={() => setRatingModal(true)}  >
              <div className='cursor-pointer border-2 rounded-full border-secondary/5 hover:border-secondary/10 '>
                <Image
                  src="/more.svg"
                  width={24}
                  height={24}
                  className="w-12  rounded-full bg-[#080702]/50 p-3"
                />
              </div>
            </ButtonBase>
          </div>
        </div>

        <div >
          <Tabs
            value={value}
            style={{ marginTop: 20 }}
            onChange={handleChange}
            className="mt-4 "
          >
            <Tab
              {...a11yProps(0)}
              className="text-md px-8 py-4 capitalize"
              label={`Created`}
            />
            <Tab
              className="text-md px-8 py-4 capitalize"
              {...a11yProps(1)}
              label="Owned"
            />
          </Tabs>
          {/*
          <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
            <TabPanel value={value} index={0}>
              <Created assets={created} />
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Owned assets={userInfo?.allNFTs} />
            </TabPanel>
          </SwipeableViews>
        */}
        </div>

        <Modal open={ratingModal} handleClose={setRatingModal}>
          <div className="flex flex-col items-start justify-start bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
            <h3 className="font-KronaOne text-2xl self-start " >Rate the artist {userInfo.displayName}</h3>
            <span className="my-2 text-lg opacity-60 self-start" >Are you sure that you want to burn the asset?</span>

            <div className="py-3 s">
              {/* <Rating
                name="simple-controlled"
                value={userRating}
                size="large"
                onChange={(event, newValue) => {
                  setUserRating(newValue);
                }}
              /> */}
              <Rating
                name="simple-controlled"
                icon={<RatingIcon />}
                value={userRating}
                emptyIcon={<EmptyRatingIcon />}
                onChange={(event, newValue) => {
                  setUserRating(newValue);
                }}
              />
              {/* <Image src="/rating_icon.svg"
            width={100}
            height={100}
            value={userRating}
            className="w-12 h-12 objcect-cover"
            onChange={(event, newValue) => {
              setUserRating(newValue);
            }}
            /> */}
            </div>

            <Button
              className="mt-6 w-content px-12 rounded-xl btn-gradient p-4 hover:brightness-110 text-white"
              onClick={() => handleRating()}
            >
              Submit
            </Button>
          </div>
        </Modal>

        <Modal open={saleModal} handleClose={setSaleModal}>
          <div className="z-50 flex w-1/4 flex-col items-start  justify-center rounded-xl bg-gray-900 p-8 transition-all">
            <p className="mb-4 w-full border-b-2 border-white/10 p-2 text-lg font-bold">
              Selling Price
            </p>
            <div className="flex flex-row items-start justify-start">
              <img
                src="https://images.unsplash.com/photo-1662581872277-0fd0bf3ae8f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=986&q=80"
                className="h-16 w-16 self-center"
                alt="image"
              />
              <p className="ml-4 self-center text-lg font-bold">Inocyx</p>
            </div>

            <div className="my-2 mx-auto mt-4 flex w-full flex-row items-center justify-between">
              <input className="w-full p-4" type="text" placeholder="Price" />
            </div>

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
            </div>

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
                {/* {parseFloat(offer.price - 0.01).toFixed(2)} Matic */}
              </p>
            </div>
            <button className="mt-6 w-full rounded-xl bg-primary p-4 hover:brightness-110">
              Place Offer
            </button>
          </div>
        </Modal>


      </div>
    </PageTransition>
  )
}

export default Profile;
