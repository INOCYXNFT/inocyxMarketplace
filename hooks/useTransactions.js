// import Router from "next/router";
// import ContractABI from "../contracts/contractABI";
// import { mintLand, purchaseNFT, PutOnSale, CancelNFTSale } from "../apollo/api/mutations"

// const mintNFT = async (nft, isAuthenticated, account ) => {

//     if (nft?.isMinted && nft?.forSale) {
//       Router.push(`/asset/${nft.id}`);
//     } else if (isAuthenticated && account) {
//       const sendOptions = {
//         contractAddress: '0xB09D4e5e682d98Ec9AfE734596A3F57B6d5Dc5a7',
//         functionName: 'mintLand',
//         abi: ContractABI,
//         msgValue: Moralis.Units.ETH('0.001'),
//         // params: {
//         //   _newMessage: "Hello Moralis",
//         // },
//       };

//       const transaction = await Moralis.executeFunction(sendOptions);
//       // --> "0x39af55979f5b690fdce14eb23f91dfb0357cb1a27f387656e197636e597b5b7c"

//       // Wait until the transaction is confirmed
//       await transaction.wait();
//       client
//         .mutate({
//           mutation: mintLand,
//           variables: {
//             uniqueID: nft?.id,
//             buyer: account,
//           },
//         })
//         .then(res => {
//           return true;
//         });
//       // setTimeout(() => {
//       //   setLoader(false)
//       //   window.location.reload()
//       // }, 4000)
//     }
//   };

//   const buyNft = async () => {
//     if (
//       isAuthenticated &&
//       account &&
//       walletAddressLocal &&
//       info?.currentSale?.contractListingID != null
//     ) {
//       const sendOptions = {
//         contractAddress: MARKETPLACE_ADDRESS,
//         functionName: 'buyAssetFromListing',
//         abi: MarketplaceABI,
//         msgValue: Moralis.Units.ETH(info?.listPrice),
//         params: {
//           listingId: info?.currentSale?.contractListingID,
//           erc20Address: '0x0000000000000000000000000000000000000000',
//         },
//       };

//       try {
//         const transaction = await Moralis.executeFunction(sendOptions);
//         // --> "0x39af55979f5b690fdce14eb23f91dfb0357cb1a27f387656e197636e597b5b7c"

//         // Wait until the transaction is confirmed
//         await transaction.wait();
//         client
//           .mutate({
//             mutation: purchaseNFT,
//             variables: {
//               uniqueID: info?.id,
//               buyer: walletAddressLocal,
//             },
//           })
//           .then(res => {
//             window.location.reload();
//             setLoader(false);
//           });
//       } catch (e) {
//         setLoader(false);
//       }
//     }
//   };

//   const sellNFT = async () => {
//     setLoader(true);
//     // console.log('message==>', parseInt(message._hex));
//     if (isAuthenticated && account && walletAddressLocal && price > 0) {
//       const readOptions = {
//         contractAddress: '0xB09D4e5e682d98Ec9AfE734596A3F57B6d5Dc5a7',
//         functionName: 'isApprovedForAll',
//         abi: ABI,
//         params: {
//           account,
//           operator: MARKETPLACE_ADDRESS,
//         },
//       };

//       const isApproved = await Moralis.executeFunction(readOptions);

//       if (!isApproved) {
//         const approveAll = {
//           contractAddress: '0xB09D4e5e682d98Ec9AfE734596A3F57B6d5Dc5a7',
//           functionName: 'setApprovalForAll',
//           abi: ABI,
//           params: {
//             approved: true,
//             operator: MARKETPLACE_ADDRESS,
//           },
//         };

//         await Moralis.executeFunction(approveAll);
//       }

//       // isApproved = parent(isApproved._hex);

//       const sendOptions = {
//         contractAddress: MARKETPLACE_ADDRESS,
//         functionName: 'createListing',
//         abi: MarketplaceABI,
//         // msgValue: Moralis.Units.ETH(price),
//         params: {
//           isErc721: false,
//           nftAddress: '0xB09D4e5e682d98Ec9AfE734596A3F57B6d5Dc5a7',
//           tokenIds: [info?.tokenID],
//           price: Moralis.Units.ETH(price),
//           seller: account,
//           amount: 1,
//           erc20Address: '0x0000000000000000000000000000000000000000',
//         },
//       };

//       try {
//         const ListingIdRead = {
//           contractAddress: MARKETPLACE_ADDRESS,
//           functionName: 'getCurrentListingID',
//           abi: MarketplaceABI,
//         };

//         const message = await Moralis.executeFunction(ListingIdRead);

//         const transaction = await Moralis.executeFunction(sendOptions);
//         // --> "0x39af55979f5b690fdce14eb23f91dfb0357cb1a27f387656e197636e597b5b7c"

//         // Wait until the transaction is confirmed
//         await transaction.wait();
//         client
//           .mutate({
//             mutation: PutOnSale,
//             variables: {
//               uniqueID: info?.id,
//               price,
//               contractListingID: parseInt(message?._hex)?.toString(),
//             },
//           })
//           .then(res => {
//             window.location.reload();
//             setLoader(false);
//           });
//       } catch (e) {
//         setLoader(false);
//       }
//     }
//   };

//   const cancelNFT = async () => {
//     setLoader(true);
//     if (
//       isAuthenticated &&
//       account &&
//       walletAddressLocal &&
//       info?.currentSale?.contractListingID != null
//     ) {
//       const sendOptions = {
//         contractAddress: MARKETPLACE_ADDRESS,
//         functionName: 'cancelListing',
//         abi: MarketplaceABI,
//         // msgValue: Moralis.Units.ETH(price),
//         params: {
//           listingId: info?.currentSale?.contractListingID,
//           erc20Address: '0x0000000000000000000000000000000000000000',
//         },
//       };

//       try {
//         const readOptions = {
//           contractAddress: MARKETPLACE_ADDRESS,
//           functionName: 'getCurrentListingID',
//           abi: MarketplaceABI,
//         };

//         const message = await Moralis.executeFunction(readOptions);
//         const transaction = await Moralis.executeFunction(sendOptions);
//         // --> "0x39af55979f5b690fdce14eb23f91dfb0357cb1a27f387656e197636e597b5b7c"

//         // Wait until the transaction is confirmed
//         await transaction.wait();
//         client
//           .mutate({
//             mutation: CancelNFTSale,
//             variables: {
//               uniqueID: info?.id,
//             },
//           })
//           .then(res => {
//             window.location.reload();
//             setLoader(false);
//           });
//       } catch (e) {
//         setLoader(false);
//       }
//     }
//   };

//   export default {buyNft, cancelNFT, sellNFT, mintNFT}