import React, { useState } from "react";
import Image from "next/image"
import { ButtonBase, Chip, IconButton } from "@mui/material";
import { More, Refresh, Share } from "iconsax-react";
import Modal from "./Modal";
import { Fullscreen } from "@mui/icons-material";

const AssetImage = ({ nft, refreshPage, handleShareModel }) => {
  const [imageView, setImageView] = useState(false)
  return (
    <div className="md:col-span-8 col-span-12 overflow-y-scroll no-scroll"  >
      <div className="flex flex-col items-center justify-center gap-8 mx-auto w-11/12 md:w-full">
        <div className="w-full cursor-pointer group relative" onClick={() => setImageView(true)} >
          <Image
            src={nft.itemImage}
            alt="Your Alt Text"
            width={1000}
            height={1000}
            // blurDataURL=""
            // placeholder="blur"
            className="w-full md:h-[600px] h-[400px] object-cover rounded-xl col-span-1"
          />
          <ButtonBase className="group-hover:flex hidden absolute bottom-4 right-4 p-3 shadow-2xl bg-black/30 rounded-xl" >
            <Fullscreen />
          </ButtonBase>
        </div>
        <div className="flex flex-row gap-2 items-center " >
          <ButtonBase onClick={refreshPage} className="rounded-full" >
            <Chip icon={<Refresh />} clickable label="Refresh" />
          </ButtonBase>
          <ButtonBase className="rounded-full" onClick={() => handleShareModel()} >
            <Chip icon={<Share />} clickable label="Share" />
          </ButtonBase>
          {/* <IconButton className="bg-white/20 p-1" >
            <More />
          </IconButton> */}
        </div>

      </div>

      <Modal open={imageView} handleClose={() => setImageView(false)} >
        <Image
          src={nft.itemImage}
          alt="Your Alt Text"
          width={1000}
          height={1000}
          // blurDataURL=""
          // placeholder="blur"
          className="w-full h-full transform scale-50 object-contain "
        />
      </Modal>

    </div>
  );
};

export default AssetImage;
