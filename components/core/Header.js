"use client"
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Router from "next/router";
import { Button, ButtonBase, IconButton, Tab, Tabs, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Disconnect from "@mui/icons-material/PowerSettingsNew";
import { AccountBalanceSharp, AccountCircle, Close, CloseOutlined, Co2Sharp, CookieSharp, DiscountRounded, Map, Menu, Search } from "@mui/icons-material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useAccount, useDisconnect } from "wagmi";
import client from "../../apollo/apolloClient";
import Link from "next/link";
import { memo } from "react";
import SearchBox from "../core/SearchBox";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { GET_USER_BY_WALLET_ADDRESS, getUserDetails, globalSearch } from "../../apollo/api/query";
import Afterconnect from "./Afterconnect";
import Beforeconnect from "./Beforeconnect";
import { truncateAddress } from "../../utility";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import CopyContent from "./CopyContent";
import Modal from "./Modal";
import { AccountBalanceRounded } from "@mui/icons-material";
import { AccountBalanceWalletRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../store/slices/authSlice";
import { setInfo } from "../../store/slices/utilSlice";
import { UPDATE_WALLET_ADDRESS } from "../../apollo/api/mutations";
import { motion } from "framer-motion"
import { CloseCircle, HambergerMenu, MenuBoard, SearchNormal } from "iconsax-react";
import { userInfo } from "os";

function WalletHandle({ userInfo }) {
  const [user, setUser] = useState({});
  const { address, isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()
  useEffect(() => {
    const metadata = JSON.parse(localStorage.getItem("metadata"));
    setUser(metadata);
  }, [])

  // useEffect(() => {
  //   if (isConnected) {
  //     dispatch(setInfo({ type: "success", message: "Wallect connect successfully" }));
  //     setTimeout(() => {
  //       dispatch(setInfo({}));
  //     }, 4000)
  //   }
  // }, [])
  // console.log(userInfo)
  const logoutUser = () => {
    disconnectAsync();
    localStorage.clear();
    Router.push("/").then(() => {
      Router.reload();
    });
  };

  return (
    <div className="w-1/4 absolute top-22 right-10 flex flex-col items-center rounded-b-xl overflow-hidden shadow-2xl justify-center z-50 rounded-xl ">
      <ButtonBase
        className="flex flex-row items-center px-6 py-4 bg-background border-white/10 w-full justify-between hover:brightness-200 cursor-pointer "
        onClick={() => {
          Router.push(`/profile/${user._id}`);
        }}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Image
              src={userInfo?.profilePic ?? "/dummyAvatar.png"}
              alt="profile"
              width={100}
              height={100}
              className="w-12 h-12 overflow-hidden rounded-full border-[1px] border-white/40"
            />

            <div>
              <div className="flex flex-col">
                <span className="font-inter ml-2 font-normal text-xl self-start">
                  {/* {userDetails?.displayName} */}
                  {user.displayName}
                </span>
                <span className="font-inter font-normal ml-2 text-[12px] opacity-60">
                  {/* {userDetails?.displayName} */}
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ButtonBase>

      {/* After Wallet Connect */}
      {/* <Afterconnect account="skdadmfkldfm" /> */}
      {/* Before Wallet Connect */}
      {isConnected ? <Afterconnect account={address} /> : <Beforeconnect />}
      <Link className="w-full" href={`/profile/${user._id}`}>
        <ButtonBase className="flex flex-row items-center px-6 py-4  bg-background  w-full justify-start hover:brightness-200 cursor-pointer">
          <div className="flex flex-col gap-6">
            <span className="font-inter ml-2 text-md font-medium">
              My NFT's
            </span>
          </div>
        </ButtonBase>
      </Link>
      <Link className="w-full" href={`/profile/${user._id}`}>
        <ButtonBase className="flex flex-row items-center px-6 py-4 border-b-[1px] bg-background border-white/10 w-full justify-start hover:brightness-200 cursor-pointer">
          <div className="flex items-start">
            <span className="font-inter ml-2 text-md font-medium">
              Verify your KYC
            </span>
          </div>

          <div className="flex items-end">
            {" "}
            <Image
              src="/pending.svg"
              className="w-8 h-8"
              alt="profile"
              width={100}
              height={100}
            />
          </div>
        </ButtonBase>
      </Link>
      <ButtonBase className="flex flex-row items-center px-6 py-4 border-b-[1px] bg-background border-white/10 w-full justify-start hover:brightness-200 cursor-pointer" onClick={logoutUser}>
        <div className="flex flex-col gap-6">
          <span className="font-inter ml-2 text-md font-medium">Logout</span>
        </div>
      </ButtonBase>
    </div>
  );
}

function BottomDrawer(userDetails) {
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const [user, setUser] = useState({});
  const { disconnectAsync } = useDisconnect()
  const { isConnected, address, connector } = useAccount()
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const logoutUser = () => {
    disconnectAsync();
    localStorage.clear();
    Router.push("/").then(() => {
      Router.reload();
    });
  };

  useEffect(() => {
    const metadata = JSON.parse(localStorage.getItem("metadata"));
    setUser(metadata);
  }, [])

  useEffect(() => {
    connector?.addListener('change', (e) => {
      if (e?.account?.toLowerCase() !== user?.walletAddress?.toLowerCase()) {
        logoutUser()
        setInfo({
          type: "error",
          message: "Wallet address has been changed. Logging out..."
        })
      } else if (isConnected && user && user.id) {
        client.mutate({
          mutation: UPDATE_WALLET_ADDRESS,
          variables: {
            id: user.id,
            address: address
          }
        })
      }
    })
  }, [user, address, isConnected])

  const theme = createTheme({
    components: {
      MuiSwipeableDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#171738", // replace with your desired color
            margin: 10
          },
        },
      },
    },
  });

  function handleProfileClick() {
    if (user?._id) {
      setMobileDrawer(!mobileDrawer)
    } else {
      Router.push('/login')
    }
  }

  return (
    <div
      className="md:hidden rounded-xl group items-center hover:text-black flex transition-all hover:cursor-pointer"
    >
      <ButtonBase onClick={() => handleProfileClick()} className="w-8 h-8 bg-gradient-to-tr from-primary overflow-hidden hover:border-primary border-2 border-black transition-all to-orange-900 rounded-full ">
        <Image
          src={userDetails?.userDetails?.profilePic ?? "/dummyAvatar.png"}
          alt="profile"
          width={100}
          height={100}
          className="w-12 h-12 overflow-hidden object-cover rounded-full"
        />
      </ButtonBase>
      {["bottom"].map((anchor) => (
        <React.Fragment key={anchor}>
          <div onClick={toggleDrawer(anchor, true)}>
            <ThemeProvider theme={theme}>
              <SwipeableDrawer
                anchor={anchor}
                open={mobileDrawer}
                onBackdropClick={() => setMobileDrawer(!mobileDrawer)}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
                className=" bg-forground m-10 "
              >
                <Box
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "left",
                      padding: "20px",
                    }}
                  >
                    <Link href={`/profile/${user?._id}`}>
                      <div>
                        <Stack direction="row" spacing={2}>
                          <Avatar
                            alt="Remy Sharp"
                            src={user?.profilePic ?? "/dummyAvatar.png"}
                          />
                          <div>
                            <p>{user?.username}</p>
                            <p style={{ fontSize: 14, opacity: 0.6 }}>{user?.email}</p>

                            {/* {!isConnected && (
                            <Button className="connect_Wallet text-white">
                              <AccountBalanceWalletOutlinedIcon
                                sx={{ marginRight: "10px" }}
                              />
                              Connect Wallet
                            </Button>
                          )} */}

                          </div>
                        </Stack>
                      </div>
                    </Link>
                  </Box>

                  {isConnected ? <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingLeft: "25px",
                      paddingRight: "25px",
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, flexDirection: "row", justifyContent: 'center', alignItems: "center" }} >
                      <Avatar
                        alt="polygon"
                        src={
                          user?.profilePic ??
                          "/polygon.svg"
                        }
                      />
                      <p>
                        {address ? truncateAddress(address) : ""}
                      </p>
                    </div><CopyContent content={address} />
                  </Box> : <Beforeconnect />}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "left",
                      padding: "20px",
                    }}
                  >
                    <div>
                      <Stack direction="row" spacing={2}>

                        <div>


                          {!isConnected || !address && (
                            <button onClick={() => logoutUser()}>
                              <Disconnect
                                sx={{ marginRight: "10px" }}
                              />
                              Disconnect Wallet
                            </button>
                          )}

                        </div>
                      </Stack>
                    </div>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "left",
                      paddingLeft: "25px",
                      paddingBottom: "20px",
                      borderBottom: "1px",
                      borderColor: "white",
                    }}
                  >
                    <Link href={`/profile/${user?._id}`}>
                      <div>My NFT's</div>
                    </Link>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "left",
                      paddingLeft: "25px",
                      paddingBottom: "20px",
                    }}
                  >
                    <Link href={`/profile/${user?._id}`}>
                      <div>Verify your KYC</div>
                    </Link>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "left",
                      paddingLeft: "25px",
                      paddingBottom: "20px",
                    }}
                    onClick={() => {
                      logoutUser()
                    }}
                  >
                    <div>Logout</div>
                  </Box>
                </Box>
              </SwipeableDrawer>
            </ThemeProvider>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

function Header({ activePage }) {
  const [walletAddressLocal, setWalletAddressLocal] = useState("");
  const [showWallet, setShowWallet] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [balance, setBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchResults, setSearchResults] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const { isConnected, address, connector } = useAccount();
  const [authModal, setAuthModal] = useState(false);
  const dispatch = useDispatch()
  const { disconnectAsync } = useDisconnect();
  const authUser = useSelector(selectAuthUser)
  const [showMenu, setShowMenu] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const account = address;
  const [showSearch, setShowSearch] = useState(false);
  // Mobile Popover for Profile

  const handleSearch = (keyword) => {
    if (keyword?.length >= 1) {
      client
        .query({
          query: globalSearch,
          variables: {
            keyword: keyword,
          },
        })
        .then((result) => {
          setSearchResults(result?.data?.globalSearch);
        })
        .catch((e) => { });
    } else setSearchResults({});
  };

  const logoutUser = () => {
    disconnectAsync();
    localStorage.clear();
    Router.push("/").then(() => {
      Router.reload();
    });
  };

  useEffect(() => {
    connector?.addListener('change', (e) => {
      if (e?.account?.toLowerCase() !== userDetails?.walletAddress?.toLowerCase()) {
        dispatch(setInfo({
          type: "error",
          message: "Account has been changed externally. Logging out..."
        }))
        setTimeout(() => {
          dispatch(setInfo({}));
        }, 3000);
        logoutUser()
      }
    })
    if (isConnected && userDetails && userDetails?._id) {
      client.mutate({
        mutation: UPDATE_WALLET_ADDRESS,
        variables: {
          id: userDetails?._id,
          address: address
        }
      })
        .then((res) => {
          console.log(res);
          localStorage.setItem("metadata", JSON.stringify({ ...userDetails, walletAddress: address }));
          dispatch(setInfo({
            type: "success",
            message: "Wallet connected successfully!"
          }));
          setTimeout(() => {
            dispatch(setInfo({}));
          }, 3000);
        })
        .catch((error) => {
          console.log(error);
          dispatch(setInfo({
            type: "error",
            message: error.message
          }));
          setTimeout(() => {
            dispatch(setInfo({}));
          }, 4000);
          disconnectAsync();
          localStorage.setItem("metadata", JSON.stringify({ ...userDetails, walletAddress: null }));
        })
    }
    else if (!isConnected && userDetails && userDetails?._id && userDetails?.walletAddress !== null) {
      localStorage.setItem("metadata", JSON.stringify({ ...userDetails, walletAddress: null }));
    }
  }, [userDetails, address, isConnected])

  useEffect(() => {
    if (isAuthenticated) {
      const menu = document.querySelector('#profile-menu')
      const body = document.querySelector('body')
      body.addEventListener('click', (e) => {
        if (menu && !menu?.contains(e.target)) {
          setShowMenu(false);
        }
      })
    }
  }, [isAuthenticated])

  useEffect(() => {
    // if (Router?.query?.id) {
    //   client.query({
    //     query: getUserDetails,
    //     variables: {
    //       id: Router.query.id,
    //       transactionType: "all"
    //     }
    //   }).then((e) => {
    //     setUserDetails(e.data?.getUserById)
    //   })
    // }
    const metadata = JSON.parse(localStorage.getItem('metadata'));
    if (metadata && metadata?._id) {
      setUserDetails(metadata)
      setIsAuthenticated(true)
    }
  }, [])

  const handleProfileClick = (e) => {
    const metadata = JSON.parse(localStorage.getItem('metadata'));
    if (metadata && metadata?._id) {
      setShowMenu(!showMenu)
    } else {
      Router.push("/login")
    }
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
          <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const [searchIndex, setSearchIndex] = useState(0)
  return (
    <div className="bg-forground/60 backdrop-blur-xl fixed top-0 w-full md:py-1 py-3 z-50 flex items-center" style={{ zIndex: 999 }} >
      {showSearch ?
        <motion.div initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, type: "cubic-bezier" }} className="flex flex-row justify-center items-center w-11/12 mx-auto relative">
          <div className="bg-black/20 flex flex-row rounded-full border-white/10 border-[1px] w-full items-center justify-center mr-4 h-12">
            <input
              placeholder="Search web3"
              name="search"
              autoComplete={false}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="outline-none w-full py-1 px-5 bg-transparent font-sans rounded-full border-transparent "
            />
          </div>
          {searchResults && Object?.keys(searchResults)?.length ? (
            <div className=" absolute top-14 -left-8 md:left-4/5 w-full h-96 bg-forground border-[1px] border-white/10 ml-8 rounded-2xl overflow-auto p-4 no-scroll shadow-2xl">
              <Tabs value={searchIndex} onChange={(e, i) => setSearchIndex(i)} >
                <Tab label={`Collections (${searchResults?.nftCollection?.length ?? 0})`} />
                <Tab label={`NFTs (${searchResults?.nfts?.length ?? 0})`} />
                <Tab label={`Users (${searchResults?.users?.length ?? 0})`} />
              </Tabs>
              <TabPanel value={searchIndex} index={0} >
                {searchResults?.nftCollection?.map((sugg, index) => (
                  <ButtonBase
                    key={index}
                    className="w-full cursor-pointer p-4 backdrop-blur-xl border-b-[1px] border-white/5 flex flex-row items-center justify-start"
                    onClick={() => {
                      setSearchResults({});
                      setSearchQuery("");
                      setShowSearch(false)
                      Router.push(`/collections/${sugg?.id}`);
                    }}
                  >
                    <img
                      src={sugg?.imageURL ?? "/dummyAvatar.png"}
                      alt="img"
                      className="w-8 h-8 mr-2 rounded-full"
                    />
                    <p className=" text-md">{sugg.name}</p>
                  </ButtonBase>
                ))}
                <Button startIcon={<SearchNormal />} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4 mt-2" >
                  <Link href={`/discover/collections`}>
                    Search all collections
                  </Link>
                </Button>
              </TabPanel>
              <TabPanel value={searchIndex} index={1} >
                {searchResults?.nfts?.map((sugg, index) => (
                  <div
                    key={index}
                    className="w-full cursor-pointer p-4 backdrop-blur-xl border-b-[1px] border-white/5 flex flex-row items-center justify-start"
                    onClick={() => {
                      setSearchResults({});
                      setSearchQuery("");
                      setShowSearch(false)
                      Router.push(`/asset/${sugg?._id}`);
                    }}
                  >
                    <Image
                      src={sugg?.itemImage ?? "/dummyAvatar.png"}
                      alt="img"
                      width={100}
                      height={100}
                      className="w-8 h-8 mr-2 rounded-full"
                    />
                    <p className=" text-md">{sugg.itemName}</p>
                  </div>
                ))}
                <Button startIcon={<Search />} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4" >
                  <Link href={`/discover/nfts`}>
                    Search all NFTs
                  </Link>
                </Button>
              </TabPanel>
              <TabPanel value={searchIndex} index={2} >

                {searchResults?.users?.map((sugg, index) => (
                  <div
                    key={index}
                    className="w-full cursor-pointer p-4 backdrop-blur-xl border-b-[1px] border-white/5 flex flex-row items-center justify-start"
                    onClick={() => {
                      setSearchResults({});
                      setSearchQuery("");
                      setShowSearch(false)
                      Router.push(`/profile/${sugg?._id}`);
                    }}
                  >
                    <img
                      src={sugg?.profilePic ?? "/dummyAvatar.png"}
                      alt="img"
                      className="w-8 h-8 mr-2 rounded-full"
                    />
                    <p className=" text-md">{sugg.displayName}</p>
                  </div>
                ))}
                <Button startIcon={<Search />} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4" >
                  <Link href={`/artists`}>
                    Search all Artists
                  </Link>
                </Button>
              </TabPanel>
            </div>
          ) : (
            <></>
          )}
          <IconButton onClick={() => {
            setShowSearch(false)
            setSearchQuery('')
            setSearchResults({});
          }} className="px-1">
            <CloseCircle />
          </IconButton>
        </motion.div>
        :
        <div className="flex flex-row items-center justify-between max-w-screen-2xl w-11/12 mx-auto">

          <Image
            alt="inocyx_logo"
            width={140}
            height={40}
            src="/inocyx.png"
            className="hover:cursor-pointer mr-10"
            onClick={() => Router.push("/")}
          />
          <div className="w-full hidden md:flex flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center">
              <Link href="/discover/collections" className="px-2 py-4">
                <ButtonBase
                  className="hover:bg-white/20 border-b-2 border-transparent items-center flex py-2 px-4 rounded-full transition-all hover:cursor-pointer"
                >
                  <span className={`${activePage === 'discover' ? "textClip" : "text-white"} font-inter font-semibold text-sm`} >Discover</span>
                </ButtonBase>
              </Link>
              <Link href="/celebrities" className="px-2 py-4">
                <ButtonBase
                  className="hover:bg-white/20 border-b-2 border-transparent items-center flex py-2 px-4 rounded-full transition-all hover:cursor-pointer"
                >
                  <span className={`${activePage === 'celebrities' ? "textClip" : "text-white"} font-inter font-semibold text-sm `}>Celebrities</span>
                </ButtonBase>
              </Link>
              <Link
                href="/maps"
                className="px-2 py-4"
              >
                <ButtonBase
                  className="hover:bg-white/20 border-b-2 border-transparent items-center flex py-2 px-4 rounded-full transition-all hover:cursor-pointer"
                >
                  <span className={`${activePage === 'maps' ? "textClip" : "text-white"} font-inter font-semibold text-sm `}>Maps</span>
                </ButtonBase>
              </Link>
            </div>
            <div className="flex w-1/2 flex-row gap-10 justify-between items-center">
              {/* <div className="bg-black/20 focus:ring-white focus:border-white/20 flex flex-row rounded-lg border-white/10 border-[1px] w-full items-center mr-4">
                <input
                  placeholder="Search nft"
                  name="search"
                  autoComplete={false}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <div className="px-4">
                  <SearchIcon />
                </div>
              </div> */}
              <div className="relative h-[100%] w-11/12 ">
                <input type="text" value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  id="input-group-1" className=" border-[1px] hover:border-white/20 text-white text-sm focus:ring-primary focus:border-primary block w-full pl-6 p-3 rounded-full  bg-white/5 font-sans border-transparent placeholder-gray-400" placeholder="Search web3" />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <SearchNormal size="18" />
                </div>
              </div>

              {searchResults && Object?.keys(searchResults)?.length ? (
                <div className="absolute top-16 left-4/5 w-[500px] h-64 bg-forground border-2 border-white/10 ml-8 rounded-2xl overflow-auto p-4 shadow-2xl">
                  <Tabs value={searchIndex} onChange={(e, i) => setSearchIndex(i)} >
                    <Tab label={`Collections (${searchResults?.nftCollection?.length ?? 0})`} />
                    <Tab label={`NFTs (${searchResults?.nfts?.length ?? 0})`} />
                    <Tab label={`Users (${searchResults?.users?.length ?? 0})`} />
                  </Tabs>
                  <TabPanel value={searchIndex} index={0} >
                    {searchResults?.nftCollection?.map((sugg, index) => (
                      <div
                        key={index}
                        className="w-full cursor-pointer p-4 border-b-[1px] border-white/5 flex flex-row items-center justify-start"
                        onClick={() => {
                          setSearchResults({});
                          setSearchQuery("");
                          Router.push(`/collections/${sugg?.id}`);
                        }}
                      >
                        <img
                          src={sugg?.imageURL ?? "/dummyAvatar.png"}
                          alt="img"
                          className="w-8 h-8 mr-2"
                        />
                        <p className=" text-md font-sans">{sugg.name}</p>
                      </div>
                    ))}
                    <Button startIcon={<SearchNormal />} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4 mt-2" >
                      <Link href={`/collections`}>
                        Search all collections
                      </Link>
                    </Button>
                  </TabPanel>
                  <TabPanel value={searchIndex} index={1} >
                    {searchResults?.nfts?.map((sugg, index) => (
                      <div
                        key={index}
                        className="w-full cursor-pointer p-4 border-b-[1px] border-white/5 flex flex-row items-center justify-start"
                        onClick={() => {
                          setSearchResults({});
                          setSearchQuery("");
                          Router.push(`/asset/${sugg?._id}`);
                        }}
                      >
                        <Image
                          src={sugg?.itemImage ?? "/dummyAvatar.png"}
                          alt="img"
                          width={100}
                          height={100}
                          className="w-8 h-8 mr-2 rounded-full"
                        />
                        <p className=" text-md font-sans">{sugg.itemName}</p>
                      </div>
                    ))}
                    <Button startIcon={<Search />} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4" >
                      <Link href={`/discover/collections`}>
                        Search all NFTs
                      </Link>
                    </Button>
                  </TabPanel>
                  <TabPanel value={searchIndex} index={2} >

                    {searchResults?.users?.map((sugg, index) => (
                      <div
                        key={index}
                        className="w-full cursor-pointer p-4 border-b-[1px] border-white/5 flex flex-row items-center justify-start"
                        onClick={() => {
                          setSearchResults({});
                          setSearchQuery("");
                          Router.push(`/profile/${sugg?.id}`);
                        }}
                      >
                        <img
                          src={sugg?.profilePic ?? "/dummyAvatar.png"}
                          alt="img"
                          className="w-8 h-8 mr-2 rounded-full"
                        />
                        <p className=" text-md font-sans">{sugg.displayName}</p>
                      </div>
                    ))}
                    <Button startIcon={<Search />} className="w-full bg-white/5 hover:bg-white/10 rounded-2xl p-4" >
                      <Link href={`/artists`}>
                        Search all Artists
                      </Link>
                    </Button>
                  </TabPanel>
                </div>
              ) : (
                <></>
              )}

              {/* <div className="rounded-xl group items-center hover:text-black flex px-6 py-2 transition-all hover:cursor-pointer items-end ">
              <Image
                src="/pending.svg"
                alt="profile"
                width={100}
                height={100}
                className="w-4 h-4 relative left-8 -top-2 overflow-hidden object-fill rounded-full z-50"
              />
              <div className="absolute w-10 h-10 bg-gradient-to-tr from-primary overflow-hidden hover:border-primary border-2 border-black transition-all to-orange-900 rounded-full ">
                <Image
                  src={userDetails?.profilePic ?? "/dummyAvatar.png"}
                  alt="profile"
                  width={100}
                  height={100}
                  className="w-14 h-14 overflow-hidden object-fill rounded-full"
                />
              </div>
              <div className="group-hover:flex hidden text-white">
                <WalletHandle />
              </div>
            </div> */}
              {isAuthenticated ? (
                <div>
                  <IconButton id="profile-menu" onClick={handleProfileClick} >
                    <div className="bg-white text-black w-10 h-10 flex justify-center items-center rounded-full">
                      <Avatar src={userDetails?.profilePic} />
                    </div>
                  </IconButton>
                  {showMenu ? <div className=" text-white">
                    <WalletHandle userInfo={userDetails} />
                  </div> : null}
                </div>
              ) : <Button
                startIcon={<div className="bg-white text-black lg:w-10 lg:h-10 md:w-6 md:h-6 flex justify-around items-center rounded-full"><AccountBalanceWalletRounded /></div>}
                className="flex rounded-full items-center cursor-pointer btn-gradient  text-white px-6 lg:py-1 hover:brightness-75"
                onClick={handleProfileClick}
              >
                <span className="font-sans lg:text-base md:text-sm font-bold">Connect</span>
              </Button>
              }
            </div>
          </div>

          <Modal open={authModal} closable={true} backdropClosable={false} handleClose={() => setAuthModal(false)}>
            <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
              <h3 className="font-KronaOne text-2xl self-start " >Connect to wallet</h3>
              <span className="my-2 text-lg opacity-60" >Connect with one of the available wallet providers or create a new wallet.</span>
              <ButtonBase className="my-2 mt-10 rounded-xl">
                <div className="flex flex-row items-center justify-center p-4 border-2 border-white/10 bg-white/5 gap-4 rounded-xl"  >
                  <div className="bg-white rounded-full p-2">
                    <Image src="/metamask.png" width={100} height={100} alt="metamask" />
                  </div>
                  <div className="flex flex-col items-start" >
                    <span className="font-semibold">Metamask</span>
                    <span className="opacity-60 text-sm text-left mt-1" >Sale your single item to increase your currencies that generated by crypto currency.</span>
                  </div>
                </div>
              </ButtonBase>
              <ButtonBase className="my-2 rounded-xl">
                <div className="flex flex-row items-center justify-center p-4 border-2 border-white/10 bg-white/5 gap-4 rounded-xl"  >
                  <div className="bg-white rounded-full p-2">
                    <Image src="/wallet_connect.png" alt="wallet" width={100} height={100} />
                  </div>
                  <div className="flex flex-col items-start" >
                    <span className="font-semibold">Wallet Connect</span>
                    <span className="opacity-60 text-sm text-left mt-1" >Sale your single item to increase your currencies that generated by crypto currency.</span>
                  </div>
                </div>
              </ButtonBase>
            </div>
          </Modal>

          <div className="flex flex-row items-center gap-2">
            <div className="" >
              <IconButton
                className="md:hidden p-3 flex"
                onClick={() => setShowSearch(true)}
              >
                <SearchNormal size={20} />
              </IconButton>
            </div>
            <BottomDrawer userDetails={userDetails} />
            <div className="" >
              <IconButton
                className="md:hidden p-3 flex"
                onClick={() => setMenu(true)}
              >
                <HambergerMenu size={20} />
              </IconButton>
            </div>
          </div>

          {menu ? (
            <motion.div initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed top-0 left-0 w-full h-full bg-black/90 px-8 backdrop-blur-xl">
              <div className="flex w-full flex-row items-center justify-between mt-6">
                <p className="text-2xl font-KronaOne font-bold ">Menu</p>
                <IconButton
                  className="md:hidden py-5 flex"
                  onClick={() => setMenu(!menu)}
                >
                  <Close className="text-4xl" />
                </IconButton>
              </div>
              <div className="flex flex-col w-full items-start justify-center">
                <Link className="w-full" href="/discover/collections">
                  <ButtonBase
                    className="hover:bg-black/20 border-b-2 border-transparent  w-full justify-start  items-start  flex py-5
                          transition-all hover:cursor-pointer"
                    onClick={() => setMenu(false)}
                  >
                    <span className="font-inter text-md font-medium ">
                      Discover
                    </span>
                  </ButtonBase>
                </Link>
                <Link className="w-full" href="/celebrities">
                  <ButtonBase
                    className="hover:bg-black/20 border-b-2 border-transparent  w-full justify-start  items-start  flex py-5
                          transition-all hover:cursor-pointer"
                    onClick={() => setMenu(false)}
                  >
                    <span className="font-inter text-md ">Celebrities</span>
                  </ButtonBase>
                </Link>
                <Link className="w-full" href="/maps">
                  <ButtonBase
                    className="hover:bg-black/20 border-b-2 border-transparent  w-full justify-start  items-start  flex py-5
                          transition-all hover:cursor-pointer"
                    onClick={() => setMenu(false)}
                  >
                    <span className="font-inter text-md ">Maps</span>
                  </ButtonBase>
                </Link>
                {/* <div className="z-50 w-full rounded-xl">
              {account ? (
                <div
                  className="  group items-center w-full  relative flex py-5
              transition-all hover:cursor-pointer"
                >
                  <div className="w-6 h-6  rounded-full" />
                  <span className="font-inter text-sm w-1/2 ml-2 text-left truncate select-none">
                    {userDetails?.displayName}
                  </span>
                  <div className="group-hover:flex hidden text-white">
                    <WalletHandle />
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center cursor-pointer w-full  text-black py-5 hover:brightness-75 "
                  onClick={() => Router.push("/auth")}
                >
                  <AccountBalanceWalletOutlinedIcon />
                  <span className="font-inter ml-2 text-sm font-bold">
                    Connect
                  </span>
                </div>
              )}
            </div> */}

                {!isConnected && !userDetails?._id && (
                  <div
                    className="flex rounded-xl cursor-pointer btn-gradient text-white px-3 py-2  hover:brightness-75   items-end"
                    onClick={() => Router.push("/login")}
                  >
                    <AccountBalanceWalletOutlinedIcon />
                    <span className="font-inter ml-2 text-sm font-bold">
                      Connect
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

          ) : (
            <></>
          )}
        </div>
      }
    </div>

  );
}

export default memo(Header);
