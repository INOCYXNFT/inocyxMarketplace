import React, { useCallback, useState, useEffect } from "react";
import { Button, Snackbar, Alert, AlertTitle, CircularProgress, IconButton } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { PercentOutlined, Close, UploadFile, ChevronLeft, ArrowBack, ArrowBackIos, ArrowBackOutlined } from "@mui/icons-material";
import { DocumentUpload } from "iconsax-react"
import client from "../apollo/apolloClient";
import { getAllCategory, getAllCollections, getUserDetails } from "../apollo/api/query";
import axios from "axios";
import { CREATE_NFT, mintNFT } from "../apollo/api/mutations";
import contractNFTABI from "../contracts/contractNFTABI";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import Loader from "../components/core/Loader";
import { useAccount } from "wagmi";
import PageTransition from "../components/core/PageTransition";
import { uploadFileToS3, uploadJsonToS3 } from "../utility";
import { ethers } from "ethers";
import { Add } from "iconsax-react";
import Modal from "../components/core/Modal";
import CreateCollection from "../components/create_asset/CreateCollection";
import { FACTORY } from "../contracts/Addresses";
import ERC721_ABI from "../contracts/ERC721.json";
import ERC1155_ABI from "../contracts/ERC1155.json";
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from "@apollo/client";
import { current } from "@reduxjs/toolkit";
import LottieLoader from "../components/core/LottieLoader";
import { BASE_URI, POLYGON_MUMBAI_RPC } from "../constants";
const INITIAL_STATUS = {
  status: '',
  title: '',
  description: ""
}
const CreateAsset = () => {
  const [category, setCategory] = useState(1);
  const [user, setUser] = useState(null);
  const [collection, setCollection] = useState();
  const [isSales, setIsSales] = useState(true);
  const [allCategories, setAllCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [imgHash, setImgHash] = useState("");
  const [loader, setLoader] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [fileFormat, setFileFormat] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageObj, setImageObj] = useState(null)
  const [imageBuffer, setImageBuffer] = useState(null)
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const router = useRouter();
  const [nftType, setNftType] = useState(router.query.type);
  const { isConnected, address } = useAccount();
  const [transactionStatus, setTransactionStatus] = useState(INITIAL_STATUS);
  const [info, setInfo] = useState({})
  const [collect, setCollect] = useState([]);
  let userCollections = [];
  const [createNFT, { data, loading, error }] = useMutation(CREATE_NFT, { variables: { tokenID: null, collectionID: null, itemName: null, itemDescription: null, itemImage: null, metaDataURL: null, price: null, isMinted: null, assetFormat: null, itemIPFSImage: null, categoryId: null, nftType: null, tokenQty: null, royalty: null, creatorAddress: null, ownerAddress: null, isCelebrityAuction: null, auctionStartPrice: null, auctionEndTime: null, isOpenEdition: null, collectionaddress: null, transactionHash: null } })
  const CollectionList = [
    {
      _id: 0,
      name: "Create",
      imageURL: <Add />,
    }
  ];

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('metadata')));
    setWalletAddress(user?.walletAddress);
  }, []);

  useEffect(() => {
    if (collections.length > 1) {
      setCollection(collections[1]);
    }
  }, [collections]);

  useEffect(() => {
    if (router.isReady) {
      console.log(nftType, router.isReady)
      setNftType(router.query.type);
    }
    else {
      console.log(nftType)
    }
  }, [router.isReady]);

  useEffect(() => {
    userCollections = collect?.filter((item) => item?.creatorAddress?.toLowerCase() === address?.toLowerCase());
    setCollections([...CollectionList, ...userCollections]);
  }, [collect, address, isConnected]);

  useEffect(() => {
    if (address !== null) {
      getCollections();
    }
  }, [address, isConnected, transactionStatus, router.isReady]);

  const getCollections = async () => {
    await client.query({
      query: getAllCollections,
      variables: {
        nftType: nftType
      }
    })
      .then((res) => {
        setCollect(res?.data?.getAllCollections)
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  useEffect(() => {
    if (user?._id) {
      client.query({
        query: getUserDetails,
        variables: {
          id: user?._id,
          transactionType: "all"
        }
      }).then((res) => {
        if (!res?.data?.getUserById?.isCreator) {
          Router.back();
        }
      })
    }
    client
      .query({
        query: getAllCategory,
      })
      .then((result) => {
        if (result?.data?.getAllCategory?.length) {
          setCategory(result?.data?.getAllCategory?.[0]?.id);
          setAllCategories(result?.data?.getAllCategory);
        }
      })
      .catch(() => { });
  }, []);

  const handleBannerUpload = (file) => {
    const CLOUDINARY_URL =
      "https://api.cloudinary.com/v1_1/dfji3oju6/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "uvntychx";

    const formData = new FormData();
    formData.append("file", file?.[0]);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    return fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setImageUrl(data.secure_url);
      })
      .catch(() => { });
  };

  const sendFileToIPFS = useCallback(async () => {
    setLoader(true);
    if (imageObj) {
      try {
        let image = await uploadFileToS3(imageObj?.[0]);
        setImageUrl(image)
        const formData = new FormData();
        formData.append("file", imageObj?.[0]);
        const format = imageObj?.[0]?.name?.split(".")?.at(-1);
        setFileFormat(format);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzZjljMDM2MS01N2VjLTQ4NjMtYmIxZC0yM2E1MTEwZTkyMTIiLCJlbWFpbCI6ImRpbmVzaEBpbm9jeXguY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImI4YTljYWE1YTVhNjQ5MGVmYTM1Iiwic2NvcGVkS2V5U2VjcmV0IjoiN2JhOWU1ZjJmZjUzMGEzOWM1MzNjMjA1Yjk4YzVkOGJkYTUyYmYzMmNlNWY5N2FiMWQ0ZjY2ZDQ0ODE3OWUzNyIsImlhdCI6MTY2NzgyNDMzNH0.q4Uv4FjdWGnIOLxwdyPnX6vusp9URszhWvSOicqQGHo",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

        setImgHash(ImgHash);
        setLoader(false);
      } catch (error) {
        setLoader(false);
      }
    }
  }, []);

  // const sendJsontoIPFS = useCallback(async (e, img, format) => {
  //   setLoader(true);
  //   if (e) {
  //     try {
  //       const address = window.localStorage.getItem("walletAddress");

  //       const resFile = await axios({
  //         method: "post",
  //         url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
  //         data: JSON.stringify({
  //           name: e.name,
  //           description: e.description,
  //           image: img,
  //         }),
  //         headers: {
  //           "Content-Type": "application/json",
  //           authorization:
  //             "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzZjljMDM2MS01N2VjLTQ4NjMtYmIxZC0yM2E1MTEwZTkyMTIiLCJlbWFpbCI6ImRpbmVzaEBpbm9jeXguY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImI4YTljYWE1YTVhNjQ5MGVmYTM1Iiwic2NvcGVkS2V5U2VjcmV0IjoiN2JhOWU1ZjJmZjUzMGEzOWM1MzNjMjA1Yjk4YzVkOGJkYTUyYmYzMmNlNWY5N2FiMWQ0ZjY2ZDQ0ODE3OWUzNyIsImlhdCI6MTY2NzgyNDMzNH0.q4Uv4FjdWGnIOLxwdyPnX6vusp9URszhWvSOicqQGHo",
  //         },
  //       });

  //       const jsonHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
  //       const ListingIdRead = {
  //         contractAddress: "0x098AcD423f9Df8b5D041B9925669Ea2dEFc18C7B",
  //         functionName: "_tokenIdCounter",
  //         abi: contractNFTABI,
  //       };

  //       let message = await Moralis.executeFunction(ListingIdRead);
  //       message = (parseInt(message._hex) + 1).toString();

  //       try {
  //         const sendOptions = {
  //           contractAddress: "0x098AcD423f9Df8b5D041B9925669Ea2dEFc18C7B",
  //           functionName: "safeMint",
  //           abi: contractNFTABI,

  //           params: {
  //             to: address,
  //             uri: jsonHash,
  //             _royalty: e?.royalty,
  //           },
  //         };

  //         const transaction = await Moralis.executeFunction(sendOptions);

  //         // Wait until the transaction is confirmed
  //         await transaction.wait();

  //         setLoader(false);
  //         if (img && format) {
  //           client
  //             .mutate({
  //               mutation: mintNFT,
  //               variables: {
  //                 itemName: e.name,
  //                 description: e.description,
  //                 tokenID: message,
  //                 categoryID: category.toString(),
  //                 royality: e.royalty,
  //                 tokenURI: jsonHash,
  //                 imageUrl: img,
  //                 imageIpfsUrl: resFile.data.IpfsHash,
  //                 assetFormat: format,
  //                 ownerAddress: window.localStorage.getItem("walletAddress"),
  //               },
  //             })
  //             .then((result) => {
  //               setLoader(false);
  //               Router.push(`/profile/${address}`);
  //             })
  //             .catch((e) => {
  //               setLoader(false);
  //             });
  //         }
  //       } catch (e) { }
  //     } catch (error) {
  //       setLoader(false);
  //     }
  //   }
  // }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Enter your name"),
    description: Yup.string()
      .min(2, "Too Short!")
      .max(250, "Too Long!")
      .required("Enter your description"),
    price: Yup.number()
      .min(1, "Too Low!")
      .required("Enter the price"),
    copies: Yup.number()
      .min(1, "Copies count should be minimum of 1!")
      .required("Enter the copies count!")
  });

  const handleProfileChange = (file) => {
    setImageObj(file?.[0])

    var reader = new FileReader();

    reader.onload = function (e) {
      setImageBuffer(e.target.result)
    }

    reader.readAsDataURL(file?.[0]);

  }

  async function handleMint(values) {
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
    // console.log({
    //   tokenId: tokenId.toString(),
    //   collectionId: collection.collectionID,
    //   itemName: values.name,
    //   itemDescription: values.description,
    //   itemImage: nftImageUrl,
    //   metaDataUrl: tokenURI,
    //   price: values.price,
    //   isMinted: true,
    //   assetFormat: fileFormat,
    //   itemIpfsImage: nftImageUrl,
    //   categoryId: category,
    //   nftType: nftType,
    //   tokenQty: nftType === 'erc1155' ? values.copies : '1',
    //   royalty: collection?.royaltyPercentage,
    //   creatorAddress: signerAddress,
    //   ownerAddress: signerAddress,
    //   isCelebrityAuction: false,
    //   auctionStartPrice: null,
    //   auctionEndTime: null,
    //   isOpenEdition: false,
    //   collectionaddress: collection.collectionAddress,
    //   transactionHash: hashValue
    // })

    try {
      const format = 'png'
      setFileFormat(format);
      let hashValue = "", mintResult = null, tokenId = 0;
      const ercABI = nftType === 'erc721' ? ERC721_ABI : ERC1155_ABI;

      const RpcProvider = new ethers.providers.JsonRpcProvider(
        POLYGON_MUMBAI_RPC
      );
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
      let signer = provider.getSigner();
      let signerAddress = await signer.getAddress();
      let ercRead = new ethers.Contract(collection.collectionAddress, ercABI, RpcProvider);
      let ercWrite = new ethers.Contract(collection.collectionAddress, ercABI, signer);
      // console.log("Minting in progress...");
      let filename = '';
      if (nftType === 'erc721') {
        filename = values.name + uuidv4()
      } else {
        const currentSupply = await ercRead.callStatic.currentTokenId()
        filename = (parseInt(currentSupply)).toString()
      }
      const nftImageUrl = await uploadFileToS3(imageObj);
      const tokenJson = {
        name: values.name.toString(),
        description: values.description.toString(),
        image: nftImageUrl.toString(),
        price: values.price.toString(),
        copies: nftType === 'erc1155' ? values.copies : 1,
        folder: collection.collectionAddress,
        filename: filename
      }

      let tokenURI = await uploadJsonToS3(tokenJson);
      if (nftType === 'erc721') {
        mintResult = await ercWrite.safeMint(tokenURI);
        const receipt = await mintResult.wait();
        tokenId = parseInt(receipt.events[receipt.events.length - 2].args._tokenId._hex)
        hashValue = receipt.transactionHash
      } else {
        await ercWrite.setURI(`${BASE_URI}/${collection.collectionAddress}`)
        mintResult = await ercWrite.mint(parseInt(values.copies));
        const receipt = await mintResult.wait();
        tokenId = parseInt(receipt.events[receipt.events.length - 2].args.id)
        hashValue = receipt.transactionHash
      }
      const createdNFT = await createNFT({
        variables: {
          tokenId: tokenId.toString(),
          collectionId: collection.collectionID,
          itemName: values.name,
          itemDescription: values.description,
          itemImage: nftImageUrl,
          metaDataUrl: nftType === 'erc1155' ? `${BASE_URI}/${collection.collectionAddress}/${parseInt(tokenId) - 1}.json` : tokenURI,
          price: values.price,
          isMinted: true,
          assetFormat: fileFormat,
          itemIpfsImage: nftImageUrl,
          categoryId: category,
          nftType: nftType,
          tokenQty: nftType === 'erc1155' ? values.copies.toString() : '1',
          royalty: collection?.royaltyPercentage?.toString(),
          creatorAddress: signerAddress,
          ownerAddress: signerAddress,
          isUserCreated: true,
          isCelebrityAuction: null,
          auctionStartPrice: null,
          auctionEndTime: null,
          isOpenEdition: null,
          collectionaddress: collection.collectionAddress,
          transactionHash: hashValue
        }
      });
      setTransactionStatus({
        status: 'completed',
        title: 'Transaction completeted',
        description: "Your transaction is processed by the Polygon network."
      })
      setTimeout(() => {
        setTransactionStatus(INITIAL_STATUS)
        router.push(`/profile/${user._id}?tab=created`);
      }, 3000)
      // console.log(createdNFT)
      // route to profile - created tab
    }
    catch (error) {
      console.log(error);
      setTransactionStatus({
        status: 'error',
        title: 'Transaction failed',
        description: "Your transaction is failed while processing in the Polygon network."
      })
      setTimeout(() => {
        setTransactionStatus(INITIAL_STATUS)
      }, 3000)
      // Display
    }

  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleProfileChange,
  });

  return (
    <PageTransition>
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
      <div className="relative -z-10 ">
        <Image
          src="/profile_bg.svg"
          alt="Your Alt Text"
          width={100}
          height={100}
          className="w-full h-[300px] object-cover -mt-8 "
        />
        <div className="absolute z-10 inset-0 bg-gradient-to-t from-forground to-forground/50"></div>
      </div>
      <div className=" mx-auto flex md:w-4/5 w-11/12 flex-col  items-start md:-mt-48 -mt-64 z-40">
        <Loader isLoading={loader} />
        <div className="flex flex-row items-center justify-center">
          <IconButton onClick={() => Router.back()} >
            <ArrowBackOutlined fontSize="54" />
          </IconButton>
          <h1 className="md:text-2xl text-xl font-KronaOne">Create your asset</h1>
        </div>
        <Formik
          initialValues={{
            name: "",
            description: "",
            royalty: collection?.royaltyPercentage?.toString(),
            price: "",
            copies: 1
          }}
          validateOnChange
          enableReinitialize
          validateOnBlur
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleMint(values)
            // sendJsontoIPFS(values, imageUrl, fileFormat);
          }}
        >
          {({ values, errors, touched }) => {
            return (
              <Form className="grid grid-cols-5 gap-20 items-start justify-center w-full font-sans">
                <div className="md:col-span-3 col-span-5">
                  {!imageBuffer ? (
                    <div
                      {...getRootProps()}
                      className="mt-8 flex w-full flex-col items-center backdrop-blur-md hover:bg-white/10 transition-all justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/5 p-10 cursor-pointer "
                    >
                      <input accept="image/png" {...getInputProps()} aria-required aria-errormessage="Asset is required!" />
                      <DocumentUpload />
                      <p className="mt-4 text-white">
                        {isDragActive
                          ? "Drop your asset here"
                          : "Drag and drop your asset"}
                      </p>
                      <span className="text-white/40">
                        JPEG, PNG, GIF, MP4 max 50 MB
                      </span>
                    </div>
                  ) : (
                    <div className="col-span-2 ">
                      <div className="relative rounded-xl overflow-hidden mt-4">
                        {/* {fileFormat === "mp4" ||
                        fileFormat === "mov" ||
                        fileFormat === "webm" ? (
                        <video
                          playsInline
                          loop
                          preload="auto"
                          muted
                          autoPlay
                          poster="/image_loader.gif"
                          width={500}
                          height={500}
                          className="h-[500px] object-fill bg-white/10"
                        >
                          <source src={imageUrl} type={`video/${fileFormat}`} />
                        </video>
                      ) : ( */}
                        <Image
                          loading="lazy"
                          src={imageBuffer}
                          alt="img"
                          blurDataURL="/dummyAvatar.png"
                          placeholder="blur"
                          width={500}
                          height={500}
                          className="h-[500px] object-cover bg-white/10 w-full"
                        />
                        {/* )} */}
                        {allCategories.filter((c) => c.id === category)?.length ? (
                          <div className="px-3 py-1 top-4 left-4 absolute bg-black/40 backdrop-blur-xl rounded-lg">
                            {
                              allCategories.filter((c) => c.id === category)?.[0]
                                ?.categoryName
                            }
                          </div>
                        ) : (
                          <></>
                        )}
                        <IconButton
                          className="top-4 right-4 absolute backdrop-blur-xl rounded-lg text-lg bg-black/10 border-2 border-white/80"
                          onClick={() => setImageBuffer("")}
                        >
                          <Close />
                        </IconButton>
                        {/* {values?.name?.length ? (
                        <div className="flex absolute bottom-0 bg-black/60 backdrop-blur-lg p-4 flex-col w-full">
                          <div className="flex flex-row items-center justify-between">
                            <span className="font-bold text-lg w-4/5 truncate">
                              {values?.name}
                            </span>
                            <div className="flex flex-row items-center">
                              <span className="text-sm">
                                {CollectionList[collection]?.title}
                              </span>
                              <CheckCircle className="text-yellow-500 w-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )} */}
                      </div>
                    </div>
                  )}
                  <div className="mt-6 flex w-full flex-col">
                    <label htmlFor="name">Asset name</label>
                    <Field
                      name="name"
                      id="name"
                      type="text"
                      placeholder="enter asset name"
                      className="mt-2 rounded-xl bg-white/5 p-4"
                    />
                    <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                      <ErrorMessage name="name" />
                    </p>
                  </div>
                  <div className="mt-6 flex w-full flex-col">
                    <label htmlFor="description">Description</label>
                    <Field
                      name="description"
                      id="description"
                      type="text"
                      placeholder="enter your description"
                      className="mt-2 rounded-xl bg-white/5 p-4"
                      rows={4}
                    />
                    <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                      <ErrorMessage name="description" />
                    </p>
                  </div>
                  <div className="grid w-full md:grid-cols-2 grid-col-1 gap-4">
                    <div className="mt-6 flex w-full flex-col">
                      <label htmlFor="category">Category</label>
                      <select
                        name="category"
                        className="mt-2 rounded-xl bg-white/5 p-4"
                        style={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none" }}
                        onChange={(e) => {
                          setCategory(e.target.value);
                        }}
                      >
                        <option value="" style={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none", padding: "8px", backgroundColor: "black", marginTop: "4px" }} className="mt-2 rounded-xl bg-white/5 p-4 text-black" disabled>
                          Select your category
                        </option>
                        {allCategories.map((category) => (
                          <option key={category.categoryName} style={{ backgroundColor: "black", color: "white`", padding: "4px" }} value={category.id}>
                            {category.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-6 flex w-full flex-col">
                      <label htmlFor="royalty">
                        Royalty{" "}
                        <span className="text-sm opacity-60">
                          (taken from collection)
                        </span>
                      </label>
                      <Field
                        name="royalty"
                        id="royalty"
                        type="text"
                        placeholder="royalty"
                        value={collections?.length > 1 ? collection?.royaltyPercentage : ""}
                        disabled
                        className="mt-2 rounded-xl bg-white/5 p-4"
                      />
                      <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                        <ErrorMessage name="royalty" />
                      </p>
                    </div>
                  </div>
                  {/* <div className="mt-6 flex w-full flex-row justify-between">
                  <div className="flex flex-col items-start">
                    <label htmlFor="collection">Free Minting</label>
                    <p className="font-sans text-sm opacity-60">
                      Buyer will pay gas fees for minting
                    </p>
                  </div>
                  <Switch checked />
                </div> */}
                  {/* <div className="mt-6 flex w-full flex-row justify-between">
                  <div className="flex flex-col items-start">
                    <label htmlFor="collection">Put on marketplace</label>
                    <p className="font-sans text-sm opacity-60">
                      You’ll receive bids on this item
                    </p>
                  </div>
                  <Switch onChange={() => setIsSales(!isSales)} checked={isSales} />
                </div> */}

                  {/* {isSales ? (
                  <div className="relative mt-6 flex w-full flex-col">
                    <label htmlFor="link">Price</label>
                    <input
                      name="price"
                      id="price"
                      type="text"
                      placeholder="enter your price"
                      className="mt-2 rounded-xl bg-white/5 p-4"
                    />
                     <select
                      name="collection"
                      className="absolute right-0 bottom-0 w-32 rounded-xl bg-gray-900 p-4 outline-none"
                    >
                      <option value="" disabled>
                        select your category
                      </option>
                      <option value="inocyx">ETH</option>
                      <option value="inocyx">INOCYX</option>
                    </select> 
                  </div> */}
                  <div className="mt-6 flex w-full flex-col">
                    <label htmlFor="price">Price</label>
                    <Field
                      name="price"
                      id="price"
                      type="text"
                      placeholder="enter the price"
                      className="mt-2 rounded-xl bg-white/5 p-4"
                      rows={4}
                    />
                    <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                      <ErrorMessage name="price" />
                    </p>
                  </div>
                  {nftType === 'erc1155' && <div className="mt-6 flex w-full flex-col">
                    <label htmlFor="copies">Copies</label>
                    <Field
                      name="copies"
                      id="copies"
                      type="text"
                      placeholder="enter copies count"
                      className="mt-2 rounded-xl bg-white/5 p-4"
                      rows={4}
                    />
                    <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                      <ErrorMessage name="copies" />
                    </p>
                  </div>}
                  <div className="mt-6 flex w-full flex-col items-start">
                    <p>Choose Collection</p>
                    <div className="mt-4 flex flex-row items-center w-full flex-nowrap overflow-x-auto gap-4 self-start">
                      {collections?.map((current, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            if (current?._id === 0) {
                              setShowCreateCollection(true)
                            } else {
                              setCollection(current)
                            }
                          }
                          }
                          className={`flex ${current?._id === collection?._id
                            ? "border-2 border-primary"
                            : "border-2 border-transparent"
                            } min-w-max max-h-min overflow-hidden cursor-pointer flex-col items-center rounded-2xl bg-white/10 p-4 hover:bg-white/20`}
                        >
                          <div className="mb-2 w-16 h-16 rounded-full flex items-center justify-center bg-primary/20 p-2 text-primary">
                            {current?._id === 0 ? current?.imageURL : <Image src={current?.imageURL} alt="img" width={100} height={100} className="w-full h-[100%] rounded-full object-fill" />}
                          </div>
                          <p>{current?.name}</p>
                        </div>
                      ))}

                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loader || !imageObj || collection?.creatorAddress?.toLowerCase() !== address?.toLowerCase()}
                    className="mt-8 w-1/2 rounded-xl btn-gradient text-white px-6 py-3"
                  >
                    {loader ? <CircularProgress /> : "Submit"}
                  </Button>
                </div>
                <div className={`md:col-span-2 md:block hidden ${imageBuffer ? "sticky top-20" : ""}`}>
                  {!imageBuffer ? (
                    <div
                      className="mt-8 flex w-full h-[500px] flex-col items-center backdrop-blur-md transition-all justify-center rounded-xl border-2 border-white/10 p-10"
                    >
                      {/* <DocumentUpload size={36} /> */}
                      <span className="text-white/40 mt-2">
                        Upload file and choose collection to preview
                      </span>
                    </div>
                  ) : (
                    <div className="col-span-2 bg-white/5 p-4 rounded-xl w-4/5 ">
                      <div className="relative rounded-xl overflow-hidden">
                        {/* {fileFormat === "mp4" ||
                          fileFormat === "mov" ||
                          fileFormat === "webm" ? (
                          <video
                            playsInline
                            loop
                            preload="auto"
                            muted
                            autoPlay
                            poster="/image_loader.gif"
                            width={500}
                            height={500}
                            className="h-[500px] object-fill bg-white/10"
                          >
                            <source src={imageUrl} type={`video/${fileFormat}`} />
                          </video>
                        ) : ( */}
                        <Image
                          loading="lazy"
                          src={imageBuffer}
                          alt="img"
                          blurDataURL="/dummyAvatar.png"
                          placeholder="blur"
                          width={500}
                          height={500}
                          className="h-[400px] rounded-xl object-cover bg-white/10"
                        />
                        {/* )} */}
                        {allCategories.filter((c) => c.id === category)?.length ? (
                          <div className="px-3 py-1 top-4 left-4 absolute bg-black/40 backdrop-blur-xl rounded-lg">
                            {
                              allCategories.filter((c) => c.id === category)?.[0]
                                ?.categoryName
                            }
                          </div>
                        ) : (
                          <></>
                        )}
                        {values.name?.length ? (
                          <div className="flex bg-backgroundf mt-2 backdrop-blur-lg p-4 flex-col w-full">
                            <div className="flex flex-col items-start justify-between">
                              <span className="font-bold text-lg w-4/5 truncate">
                                {values?.name}
                              </span>
                              <span className="text-md opacity-60 w-4/5 truncate">
                                {values?.description}
                              </span>
                            </div>
                            <div className="flex flex-row items-center">
                              {/* <span className="text-sm">
                                  {CollectionList[collection]?.title}
                                </span> */}
                              {/* <CheckCircle className="text-yellow-500 w-4 ml-1" /> */}
                            </div>
                            {/* <span className='text-sm opacity-80 mt-1 break-words ' >{values?.description}</span> */}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>

        <Modal open={showCreateCollection} backdropClosable={false} handleClose={() => { setShowCreateCollection(!showCreateCollection); setTimeout(() => { getCollections(); }, 10000) }} >
          <CreateCollection nftType={nftType} setTransactionStatus={setTransactionStatus} setInfo={setInfo} setShowCreateCollection={setShowCreateCollection} />
        </Modal>

      </div>
    </PageTransition>
  );
};

export default CreateAsset;
