import { Avatar, ButtonBase } from "@mui/material";
import { truncateAddress } from "../../utility";
import EmptyState from "../core/EmptyState";

export default function Sales({ nfts, handleBuy, handleCancel }) {

    const user = JSON.parse(localStorage.getItem('metadata'));
    function handleClick(asset) {
        if (user?._id === asset?.seller?._id) {
            handleCancel(asset)
        } else {
            handleBuy(asset)
        }
    }

    return (
        <div className="flex flex-col border-[1px] border-white/10 p-4 md:p-6 w-full rounded-xl gap-8">
            {nfts?.length === 0 ?
                <EmptyState description="No NFTs for Sales" /> :
                nfts?.map((nft) => (
                    <div className="flex flex-row items-center justify-between w-full" >
                        <div className="flex flex-row items-center gap-2" >
                            <Avatar />
                            <div className="flex flex-col items-start">
                                <p>{nft?.seller?.displayName}</p>
                                <p className="text-sm flex gap-1">
                                    <span className="opacity-60">{nft?.quantity} edition listed for</span>
                                    <span>{nft?.price}</span>
                                    <span className="opacity-60">IYX</span>
                                </p>
                            </div>
                        </div>
                        <ButtonBase className="rounded-full" onClick={() => handleClick(nft)} >
                            <button className="px-4 py-2 border-[1px] border-white/10 font-sans rounded-full">
                                {user?._id === nft?.seller?._id ? "Cancel" : "Buy now"}
                            </button>
                        </ButtonBase>
                    </div>
                ))}
        </div>
    )
}