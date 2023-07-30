import { Avatar, ButtonBase } from "@mui/material";
import { truncateAddress } from "../../utility";
import EmptyState from "../core/EmptyState";

export default function Bids() {
  return (
    <div className="flex flex-col border-[1px] border-white/10 p-4 md:p-6 w-full rounded-xl gap-8" >
      {/* {[1, 2, 3, 4, 5, 6].map(() => (
        < div className="flex flex-row items-center justify-between w-full" >
          <div className="flex flex-row items-center gap-2" >
            <Avatar />
            <div className="flex flex-col items-start">
              <p>{truncateAddress('0xonikdniisdijsfidjijsfi')}</p>
              <p className="text-sm opacity-60">sales listed for 10.23 each</p>
            </div>
          </div>
          <ButtonBase className="rounded-full">
            <button className="md:px-4 md:py-2 px-3 py-2 border-[1px] border-white/10 font-sans rounded-full">
              Buy now
            </button>
          </ButtonBase>
        </div>
      ))} */}
      <EmptyState description="Bids coming soon" />
    </div>
  )
}