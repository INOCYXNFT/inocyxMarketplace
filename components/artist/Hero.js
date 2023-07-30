import React, { useState, useEffect } from "react"
import NextErrorComponent from "next/error"
import Timer from "../core/Timer"
import { LIMITED_TIME } from "../../contracts/Addresses"
import LimitedTimeABI from "../../contracts/LimitedTimeNFT_ABI.json"
import { ethers } from "ethers"
import moment from "moment"
import { POLYGON_MUMBAI_RPC } from "../../constants"

const Hero = ({ celebrityData }) => {
    const [date, setDate] = useState(null)

    async function openTime() {
        const RpcProvider = new ethers.providers.JsonRpcProvider(
            POLYGON_MUMBAI_RPC
        );
        let limitedTimeRead = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, RpcProvider); // 
        let timeAsync = await limitedTimeRead.callStatic.mintEndTime()
        let Eventdate = parseInt(timeAsync);

        let date = new Date(moment.unix(Eventdate));
        setDate(date.getTime())
    }

    useEffect(() => {
        openTime()
    }, [])
    return <div className="w-full h-[100vh] overflow-hidden flex flex-col items-center justify-center " >
        <div className="z-10 flex flex-col items-center justify-center w-4/5" >
            <h1 className="font-bold text-3xl md:text-6xl w-full md:w-2/3 text-center font-blackOps " >{celebrityData?.name}</h1>
            <p className="md:w-1/2 w-full text-lg md:text-2xl mt-4 mb-10 text-center text-white" >{celebrityData?.description}</p>
            <Timer date={date} />
        </div>
        <video
            playsInline
            loop
            preload="auto"
            muted
            autoPlay
            poster={celebrityData?.banner}
            className="w-full object-cover z-0 h-[100vh] absolute opacity-20 "
        >
            <source src="https://decentraland.org/static/scenes4-576941eeec2aa15935ebcf45cc3c739c.webm" type="video/webm" />
        </video>
    </div>
}

export default Hero