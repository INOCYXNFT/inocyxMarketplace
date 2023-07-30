import React, { useState, useEffect } from 'react'
import Image from "next/image"
import { isMobileChecker, truncateAddress } from "../../utility";
import Modal from "../../components/core/Modal";
import { getNFTByID, getUserDetails } from "../../apollo/api/query";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Menu, MenuItem } from '@mui/material';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CopyContent from "../../components/core/CopyContent";
import client from "../../apollo/apolloClient";
import { ButtonBase } from '@mui/material';

const ShareDetails = ({ nft, shareModal, setShareModal }) => {
  // const [shareModal, setShareModal] = useState(false);
  // const [nft, setNft] = useState(null);
  // const [walletAddress, setWalletAddress] = useState("");
  // const [loader, setLoader] = useState(false);
  // const { address } = useAccount();
  // const account = address;
  // const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = router.query.id;

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

  // useEffect(() => {
  //   setLoader(true);
  //   if (router?.query?.id) {
  //     const myAddress = window.localStorage.getItem("walletAddress");
  //     setWalletAddress(myAddress);
  //     client
  //       .query({
  //         query: getNFTByID,
  //         variables: {
  //           uniqueID: router.query.id,
  //         },
  //       })
  //       .then(async (result) => {
  //         setNft(result?.data?.getNFTByID);
  //         client
  //           .query({
  //             query: getUserDetails,
  //             variables: {
  //               walletAddress: result?.data?.getNFTByID?.ownerAddress,
  //             },
  //           })
  //           .then((result) => {
  //             setUserDetails(result?.data?.getUser);
  //           })
  //           .catch((e) => {
  //             // console.log(e);
  //           });
  //         const property = await fetch(result?.data?.getNFTByID?.metaDataURL)
  //           .then((res) => res.json())
  //           .then((data) => data);
  //         setLoader(false);
  //         setProperties(property?.properties ?? property?.attributes);
  //       })
  //       .catch((e) => {
  //         setLoader(false);
  //       });
  //   }
  // }, [id, router]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Modal open={shareModal} handleClose={setShareModal}>
      <div className="z-50 flex w-1/3 flex-col items-center justify-center rounded-xl bg-background p-8 transition-all ">
        <p className="mb-4 w-full border-b-2 border-white/10 p-2 text-lg font-bold font-inter">
          Share {nft?.itemName}
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
                src={nft?.itemImage}
                type={`video/${nft?.assetFormat}`}
              />
            </video>
          ) : (
            <Image
              src={nft?.itemImage}
              blurDataURL="/dummyAvatar.png"
              placeholder="blur"
              width={20}
              height={20}
              alt="img"
              className="h-20 w-20"
            />
          )}
          <div className="ml-4">
            <p className="text-2xl font-bold ">{nft?.itemName}</p>
            <p className="text-sm opacity-50 ">
              by {truncateAddress(nft?.ownerAddress)}
            </p>
          </div>
        </div>
        <div className="my-2 flex w-1/2 flex-row items-center justify-evenly">
          <div
            className="mx-2 cursor-pointer rounded-lg bg-black/40 p-4 text-white hover:bg-primary hover:text-black"
            onClick={() => handleShare("facebook")}
          >
            <FacebookIcon />
          </div>
          <div
            className="mx-2 cursor-pointer rounded-lg bg-black/40 p-4 text-white hover:bg-primary hover:text-black"
            onClick={() => handleShare("twitter")}
          >
            <TwitterIcon />
          </div>
          <div
            className="mx-2 cursor-pointer rounded-lg bg-black/40 p-4 text-white hover:bg-primary hover:text-black"
            onClick={() => handleShare("whatsapp")}
          >
            <WhatsAppIcon />
          </div>
          <div
            className="mx-2 cursor-pointer rounded-lg bg-black/40 p-4 text-white hover:bg-primary hover:text-black"
            onClick={() => handleShare("linkedin")}
          >
            <LinkedInIcon />
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col items-center justify-center md:flex-row">
          <div className="font-oswaldregular w-96 truncate rounded-xl bg-black/40 p-3 text-white">
            {window.location.href}
          </div>
          <CopyContent content="href" />
        </div>
      </div>
    </Modal>
  )
}

export default ShareDetails