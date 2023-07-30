import React from "react";
import { truncateAddress } from "../../utility";
import CopyContent from "./CopyContent";
import Image from "next/image";
import { useDisconnect } from "wagmi";
import Disconnect from "@mui/icons-material/PowerSettingsNew";
import Router from "next/router";

const Afterconnect = ({ account }) => {
  const { disconnectAsync } = useDisconnect();
  return (
    <div className="w-full">
      <div className="flex flex-row items-center px-6 py-3 bg-background border-white/10 w-full justify-between hover:brightness-200 ">
        <div className="bg-white/10 flex flex-row justify-between items-center w-full px-3 py-2 rounded-lg">
          <div className="flex items-start">
            <div className="flex items-center">
              <Image
                className="w-12 h-12 "
                alt="inocyx_logo"
                src="/polygon.svg"
                width={100}
                height={100}
              />
              <div className="flex flex-col items-start truncate">
                <span className="font-inter ml-4 text-sm truncate font-normal ">
                  {account ? truncateAddress(account) : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-end">
            <div className="flex flex-row items-center">
              <CopyContent content={account} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-row items-center px-6 py-2 border-b-[1px] bg-background border-white/10 w-full justify-start hover:brightness-200 cursor-pointer"
        onClick={() => disconnectAsync()}
      >
        <div className="py-2 px-3  ">
          <Disconnect className="w-8 h-8" />
        </div>
        <span className="font-inter ml-2 text-md">Disconnect Wallet</span>
      </div>
    </div>
  );
};

export default Afterconnect;
