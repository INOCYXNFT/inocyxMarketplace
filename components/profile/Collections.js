import { ButtonBase } from "@mui/material"
import { SearchNormal } from "iconsax-react"

import Image from "next/image"
import EmptyState from "../core/EmptyState"
import Link from "next/link";
export default function Collections({ data }) {
    const key = 'collectionID';
    const arrayUniqueByKey = [...new Map(data.map(item =>
        [item[key], item])).values()];

    return (
        <div className="flex flex-col items-start gap-4">
            {/* <div className="flex flex-row w-1/4 bg-transparent relative hover:border-white/20 rounded-full border-[1px] border-white/10 outline-none " >
                <input placeholder={`Search by collections`} className="p-3 bg-transparent rounded-full px-6 w-full transition-all focus:outline-transparent" />
                <SearchNormal size="18" className="mr-10 outline-primary absolute -right-5 top-4" />
            </div> */}
            {arrayUniqueByKey?.length === 0 ? <EmptyState description="No collections to show" /> :
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full" >
                    {arrayUniqueByKey?.map((collection) => {
                        // let collectionInfo = collection?.nft?.collectionDetails;
                        return <ButtonBase className="rounded-xl">
                            <Link href={`/collections/${collection?.collectionID}`} className="w-full">
                                < div className="flex flex-col items-center justify-center p-3 gap-8 border-[1px] hover:border-white/20 border-white/10 w-full rounded-xl" >
                                    <div className="w-full h-[180px] relative" >
                                        <Image src={collection?.banner} alt="banner" className="h-[100%] w-full rounded-xl object-cover" width={100} height={600} />
                                        <Image src={collection?.imageURL} alt="image" className="h-12 w-12 absolute left-4 -bottom-5 border-[1px] border-white/20 rounded-xl object-cover " width={100} height={600} />
                                    </div>
                                    <div className="flex flex-row gap-1 justify-between w-11/12 mx-auto font-sans ">
                                        <div className="flex flex-col items-start">
                                            <p className="font-semibold" >{collection?.name}</p>
                                            <p className="opacity-60">{collection?.owners} owners</p>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <p className="font-semibold whitespace-nowrap" >Total Volume</p>
                                            <p className="opacity-60">{collection?.volume} IYX</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </ButtonBase>
                    })}
                </div>
            }
        </div>
    )
}