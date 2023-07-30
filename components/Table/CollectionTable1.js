import React from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import EastIcon from "@mui/icons-material/East";
import { ButtonBase } from "@mui/material";

const CollectionTable = ({ collection_data }) => {
  // const collection_data = [
  //   {
  //     image_url: "/avatar.svg",
  //     collection_name: "Bored Ape Yacht CLub",
  //     floor_price: "3.20ETH",
  //     volume: "456ETH",
  //     sales: "321",
  //   },
  //   {
  //     image_url: "/avatar.svg",
  //     collection_name: "Bored Ape Yacht CLub",
  //     floor_price: "3.20ETH",
  //     volume: "456ETH",
  //     sales: "321",
  //   },
  //   {
  //     image_url: "/avatar.svg",
  //     collection_name: "Bored Ape Yacht CLub",
  //     floor_price: "3.20ETH",
  //     volume: "456ETH",
  //     sales: "321",
  //   },
  // ];
  return (
    <div className="flex flex-col mb-10 mx-auto items-start w-full min-h-full ">
      <div className="grid grid-row-2  gap-4 w-full px-2 md:overflow-hidden overflow-scroll md:h-auto h-[80vh]">
        <div className="grid  mt-10 w-full gap-4 md:grid grid-cols-4  md:grid-flow-col grid-flow-row md:auto-cols-fr auto-rows-fr md:place-items-start">
          <div className="md:pl-10  grid  pl-0 col-span-2">Collection Name</div>
          <div className="">Floor Price</div>
          <div className="">Volume</div>
          <div className="">Sales</div>
        </div>
        <div className="grid">
          <div className="flex flex-col gap-5 ">
            {collection_data.map((collection_val) => (
              <Link href={`/collections/${collection_val.collectionID}`} className="w-full">
                <ButtonBase className="rounded-lg w-full" >
                  <div className="md:py-5 md:px-0 px-6 py-6 rounded-lg hover:bg-white/10 bg-white/5 border-[1px] border-white/10 gap-4 md:grid-flow-col grid-flow-row md:auto-cols-fr auto-rows-fr  grid md:grid-cols-4 md:grid-rows-1   md:place-items-start  md:items-center items-center w-full  backdrop-filter backdrop-blur-lg ">
                    <div className="grid col-span-2">
                      <div className="flex flex-row gap-3 items-center md:pl-10 px-2  ">
                        <div className="p-1 rounded-full bg-gradient-to-r from-[#06d1f8] to-[#de179e]">
                          <Image
                            src={collection_val.collectionimageURL}
                            alt="itemImage"
                            width={36}
                            height={36}
                            className="w-12 h-12 rounded-full"
                          />
                        </div>
                        <div className="font-inter font-medium md:text-2xl text-lg  flex flex-row md:items-center  ">
                          <p className="truncate text-lg max-w-12 text-clip">
                            {" "}
                            {collection_val.collectionName}
                          </p>
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
                    </div>

                    <div className=" grid font-Inter font-medium md:pl-0 pl-24  ">
                      <span>{collection_val.floorPrice}</span>
                    </div>
                    <div className="grid font-Inter font-medium md:pl-0 pl-24 ">
                      {collection_val.volume}
                    </div>
                    <div className="grid font-Inter font-medium md:pl-0 pl-24 ">
                      {collection_val.owners}
                    </div>
                  </div>
                </ButtonBase>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionTable;
