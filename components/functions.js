// import React, { useState, useEffect, useCallback } from 'react';
// import Image from 'next/image';
// import { Button, IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { useRouter } from "next/router"
// import { Check, Edit } from '@mui/icons-material';
// import ArrowRightAlt from '@mui/icons-material/ChevronRight';
// import CopyIcon from '@mui/icons-material/FileCopyOutlined';
// import Disconnect from '@mui/icons-material/PowerSettingsNew';
// import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
// import { useDisconnect, useAccount } from "wagmi"
// import { useMoralis } from 'react-moralis';
// import client from '../apollo/apolloClient';
// import { MapContainer, TileLayer, Polygon } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import GlobalData from "../utility/grids.json";

// // const MARKETPLACE_ADDRESS = '0x5c9c886d6074520CAEDd60729D286153A68930E9';

// const center = [13.206453665419989, 80.16888447614319];

// function WalletHandle(props) {
//   const router = useRouter()
//   const { logout } = useMoralis();
//   const [copied, setCopied] = useState(false);

//   const logoutUser = () => {
//     logout();
//     localStorage.clear();
//     router.push('/')
//   };

//   return (
//     <div className="bg-black/40 backdrop-blur-xl absolute top-16 flex flex-col items-center rounded-xl justify-center w-1/4 right-0 z-50 ">
//       <div
//         className="flex flex-row items-center p-4 border-b-[1px] border-white/10 w-full justify-between rounded-xl hover:bg-white/10 cursor-pointer "
//         onClick={() => {
//           router.push(`/profile/${props.account}`);
//         }}
//       >
//         <div className="flex items-center">
//           <div className="w-8 h-8 bg-gradient-to-tr from-primary to-orange-900 rounded-full" />
//           <span className="font-sans ml-2 text-2xl">{props?.username}</span>
//         </div>
//         <ArrowRightAlt />
//       </div>

//       <div className="flex flex-row items-center p-4 border-b-[1px] border-white/10 w-full justify-between rounded-xl hover:bg-white/10 ">
//         <div className="flex items-center w-1/2 ">
//           <Image className="w-8 h-8 " alt="inocyx_logo" src="/polygon.svg" />
//           <div className="flex flex-col items-start">
//             <span className="font-sans ml-2 text-lg font-bold">Polygon</span>
//             <span className="font-sans ml-2 truncate text-ellipsis w-32 text-md opacity-60 ">
//               {props.account
//                 ? `${props.account.substring(0, 6)}...${props.account.substring(
//                   props.account.length - 5,
//                 )}`
//                 : ''}
//             </span>
//           </div>
//         </div>
//         <div className="flex flex-row items-center">
//           <div className="px-4 py-3 bg-white/10 rounded-lg">
//             <span className="font-sans">{props?.balance} Matic</span>
//           </div>
//           <div
//             className="px-4 py-3 bg-white/10 ml-2 rounded-lg cursor-pointer"
//             onClick={() => {
//               navigator.clipboard.writeText(props.account);
//               setCopied(true);
//               setTimeout(() => {
//                 setCopied(false);
//               }, 3000);
//             }}
//           >
//             {copied ? <Check className="w-6 h-6" /> : <CopyIcon className="w-6 h-6" />}
//           </div>
//         </div>
//       </div>

//       <div
//         className="flex flex-row items-center p-4 border-b-[1px] border-white/10 w-full justify-start rounded-xl hover:bg-white/10 cursor-pointer"
//         onClick={() => logoutUser()}
//       >
//         <div className="py-3 px-4 bg-white/10 rounded-full ">
//           <Disconnect className="w-4 h-4" />
//         </div>
//         <span className="font-sans ml-2 text-lg">Disconnect</span>
//       </div>
//     </div>
//   );
// }

// function MapBox() {
//   const [info, setInfo] = useState({});
//   const [loader, setLoader] = useState(false);
//   const [zoomLevel, setZoomLevel] = useState(20);
//   const [sellModal, setSellModal] = useState(false);
//   const [addProperty, setAddProperty] = useState('');
//   const [userDetails, setUserDetails] = useState();
//   const [addPropertyPopup, setAddPropertyPopup] = useState(false);
//   const [selected, setSelected] = useState();
//   const [price, setPrice] = useState();

//   // const navigate = useNavigate();

//   const [mapTheme, setMapTheme] = useState('gokulvaradan/cl6nnkzhg005y14ml7dgo0jxc');

//   const [walletAddressLocal, setWalletAddressLocal] = useState(null);
//   const [showWallet, setShowWallet] = useState(false);
//   const [balance, setBalance] = useState('');

//   useEffect(() => {
//     const leaf = import("react-leaflet")
//     leaf.then((data) => {
//       Map = data.MapContainer
//       TileLayer = data.TileLayer
//       Polygon = data.Polygon
//       // console.log(data)
//     })
//   }, [Map, TileLayer, Polygon])

//   const {
//     Moralis,
//     isWeb3Enabled,
//     enableWeb3,
//     isWeb3EnableLoading,
//     authenticate,
//     isAuthenticated,
//     isUserUpdating,
//     user,
//     account,
//     isAuthenticating,
//     chainId,
//   } = useMoralis();

//   useEffect(() => {
//     const theme = localStorage.getItem('maptheme');
//     setMapTheme(theme ?? 'gokulvaradan/cl6nnkzhg005y14ml7dgo0jxc');
//     const connectorId = window.localStorage.getItem('connectorID');
//     if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
//       enableWeb3({ provider: connectorId });
//     }
//   }, [isAuthenticated, isWeb3Enabled, account, chainId]);

//   useEffect(() => {
//     const walletConnection = async () => {
//       const walletAddressCheck = localStorage.getItem('walletAddress');
//       if (isAuthenticated && account) {
//         if (walletAddressCheck) {
//           setWalletAddressLocal(walletAddressCheck);
//         }
//         if (!isAuthenticating && account && !walletAddressCheck) {
//           localStorage.setItem('walletAddress', account);
//           setWalletAddressLocal(account);
//         }
//       }
//     };
//     walletConnection();
//   }, [isAuthenticated, isAuthenticating, isUserUpdating, user, isWeb3Enabled, chainId, account]);

//   const connectWallet = async () => {
//     if (!isAuthenticating && !walletAddressLocal) {
//       const signMessageText = `I want to login on Inocyx at ${new Date().getTime()}. I accept the Upyo Terms of Service`;
//       if (!isAuthenticated) {
//         // const signMessageText = "Custom SignIn from upyo"
//         await authenticate({ signingMessage: signMessageText })
//           .then(function () {
//             localStorage.setItem('connectorID', 'injected');
//             return true;
//           })
//           .catch(function (error) {
//             console.log('catch', error);
//           });
//       }
//     } else router.push(`/profile/${account}`);
//   };

//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (account) {
//         const options = {
//           method: 'GET',
//           headers: {
//             Accept: 'application/json',
//             'X-API-Key': 'c0nxm9ZnTr8eXOteAh1ts5pKjrcT8Mba0mbOabOUFWk9IBbriBWTwoyUGrVckymS',
//           },
//         };

//         fetch(`https://deep-index.moralis.io/api/v2/${account}/balance?chain=mumbai`, options)
//           .then(response => response.json())
//           .then(response => {
//             const weiBalance = response.balance;
//             if (weiBalance) {
//               const formated = parseFloat(Moralis.Units.FromWei(weiBalance).toString()).toFixed(3);
//               setBalance(formated);
//             }
//           })
//           .catch(err => console.error(err));
//       }
//     };
//     fetchBalance();
//   }, [account]);


//   const fetchLand = useCallback(
//     id => {
//       client
//         .query({
//           query: getLandById,
//           variables: {
//             uniqueID: id,
//           },
//         })
//         .then(result => {
//           setInfo(result.data.getLandByID);
//         })
//         .catch(e => {
//           console.log(e);
//         });
//     },
//     [info],
//   );

//   const handleSubmit = type => {
//     switch (type) {
//       case 'buy':
//         buyNft();
//         break;
//       case 'mint':
//         mintNFT();
//         break;
//       case 'sell':
//         sellNFT();
//         break;
//       // case 'update':
//       //   updateNFT();
//       //   break;
//       case 'cancel':
//         cancelNFT();
//         break;
//       default:
//         break;
//     }
//   };

//   const handleProperty = () => {
//     setLoader(true);
//     client
//       .mutate({
//         mutation: AddCustomInfo,
//         variables: {
//           id: info.id,
//           content: addProperty,
//         },
//       })
//       .then(res => {
//         setLoader(false);
//         setAddPropertyPopup(false);
//         setInfo(res.data.addCustomInfo);
//       })
//       .catch(e => {
//         setLoader(false);
//         setAddPropertyPopup(false);
//       });
//   };

//   useEffect(() => {
//     if (account) {
//       const getUserProfile = walletAddress => {
//         client
//           .query({
//             query: getUserDetails,
//             variables: {
//               walletAddress,
//             },
//           })
//           .then(result => {
//             setUserDetails(result?.data?.getUser);
//           })
//           .catch(e => {
//             console.log(e);
//           });
//       };
//       getUserProfile(account);
//     }
//   }, [isAuthenticated, account, walletAddressLocal]);

//   if (!Map || !TileLayer || !Polygon) return () => <></>

//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <div className="fixed top-0 flex flex-row items-start p-2 justify-between w-full z-50">
//         <Image src="/inocyx.png" alt="map" className="w-44" width={100} height={100} />
//         <div className="flex flex-row w-full items-center justify-end">
//           <select
//             value={mapTheme}
//             className="text-black rounded-lg overflow-hidden p-3 mr-2"
//             onChange={e => {
//               localStorage.setItem('maptheme', e.target.value);
//               setMapTheme(e.target.value);
//             }}
//           >
//             <option className="text-black p-2" value="gokulvaradan/cl6nnkzhg005y14ml7dgo0jxc">
//               Dark
//             </option>
//             <option className="text-black p-2" value="gokulvaradan/cl6nnx8hc000214pqoj106ip0">
//               Light
//             </option>
//             <option className="text-black p-2" value="gokulvaradan/cl6nnt5w8002c15o9jo4xt2z0">
//               Satellite
//             </option>
//             <option className="text-black p-2" value="mapbox/navigation-day-v1">
//               Navigation Day
//             </option>
//             <option className="text-black p-2" value="mapbox/navigation-night-v1">
//               Navigation Night
//             </option>
//           </select>

//           <div className="z-50">
//             {isAuthenticated && account ? (
//               <div
//                 className="flex items-center cursor-pointer bg-black/40 backdrop-blur-lg px-4 py-2 rounded-lg "
//                 onClick={() => setShowWallet(!showWallet)}
//               >
//                 <div className="w-8 h-8 bg-gradient-to-tr from-primary to-orange-900 rounded-full" />
//                 <span className="font-sans ml-2 text-xl select-none ">
//                   {userDetails?.displayName}
//                 </span>
//               </div>
//             ) : (
//               <div
//                 className="flex items-center cursor-pointer bg-yellow-400 text-black px-4 py-2 rounded-lg "
//                 onClick={() => router.push('/auth')}
//               >
//                 <AccountBalanceWalletOutlinedIcon />
//                 <span className="font-sans ml-2 text-lg font-bold">Connect</span>
//               </div>
//             )}

//             {showWallet ? (
//               <WalletHandle
//                 account={account}
//                 balance={balance}
//                 username={userDetails.displayName}
//               />
//             ) : (
//               <></>
//             )}
//           </div>

//           {/* <div className='relative' >
//             <Button
//               type="submit"
//               variant="contained"
//               className="font-sans bg-yellow-500 py-2 self-end"
//               onClick={() => isAuthenticated && account ? setShowWallet(!showWallet) : connectWallet()}
//             >
//               {walletAddressLocal || 'Connect'}
//             </Button>

//             {showWallet ? <WalletHandle account={walletAddressLocal} balance="3.012" username="rufus" /> : <></>}

//           </div> */}
//         </div>
//       </div>
//       {info && Object.keys(info)?.length ? (
//         <div className="bg-black/40 h-[85%] overflow-y-scroll p-4 ml-2 rounded-xl flex absolute right-2 top-20 flex-col items-center justify-start backdrop-blur-xl w-1/4 font-sans z-40">
//           <IconButton
//             className="self-end"
//             onClick={() => {
//               setLoader(false);
//               setInfo(undefined);
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//           <Image src={info?.itemImage} alt="map" className="w-full h-[30vh] bg-gray-900" />
//           <h3 className="text-3xl mt-4">{info?.itemName}</h3>
//           <p className="mt-1 text-lg">{info?.location}</p>
//           <span
//             className="mt-4 self-start text-md font-bold "
//             onClick={() => router.push(`/profile/${info?.ownerAddress}`)}
//           >
//             Owned by: {info?.ownerAddress === account ? 'You' : info?.ownerAddress}
//           </span>
//           <p className="font-sans mt-2 pb-6 pt-2 opacity-80">{info?.itemDescription}</p>
//           {/* <div className="p-3 bg-black/20 border-2 border-gray-900 text-xl">
//             {`Plot: [${info?.coordinates?.lat}, ${info?.coordinates?.lon}]`}
//           </div> */}
//           <div
//             className={`${account === info?.ownerAddress ? 'cursor-pointer' : ''
//               } flex flex-row items-center justify-between rounded-md  w-full p-4 bg-white/20`}
//             onClick={() => (account === info?.ownerAddress ? setAddPropertyPopup(true) : {})}
//           >
//             <p>{info?.customInfo?.length > 0 ? info?.customInfo : 'No Property'}</p>
//             {account === info?.ownerAddress ? <Edit color="white" /> : <></>}
//           </div>

//           <div className="flex flex-col items-start justify-start w-full my-4">
//             <p className="mb-2">Properties</p>
//             <div className="flex flex-row flex-wrap justify-start w-full items-start ">
//               <div className="p-4 w-[46%] text-center mr-2 mb-2 bg-gray-600 font-sans">Land</div>
//               <div className="p-4 w-[46%] text-center mr-2 mb-2 bg-gray-600 font-sans">
//                 Chennai
//               </div>
//             </div>
//           </div>

//           {info?.forSale ? (
//             <p className="my-2 self-start text-xl font-bold">
//               Price: {info?.currentSale?.listPrice}
//             </p>
//           ) : (
//             <></>
//           )}
//           <div className="flex flex-row items-center justify-center w-full">
//             <Button
//               // type="submit"
//               variant="contained"
//               className="font-sans bg-gray-400 w-full py-3 mt-2 self-end"
//               onClick={() => router.push(`/nftDetails`, { state: { nft: { ...info } } })}
//             >
//               View Details
//             </Button>
//             <div className="flex flex-col items-center ml-2 justify-center w-full">
//               <span>Coming Soon</span>
//               <Button
//                 // type="submit"
//                 variant="contained"
//                 disabled
//                 className="font-sans bg-yellow-500/20 w-full py-3 mt-2 self-end"
//                 onClick={() => setSellModal('mint')}
//               >
//                 Rent
//               </Button>
//             </div>
//           </div>

//           {info?.isMinted === false && (
//             <Button
//               // type="submit"
//               variant="contained"
//               className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
//               onClick={() => setSellModal('mint')}
//             >
//               Mint
//             </Button>
//           )}

//           {info?.isMinted && info?.forSale && info?.ownerAddress === account ? (
//             <div className="flex flex-row items-center w-full justify-center">
//               {/* <Button
//                 variant="contained"
//                 className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
//                 onClick={() => setSellModal('update')}
//               >
//                 Update
//               </Button> */}
//               <Button
//                 // type="submit"
//                 variant="contained"
//                 className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
//                 onClick={() => {
//                   setSellModal('cancel');
//                 }}
//               >
//                 Cancel Listing
//               </Button>
//             </div>
//           ) : (
//             info?.isMinted &&
//             info?.forSale &&
//             info?.ownerAddress !== account && (
//               <Button
//                 variant="contained"
//                 className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
//                 onClick={() => setSellModal('buy')}
//               >
//                 Buy
//               </Button>
//             )
//           )}

//           {info?.isMinted && info?.forSale === false && info?.ownerAddress === account && (
//             <Button
//               variant="contained"
//               className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
//               onClick={() => setSellModal('sell')}
//             >
//               Sell
//             </Button>
//           )}
//         </div>
//       ) : (
//         <div />
//       )}

//       <MapContainer
//         center={center}
//         zoom={15}
//         minZoom={4}
//         animate
//         onzoom={e => setZoomLevel(e.sourceTarget.getZoom())}
//         className="z-10"
//         scrollWheelZoom
//         zoomControl={false}
//         style={{ width: '100%', height: '100vh' }}
//       >
//         <TileLayer
//           attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
//           url={`https://api.mapbox.com/styles/v1/${mapTheme}/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ29rdWx2YXJhZGFuIiwiYSI6ImNsMHBwNmdsNjF5N3kzYnB3eng2YTZrbnYifQ.Dra008J3X0rJfdIM_09fmg`}
//         />
//         {zoomLevel >= 14 &&
//           GlobalData.features.map(country => {
//             return (
//               <Polygon
//                 clickable
//                 onclick={() => {
//                   // console.log(country)
//                   setSelected(
//                     country.id,
//                     //   prev => {
//                     //   if (prev.includes(country.id)) {
//                     //     prev.splice(
//                     //       prev.findIndex(curr => curr === country.id),
//                     //       1,
//                     //     );
//                     //     // console.log(temp)
//                     //     return [...prev];
//                     //   }
//                     //   return [...prev, country.id];
//                     // }
//                   );
//                   fetchLand(country.properties.id);
//                 }}
//                 key={Math.random() * GlobalData.features.length}
//                 onmouseover={e => {
//                   const layer = e.target;
//                   layer.setStyle({
//                     color: country.id === selected ? 'green' : 'skyblue',
//                     fillColor: country.id === selected ? 'green' : 'skyblue',
//                     fillOpacity:
//                       country.properties.status === 'minted' && selected !== country.id
//                         ? '0.2'
//                         : selected === country.id
//                           ? 0.6
//                           : 0.2,
//                   });
//                 }}
//                 onmouseout={e => {
//                   const layer = e.target;
//                   layer.setStyle({
//                     color:
//                       country.properties.status === 'minted' && selected !== country.id
//                         ? 'orange'
//                         : selected === country.id
//                           ? 'green'
//                           : mapTheme === 'cl6nnx8hc000214pqoj106ip0'
//                             ? 'black'
//                             : 'skyblue',
//                     fillColor:
//                       country.properties.status === 'minted' && selected !== country.id
//                         ? 'orange'
//                         : selected === country.id
//                           ? 'green'
//                           : mapTheme === 'cl6nnx8hc000214pqoj106ip0'
//                             ? 'black'
//                             : 'skyblue',
//                     fillOpacity:
//                       country.properties.status === 'minted' && selected !== country.id
//                         ? 0.2
//                         : selected === country.id
//                           ? 0.6
//                           : 0,
//                   });
//                 }}
//                 opacity="0.2"
//                 fillOpacity={
//                   country.properties.status === 'minted'
//                     ? '0.2'
//                     : selected === country.id
//                       ? 0.6
//                       : country?.properties?.status === 'sales'
//                         ? '1'
//                         : '0'
//                 }
//                 color={
//                   country.properties.status === 'minted'
//                     ? 'orange'
//                     : selected === country.id
//                       ? 'skyblue'
//                       : mapTheme === 'cl6nnx8hc000214pqoj106ip0'
//                         ? 'black'
//                         : country?.properties?.status === 'sales'
//                           ? 'green'
//                           : 'skyblue'
//                 }
//                 positions={country.geometry.coordinates}
//               />
//             );
//           })}
//       </MapContainer>


//     </div>
//   );
// }

// export default MapBox;
