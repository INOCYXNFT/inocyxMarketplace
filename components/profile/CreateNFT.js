import Link from "next/link";

export default function CreatedNFT() {

    return (
        <div className="bg-background md:w-fit lg:w-fit h-80 z-50 p-6 rounded-xl font-sans overflow-none">
            <div className="flex-col justify-center">
                <h2 className="font-bold text-xl">Choose your NFT type</h2>
                <div className="flex p-2 mt-2 align-middle gap-2 justify-around items-center">
                    <div className="border-2 border-gray-700 rounded-lg w-fit h-4/5 p-4 align-middle hover:border-primary">
                        <Link href="/create_asset?type=erc721" style={{ textDecoration: "none" }}>
                            <div className="w-40 p-4 flex flex-col gap-4 align-middle items-center justify-around">
                                <img src="/singleNFT.png" width={60}></img>
                                <h4 className="font-semibold text-lg text-center text-white">Single</h4>
                            </div>
                        </Link>
                    </div>
                    <div className="border-2 border-gray-700 rounded-lg w-fit h-4/5 p-4 align-middle hover:border-primary">
                        <Link href="/create_asset?type=erc1155" style={{ textDecoration: "none" }}>
                            <div className="w-40 p-4 flex flex-col gap-4 align-middle items-center justify-around">
                                <img src="/multipleNFT.png" width={60}></img>
                                <h4 className="font-semibold text-lg text-center text-white ">Multiple</h4>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}