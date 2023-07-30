import React from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import EastIcon from "@mui/icons-material/East";
import EmptyState from "../core/EmptyState";

const CollectionTable = () => {
  const collection_data = [];
  console.log(collection_data.length)
  return (
    <div className="relative  flex flex-col w-11/12 mb-10 mx-auto items-start ">
      <div className="flex flex-row items-center w-full">
        <span className="md:text-5xl text-lg font-normal font-KronaOne self-center  p-3 ">
          Top Collections
        </span>

        <Link href="/collections">
          <div className="flex flex-row gap-1 items-center">
            <button className="px-4 py-2 rounded-lg text-white hover:text-white text-lg font-mulish">
              View all
            </button>
            <svg width={0} height={0}>
              <linearGradient id="linearColors" x1={1} y1={0} x2={1} y2={1}>
                <stop offset={0} stopColor="rgba(6, 209, 248, 1)" />
                <stop offset={1} stopColor="rgba(222, 23, 158, 1)" />
              </linearGradient>
            </svg>

            <EastIcon
              sx={{ fill: "url(#linearColors)" }}
              className="text-white text-2xl animate-bounce"
            />
          </div>
        </Link>
      </div>
      {collection_data?.length > 0 ?
        <div className="grid grid-row-2  gap-4 w-full px-2 md:overflow-hidden overflow-scroll md:h-auto h-[80vh]">
          <div className="grid  mt-10 w-full gap-4 md:grid grid-cols-4  md:grid-flow-col grid-flow-row md:auto-cols-fr auto-rows-fr md:place-items-start">
            <div className="md:pl-10  grid  pl-0 col-span-2">Collection Name</div>
            <div className="">Floor Price</div>
            <div className="">Volume</div>
            <div className="">Sales</div>
          </div>
          <div className="grid">
            <div className="flex flex-col gap-10 ">
              {collection_data.map((collection_val) => (
                <div className="md:py-5 md:px-0 px-6 py-6 rounded-lg bg-gray-200/10 border-[1px] border-white/30 gap-4 md:grid-flow-col grid-flow-row md:auto-cols-fr auto-rows-fr  grid md:grid-cols-4 md:grid-rows-1   md:place-items-start  md:items-center items-center w-full  backdrop-filter backdrop-blur-lg ">
                  <div className="grid col-span-2">
                    <div className="flex flex-row gap-3 items-center md:pl-10 px-2  ">
                      <div className="p-1.5 rounded-full bg-gradient-to-r from-[#06d1f8] to-[#de179e]">
                        <Image
                          src={collection_val.image_url}
                          alt="itemImage"
                          width={64}
                          height={64}
                          className=" "
                        />
                      </div>
                      <div className="font-inter font-medium md:text-2xl text-lg  flex flex-row md:items-center  ">
                        <p className="truncate max-w-12 text-clip">
                          {" "}
                          {collection_val.collection_name}
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
                    <span>{collection_val.floor_price}</span>
                  </div>
                  <div className="grid font-Inter font-medium md:pl-0 pl-24 ">
                    {collection_val.volume}
                  </div>
                  <div className="grid font-Inter font-medium md:pl-0 pl-24 ">
                    {collection_val.sales}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> : <div className="w-full flex items-center justify-center bg-white" >
          <EmptyState description="No artists to show" />
        </div>}
    </div>
  );
};

export default CollectionTable;
