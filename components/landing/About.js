import React from "react";
import Image from "next/image";
import Link from "next/link";

const About = () => {
  const ABOUT_DETAILS = [
    {
      image: "/article1.svg",
      title: "Connect to Wallet",
      desciption:
        " “Connect” on the right top - Connect with MetaMask- Sign in your account- Wallet connect.",
    },
    {
      image: "/article2.svg",
      title: "Explore Marketplace",
      desciption:
        "It’s a virtual shopping place for buying and selling NFTs with smart contracts in integrated digital wallets.",
    },
    {
      image: "/article3.svg",
      title: "Buy or Sell NFTs",
      desciption:
        "You can specify the price and set them up in live auctions. Buyers can view and purchase by proposing their prices in a user-friendly way and safely.",
    },
  ];
  return (
    <div className="  flex md:flex-row flex-col gap-5 md:items-center items-start mx-auto  bg-white/1 justify-between md:mt-0 md:mb-0 mt-44 mb-20">
      {ABOUT_DETAILS.map((item,index) => (
        <div
          key={item.image}
          className="md:w-1/4 w-full items-center md:mt-44 justify-center flex flex-col  mt-32"
        >
          <div className="px-6 pt-6 pb-4 bg-white/10 rounded-lg"
          >
            <Image
              src={item.image}
              alt="itemImage"
              className="w-full h-auto"
              width={50}
              height={50}
            />
          </div>
          <span className="font-normal font-KronaOne mt-5 text-center md:text-2xl text-xl">
            {item.title}
          </span>
          <span className="md:text-lg text-md opacity-60 text-center mt-2 font-inter font-medium">
            {item.desciption}
          </span>
        </div>
      ))}
    </div>
  );
};

export default About;
