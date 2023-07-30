import { ButtonBase } from "@mui/material";
import { Ethereum, Eye, Global, Polygon, Hex } from "iconsax-react";
import Link from "next/link";
import { TRANSACTION_ENDPOINT } from "../../constants";

export default function Overview({ nft }) {
    return (
        <div className="flex flex-col items-start w-full gap-4" >
            <div className="flex flex-col items-start gap-2" >
                <p className="font-semibold text-xl font-sans">Description</p>
                <p className="opacity-60 font-sans">{nft?.itemDescription}</p>
            </div>
            <div className="w-full border-[1px] border-white/10 flex flex-col rounded-xl gap-2 p-4" >
                <ButtonBase disabled className="p-3 rounded-xl self-start">
                    <div className="flex flex-row items-start self-start gap-2" >
                        <Polygon />
                        <p className="font-sans" >Polygon</p>
                    </div>
                </ButtonBase>
                {nft.nftType ? <ButtonBase disabled className="p-3 rounded-xl self-start">
                    <div className="flex flex-row items-start self-start gap-2" >
                        <Hex />
                        <p className="font-sans" >{nft.nftType?.toUpperCase()}</p>
                    </div>
                </ButtonBase> : null}
                <Link href={`${TRANSACTION_ENDPOINT}/address/${nft?.collectionDetails?.collectionAddress}`} target="_blank" >
                    <ButtonBase className="p-3 rounded-xl self-start">
                        <div className="flex flex-row items-center gap-2" >
                            <Global />
                            <p className="font-sans" >View on Polygon Scan</p>
                        </div>
                    </ButtonBase>
                </Link>
                <Link href={nft?.metaDataURL} target="_blank" >
                    <ButtonBase className="p-3 rounded-xl self-start">
                        <div className="flex flex-row items-center gap-2" >
                            <Eye />
                            <p className="font-sans" >Open Metadata</p>
                        </div>
                    </ButtonBase>
                </Link>
            </div>
        </div>
    )
}