import React, { memo, useState } from "react";
import { Facebook, Instagram, Twitter, YouTube } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import Modal from "./Modal";
import CreatedNFT from "../profile/CreateNFT";
import { ButtonBase } from "@mui/material";

function Footer() {
  const [showChooseType, setShowChooseType] = useState(false);
  return (
    <footer className="p-4 flex flex-col items-center justify-center w-full bg-black/60" >
      <div className="flex md:flex-row flex-col items-center md:items-start lg:items-start w-11/12 mt-10 justify-center md:justify-between lg:justify-between">
        <div className="flex flex-col items-center md:items-start lg:items-start">
          <Image
            src="/inocyx.png"
            alt="Logo"
            // className="md:w-64 w-56 h-auto"
            width={160}
            height={40}
          />
          <span className="text-sm mt-2 w-5/6 md:w-4/5 lg:w-4/5 text-center md:text-left lg:text-left font-inter font-normal md:text-md">
            A new way to become a millionaire. The only limit of trading is your
            imagination.
          </span>
          <div className="flex w-full md:w-3/5 lg:w-3/5 items-center justify-around md:justify-start md:gap-4 mt-4 flex-row">
            <Link
              href="/"
              className="rounded-full border-[1px] border-white/10 hover:border-white/20 hover:bg-primary transition-all "
            >
              <div className="bg-white/10 p-2 rounded-full">
                <Facebook />
              </div>
            </Link>
            <Link
              href="/"
              className="rounded-full border-[1px] border-white/10 hover:border-white/20 hover:bg-primary transition-all  "
            >
              <div className="rounded-full bg-white/10 p-2">
                <Instagram />
              </div>
            </Link>
            <Link
              href="/"
              className="rounded-full border-[1px] border-white/10 hover:border-white/20 hover:bg-primary transition-all  "
            >
              <div className="rounded-full bg-white/10 p-2">
                <Twitter />
              </div>
            </Link>
            <Link
              href="/"
              className="rounded-full border-[1px] border-white/10 hover:border-white/20 hover:bg-primary transition-all  "
            >
              <div className="rounded-full bg-white/10 p-2">
                <YouTube />
              </div>
            </Link>

          </div>
        </div>
        <div className="flex flex-col gap-5 mt-2 md:flex-row w-full justify-center lg:justify-between md:w-1/2 lg:w-11/12 flex-wrap">
          <div className="flex flex-col items-center lg:items-start m-0 md:mt-0 lg:mt-8 lg:mr-10 md:mr-0">
            <span className="text-xl leading-loose uppercase text-white my-2 font-inter font-medium">
              Resources
            </span>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2 font-inter font-normal"
              >
                About Us
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2 font-inter font-normal"
              >
                Blog
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Contact us
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Pricing
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Testimonials
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-start m-0 md:mt-0 lg:mt-8 lg:mr-10 md:mr-0">
            <span className="text-xl leading-loose uppercase text-white my-2 font-inter font-medium">
              Marketplace
            </span>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <ButtonBase
                onClick={() => setShowChooseType(true)}
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Create
              </ButtonBase>
              <Link
                href="/discover"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Discover
              </Link>
              <Link
                href="/creator"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Creators
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Collectors
              </Link>
              <Link
                href="/maps"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Maps
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-start m-0 md:mt-0 lg:mt-8 lg:mr-10 md:mr-0">
            <span className="text-xl leading-loose uppercase text-white my-2 font-inter font-medium">
              Company
            </span>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Help Center
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Terms of Service
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Legal
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Privacy Policy
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Status
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center lg:items-start m-0 md:mt-0 lg:mt-8 lg:mr-10 md:mr-0">
            <span className="text-xl leading-loose uppercase text-white my-2 font-inter font-medium">
              Reach Us
            </span>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Help Center
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Terms of Service
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Legal
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Privacy Policy
              </Link>
              <Link
                href="/"
                className="text-base md:text-sm cursor-pointer hover:underline mt-2  font-inter font-normal"
              >
                Status
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Modal open={showChooseType} backdropClosable={false} handleClose={() => setShowChooseType(false)}>
        <CreatedNFT />
      </Modal>
    </footer>
  );
}

export default memo(Footer);
