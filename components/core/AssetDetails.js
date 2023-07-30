import React from 'react'
import Image from "next/image";
import ShareDetails from './ShareDetails';
import Link from 'next/link';

const AssetDetails = ({ nft, setReportModal, setBurnModal }) => {
  return (
    <div className='grid grid-cols-5 items-start gap-10 col-span-2'>
      <div className="flex flex-col justify-between  col-span-4">
        <div className="flex flex-col">
          <h2 className="text-5xl font-KronaOne font-normal">
            {nft?.itemName}
          </h2>
          <div className="relative flex flex-row justify-between py-5">
            <div className="flex flex-row items-center  ">
              <Link href={`/creator/${nft?.ownerAddress}`} className="flex flex-row items-center" >
                <Image
                  src="/rajini.svg"
                  alt="Background Image"
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8"
                />
                <span className="font-inter font-medium text-lg pl-2">
                  Inocyx
                </span>
              </Link>
              <Link href={`/collections/${nft?.collectionDetails?.collectionID}`} className="flex flex-row items-center mx-2  py-2  rounded-full ">
                <span className="px-4 py-2 text-sm font-inter font-normal bg-[#080702]/50 backdrop-filter backdrop-blur-sm flex  items-center rounded-3xl">
                  <Image
                    src="/tickcircle.svg"
                    alt="itemImage"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  {nft?.collectionDetails?.name}
                </span>
              </Link>
            </div>
          </div>
          <div>
            <p className="font-inter font-md text-lg text-justify opacity-60">
              {nft?.itemDescription}
            </p>
          </div>
          {/* <div className="flex flex-row gap-10 py-5">
            <div className="flex flex-col ">
              <div>
                <p className="text-white/50 text-lg font-inter font-normal">
                  Price
                </p>
                <div className="font-inter font-extrabold text-2xl ">
                  0.2ETH
                  <span className="font-inter font-normal text-white/50">
                    ($280)
                  </span>
                </div>
              </div>
            </div>
            <div>
                <Button className="text-center font-inter text-lg font-normal text-white btn-gradient px-8 py-3 rounded-lg">
                  Buy Now
                </Button>
            </div>
          </div> */}
          {/* <div className="relative flex flex-row justify-between">
            <div className="flex flex-row items-center  ">
              <GiQueenCrown className='text-[#FF9F00] text-xl' />
              <span className="font-inter font-medium text-lg pl-2 text-[#FF9F00]">
                8.00% Royalities
              </span>
            </div>
          </div> */}

          {/* <PropertyDetails /> */}

        </div>
      </div>
      <div className='col-span-1' >
        <ShareDetails setReportModal={setReportModal} setBurnModal={setBurnModal} />
      </div>

    </div>

  )
}

export default AssetDetails