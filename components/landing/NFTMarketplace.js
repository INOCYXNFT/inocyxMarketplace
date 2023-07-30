import Image from "next/image"
const NFTMarketplace = () => {
    return <div className="flex flex-col items-center justify-around h-[80vh] w-4/5 mx-auto" id="nft" >
        <div className="flex flex-col items-center justify-center" >
        <h1 className="font-bold text-yellow-400 text-6xl" >NFT Marketplace</h1>
            <p className="w-4/5 text-lg mt-6 text-center text-white " >It is a digital world, which lively represent us the moments of different places and it helps enhance the real-world operating computer-generated perceptual information. It is the newest macro-goal for many of the world&pos;s tech giants</p>
        </div>
        <Image alt="img" src="/nft_landing.png" className="-mt-10" />
    </div>
}

export default NFTMarketplace