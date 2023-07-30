import React from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Button } from "@mui/material";
import { ConnectKitButton } from "connectkit";

const Beforeconnect = () => {
  return (
    <div className="w-full bg-background border-b-[1px] border-white/10 ">
      <div className="bg-background border-white/10 w-full">
        <ConnectKitButton.Custom>
          {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
            return <Button
              className="flex w-11/12 mx-auto rounded-lg items-center cursor-pointer bg-[#5C87D4]  text-white px-8 py-3 mt-1 my-2"
              onClick={show}
            >
              <AccountBalanceWalletOutlinedIcon />
              <span className="font-inter ml-2 text-sm font-bold">Connect Wallet</span>
            </Button>
          }}
        </ConnectKitButton.Custom>
      </div>

    </div>

  );
};

export default Beforeconnect;
