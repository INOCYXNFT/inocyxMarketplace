import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button, ButtonBase } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion"
// Import Swiper styles
import "swiper/css";
import { Autoplay, Navigation } from "swiper";

const Hero = () => {
  const moveRef = useRef()
  const [currentIndex, setCurrentIndex] = useState(1);
  useEffect(() => {
    const prevEl = moveRef.current.swiper.navigation.$prevEl?.[0];
    const nextEl = moveRef.current.swiper.navigation.$nextEl?.[0];
    prevEl.style.opacity = 0
    nextEl.style.opacity = 0
  }, [moveRef])

  const handleAutoplay = (e) => {
    // console.log(e)
  }

  return (
    <motion.div variants={{
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1
      }
    }} className="w-full flex overflow-hidden md:h-full h-auto relative md:flex-row pb-16 flex-col items-center md:justify-between justify-center ">
      <div className="flex flex-col gap-4 md:mt-0  mt-20 md:ml-14 ml-0 z-10 md:w-1/2 w-11/12 items-start">
        <span className="md:text-3xl lg:text-4xl xl:text-5xl text-2xl font-KronaOne leading-loose" style={{ lineHeight: 1.3 }}>
          NFTS FOR SPACE,SCIENCE, CINEMA, CULTURE
        </span>
        <span className="md:text-lg lg:text-lg xl:text-xl text-md mt-6 md:w-4/5 w-full font-mulish font-normal md:leading-normal">
          An NFT marketplace is a decentralized platform
          that allows you to buy, store, and sell
          your unique digital assets (Non-Fungible Tokens).
        </span>
        <Link href="/discover">
          <Button className="btn-gradient hover:brightness-110 px-8 mt-6 py-4 text-lg rounded-lg text-white">
            Get Started
          </Button>
        </Link>
      </div>

      <div className="md:my-0  md:mr-20 mr-0 z-50  my-5">
        <div className="bg-gray-200/10 w-content rounded-2xl px-4 pt-5 backdrop-filter backdrop-blure-lg">
          <Swiper navigation={true} onChange={handleAutoplay} loop={true} autoplay={true} ref={moveRef} modules={[Autoplay, Navigation]} slidesPerView={1} className="mySwiper md:w-[420px] w-[300px] ">
            <SwiperSlide className="w-[500px]" >
              <Image
                src="https://www.pinkvilla.com/files/styles/amp_metadata_content_image/public/rajinikanth_jailer_first_look.jpg"
                alt="Background Image"
                width={100}
                height={100}
                className="w-full h-[40vh]"

              />
            </SwiperSlide>
            <SwiperSlide className="w-content" >
              <Image
                src="https://d2r2ijn7njrktv.cloudfront.net/apnlive/uploads/2021/05/12180150/Rajinikanth.jpg"
                alt="Background Image"
                width={100}
                height={100}
                className="w-full h-[40vh]"

              />
            </SwiperSlide>
          </Swiper>

          <div className="flex justify-between py-4">
            <ButtonBase className="rounded-full" onClick={() => moveRef.current.swiper.navigation.prevEl.click()} >
              <div className="rounded-full p-3 border-2 border-[#D9D9D9]/30">
                <ChevronLeftIcon className="text-3xl text-white"></ChevronLeftIcon>
              </div>
            </ButtonBase>
            {/* <p>{currentIndex}/2</p> */}
            <ButtonBase className="rounded-full" onClick={() => moveRef.current.swiper.navigation.nextEl.click()}>
              <div className="rounded-full p-3 border-2 border-[#D9D9D9]/30 ">
                <ChevronRightIcon className="text-3xl text-white"></ChevronRightIcon>
              </div>
            </ButtonBase>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
