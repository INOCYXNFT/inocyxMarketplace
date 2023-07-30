// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image"
import { Autoplay, Navigation, Scrollbar } from "swiper";
import NFT from "../core/NFT";
import { useQuery } from "@apollo/client";
import { GET_ALL_TRANSACTIONS } from "../../apollo/api/query";
import { useEffect, useState } from "react";
import Router from "next/router"
import { Skeleton } from "@mui/material";


export default function Hero() {
    const [activeAsset, setActiveAsset] = useState({})
    const { data, loading, error } = useQuery(GET_ALL_TRANSACTIONS, {
        variables: {
            input: {
                name: ""
            }
        }
    })
    useEffect(() => {
        if (data?.getAllNFTTransactionHistory) {
            // setActiveAsset(data?.getAllNFTTransactionHistory)
        }
    }, [])

    return (
        <div className="gradient_hero overflow-hidden relative pb-10" >
            <div className="w-11/12 mx-auto">
                <h1 style={{ width: "fit-content" }} className="z-50 mx-auto text-3xl text-center md:text-5xl font-bold font-sans text-white pt-10 md:pt-20" >Discover, sell and collect NFT art</h1>
                <Swiper
                    spaceBetween={1}
                    autoplay={{
                        delay: 4000

                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 1
                        },
                        768: {
                            slidesPerView: 3
                        },
                        1024: {
                            slidesPerView: 5
                        },
                    }}
                    scrollbar={{ draggable: true }}
                    centeredSlides={true}
                    roundLengths={true}
                    onSlideChange={(event) => {
                        setActiveAsset(data?.getAllNFTTransactionHistory?.[event.activeIndex]?.nft)
                    }}
                    loop={true}
                    loopAdditionalSlides={20}
                    navigation
                    modules={[Autoplay, Navigation, Scrollbar]}
                    className="mySwiper z-50 mt-10"
                >
                    {loading ?
                        <div className="flex flex-row gap-4 flex-nowrap overflow-scroll w-full">
                            {[1, 2, 3, 4, 5, 6, 8].map((_, index) => <div>
                                <Skeleton key={index} width={400} height={600} animation="pulse" className="rounded-xl" />
                            </div>
                            )}
                        </div>
                        :
                        data?.getAllNFTTransactionHistory?.map((history, index) => (
                            <SwiperSlide key={index}>
                                <NFT isDisplayCard={true} asset={history.nftDetails} transaction={history} onClick={() => Router.push(`/asset/${history._id}`)} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>

                <Image src={activeAsset?.itemImage} className=" opacity-20 w-full h-[90vh] blur-lg object-cover absolute top-0 -z-10 " width={100} height={100} />
            </div>
        </div>
    )
}

