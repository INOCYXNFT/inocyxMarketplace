import { Button } from "@mui/material"
import Image from "next/image"
import { useState, useEffect } from "react"
import moment from "moment"

import { LIMITED_TIME } from "../../contracts/Addresses"
import LimitedTimeABI from "../../contracts/LimitedTimeNFT_ABI.json"
import { ethers } from "ethers"
import { POLYGON_MUMBAI_RPC } from "../../constants"

const NFTLanding = ({ dir, nft, setCopiesModal }) => {
    const [days, setDays] = useState()
    const [hours, setHours] = useState()
    const [minutes, setMinutes] = useState()
    const [seconds, setSeconds] = useState()
    const [isExpired, setIsExpired] = useState(null);

    async function openTime() {
        const RpcProvider = new ethers.providers.JsonRpcProvider(
            POLYGON_MUMBAI_RPC
        );
        let limitedTimeRead = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, RpcProvider); // 
        let timeAsync = await limitedTimeRead.callStatic.mintEndTime()

        let contractDate = parseInt(timeAsync._hex);

        let date = new Date(moment.unix(contractDate)).getTime();
        var x = setInterval(function () {
            var now = Date.now()
            var distance = date - now + 30

            if (distance < 0) {
                setIsExpired(true)
                return
            } else {
                setIsExpired(false)
            }


            var d = Math.floor(
                ((date - now) / (1000 * 3600 * 24))
            )

            var h = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            )
            var m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            var s = Math.floor((distance % (1000 * 60)) / 1000)

            setDays(d)
            setHours(h)
            setMinutes(m)
            setSeconds(s)

            if (distance < 0) {
                clearInterval(x)
            }
        }, 1000)
    }

    useEffect(() => {
        openTime()
    }, [])

    // userid, nftid, quantity, transactionHash
    // openTime()
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 w-11/12 gap-4 md:gap-10 mx-auto my-10 md:my-20 max-w-screen-2xl bg-white/10 p-4 md:p-8 rounded-xl " >
            <div className="md:col-span-2 col-span-1 w-full relative overflow-hidden" >
                <div className="absolute top-5 p-2 px-6 transform -skew-x-12 -ml-2 bg-primary font-blackOps"><p className="transform skew-x-12" >COLLECTION</p></div>
                <Image src={nft?.itemImage} alt="img" className="w-full object-cover md:h-[600px] h-[300px] rounded-xl" width={1000} height={500} />
            </div>
            <div className="md:col-span-3 col-span-1 gap-5 flex flex-col items-start justify-start" >
                <div className=" w-full pt-6" >
                    <p className=" font-KronaOne text-2xl md:text-4xl">{nft?.itemName}</p>
                    <p className="md:text-lg text-md mt-2 opacity-60">{nft?.itemDescription}</p>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-5 items-center gap-4 w-full" >
                    {/* <div className="border-[0.5px] border-white/20 bg-white/5 rounded-xl w-full p-4 flex flex-col col-span-1" >
                            <span className="text-md opacity-60">Auction starts on</span>
                            <span className="text-md font-bold">{new Date(parseInt(nft?.auctionStartsOn))?.toLocaleDateString()}</span>
                        </div> */}

                    <div className="border-[0.5px] border-white/20 bg-white/5 rounded-xl w-full p-4 flex flex-col col-span-2" >
                        <span className="text-md opacity-60">Price</span>
                        <span className="text-md font-bold">{nft?.mintPrice} <span className="text-sm opacity-50" >IYX</span></span>
                    </div>
                    {nft?.isOpenEdition ?
                        <div className="border-[0.5px] border-white/20 bg-white/5 rounded-xl w-full p-4 flex flex-col col-span-2" >
                            <span className="text-md opacity-60">End Time</span>
                            <span className="text-md font-bold">
                                {isExpired === null ? "Loading.." :
                                    isExpired === true ? "Expired" :
                                        `${days}D : ${hours}H : ${minutes}M : ${seconds}S`
                                }
                            </span>
                        </div> :
                        <div className="border-[0.5px] border-white/20 bg-white/5 rounded-xl w-full p-4 flex flex-col col-span-2" >
                            <span className="text-md opacity-60">Editions</span>
                            <span className="text-md font-bold">{nft?.tokenQty - nft?.soldQty}/{nft?.tokenQty}</span>
                        </div>}
                </div>


                {/* <div className=" w-full py-6" >
                    <p className=" font-KronaOne text-xl">What you get</p>
                    <p className="text-lg mt-2 opacity-60">{nft?.benefits}</p>
                </div> */}

                {nft?.isOpenEdition && isExpired ? null : <Button className="text-white border-2 btn-gradient p-4 mt-6 font-bold rounded-lg transition-all w-1/3" onClick={() => setCopiesModal(nft)} >
                    Mint
                </Button>}

            </div>
        </div>
    )
}

export default NFTLanding