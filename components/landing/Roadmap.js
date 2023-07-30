import Image from "next/image"
import {
    ChevronLeft,
    ChevronRight,
  } from "@mui/icons-material";

const data = [
    {
        id: 1,
        title: "February 2021",
        description: "product development phase started, and a dedicated team with immense knowledge of blockchain has started working to finish the product."
    },
    {
        id: 2,
        title: "October 2021",
        description: "Exchange live deployment done along with the exchange's own coin,IYX. "
    },
    {
        id: 3,
        title: "January 2022",
        description: "NFT for Marketplace, Celebrities, Space Science, and Metaverse conceptual module plans have been analysed."
    },
    {
        id: 4,
        title: "June 2022",
        description: "Development of NFT product has been started. "
    },
    {
        id: 5,
        title: "July 2022",
        description: "July celebrity NFT has been started."
    },
    {
        id: 6,
        title: "August 2022",
        description: "Creator Economy is stared."
    },
    {
        id: 7,
        title: "October 2022",
        description: "development of land nft has been started"
    },
    {
        id: 8,
        title: "November 2022",
        description: "NFT marketplace and Land NFT intro Launch in November"
    },
    {
        id: 9,
        title: "December 2022",
        description: "Land NFT launch on December, Tradable Land NFT and Billboards"
    },
    {
        id: 10,
        title: "January 2023",
        description: "celebrity NFT launching"
    },
    {
        id: 11,
        title: "February 2023",
        description: "Creator economy(Users can create and sell NFTs)"
    },
    {
        id: 12,
        title: "March 2023",
        description: "first quarter increasing bilingual support center in india"
    },
    {
        id: 13,
        title: "April 2023",
        description: "second quarter futures and margin trade to be introducing in exchange platform"
    },
    {
        id: 14,
        title: "May 2023",
        description: "Metaverse- Neurolink research module development will be initiated"
    },
    {
        id: 15,
        title: "June 2023",
        description: "users can explore the adventure activities in metaverse"
    },
    {
        id: 16,
        title: "October 2023",
        description: "land nft will be available to use as a metaverse like business activities."
    },
    {
        id: 17,
        title: "2025",
        description: "first quarter metaverse having best avatar and best interactions will be achieved."
    },
]

const Roadmap = () => {
    function slide(direction) {
        var container = document.getElementById("myroadmap");
        let scrollCompleted = 0;
        var slideVar = setInterval(function () {
            if (direction == "left") {
                container.scrollLeft -= 30;
            } else {
                container.scrollLeft += 30;
            }
            scrollCompleted += 10;
            if (scrollCompleted >= 100) {
                window.clearInterval(slideVar);
            }
        }, 20);
    }



    return (
        <div className="flex flex-col items-center justify-center w-full" id="roadmap">
            <h1 className="font-bold text-yellow-400 text-6xl" >Roadmap</h1>
            <div className="flex flex-row items-center justify-center relative w-full">
                <div
                    className="text-white cursor-pointer  absolute shadow-2xl left-10 z-10"
                    onClick={() => slide("left")}
                >
                    <ChevronLeft />
                </div>
                <div className="grid-cols-auto mx-auto grid w-full my-10 grid-flow-col no-scroll gap-10 overflow-x-scroll" id="myroadmap" >
                    {data.map((road) => <div  key ={road.id} className={`border-[1px] border-yellow-400/40 ${road.id === 1 ? "ml-20" : ""} transform -skew-x-12 cursor-pointer hover:border-yellow-400/80 transition-all w-96`} style={{ background: 'radial-gradient(98.3% 107.64% at 45.66% 50%, rgba(0, 0, 0, 0) 0%, #F1A240 400%)' }} >
                        <div className="transform skew-x-12 flex flex-col items-center justify-center p-4"  >
                            <Image alt="img" src="inocyx_logo.png" />
                            <p className="font-bold text-2xl text-yellow-400">{road.title}</p>
                            <p className="text-center text-white mt-2">{road.description}</p>
                        </div>
                    </div>)}
                </div>
                <div
                    className="text-white cursor-pointer  absolute shadow-2xl right-10 z-10"
                    onClick={() => slide("right")}
                >
                    <ChevronRight />
                </div>
            </div>
        </div>
    )
}

export default Roadmap