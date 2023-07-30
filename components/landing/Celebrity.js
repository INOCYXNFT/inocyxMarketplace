import React from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation } from "swiper";
import EastIcon from "@mui/icons-material/East";
import { useQuery } from "@apollo/client";
import { FIND_ALL_CELEBRITY } from "../../apollo/api/query";
import Router from "next/router";

const Celebrity = () => {
  const { data } = useQuery(FIND_ALL_CELEBRITY)

  // const swiperData = [
  //   {
  //     swiperBg: "/swiper_bg.png",
  //     swiper_avatar: "/swiper1.svg",
  //     swiper_name: "Superstart Rajnikanath",
  //     swiper_tag: "DextrStack",
  //     swiper_profile_url: "/swiper1.svg",
  //     price: [
  //       {
  //         price_val: "0.2",
  //         price_vol: "280",
  //       },
  //     ],
  //   },
  //   {
  //     swiperBg: "/swiper_bg.png",
  //     swiper_avatar: "/swiper1.svg",
  //     swiper_name: "Superstart Rajnikanath",
  //     swiper_tag: "DextrStack",
  //     swiper_profile_url: "/swiper1.svg",
  //     price: [
  //       {
  //         price_val: "0.2",
  //         price_vol: "280",
  //       },
  //     ],
  //   },
  // ];

  return (
    <div className=" flex flex-col w-11/12 mb-10 mx-auto items-center ">
      <div className="flex flex-row items-center w-full">
        <span className="md:text-5xl text-lg font-normal font-KronaOne self-center  p-3 ">
          Celebrities
        </span>

        <Link href="/collections">
          <div className="flex flex-row gap-1 items-center">
            <button className="px-4 py-2 rounded-lg text-white hover:text-white text-lg font-mulish">
              View all
            </button>
            <svg width={0} height={0}>
              <linearGradient id="linearColors" x1={1} y1={0} x2={1} y2={1}>
                <stop offset={0} stopColor="rgba(6, 209, 248, 1)" />
                <stop offset={1} stopColor="rgba(222, 23, 158, 1)" />
              </linearGradient>
            </svg>

            <EastIcon
              sx={{ fill: "url(#linearColors)" }}
              className="text-white text-2xl animate-bounce"
            />
          </div>
        </Link>
      </div>
      <div className=" my-10 w-full gap-4 ">
        <Swiper
          spaceBetween={300}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {data?.findAllCelebrities?.map((swiper_data) => (
            <SwiperSlide>
              <div className="relative md:h-3/5 h-auto w-full rounded-xl     ">
                <div className="absolute left-0 right-0 bottom-0  ">
                  <Image
                    src={swiper_data.swiperBg}
                    alt="Background image"
                    width={100}
                    height={100}
                    className="rounded-xl w-full h-full object-cover"
                  />
                </div>
                <div className=" backdrop-filter md:backdrop-blur-xl backdrop-blur-lg bg-[#161616] md:bg-opacity-10  bg-opacity-20 rounded-xl  ">
                  <div className="flex md:flex-row  flex-col justify-between md:mx-16  ">
                    <div className="grid  items-center  md:mt-0 mt-10">
                      <div className="flex flex-col md:items-start items-center gap-7 md:py-10 py-14">
                        <div className="text-white">
                          <Image
                            src={swiper_data.banner}
                            alt="Background Image"
                            width={100}
                            height={100}
                            className="rounded-full w-24 h-24 object-cover "
                          />
                        </div>
                        <div>
                          <span className="text-white md:text-3xl text-lg md:text-left text-center font-inter font-bold ">
                            {swiper_data.name}
                          </span>
                        </div>
                        <div className="flex flex-row items-center  ">
                          <span className="font-inter font-medium text-lg pl-2">
                            {swiper_data.description}
                          </span>
                        </div>

                        <div>
                          <div className="font-inter font-extrabold text-xl ">
                            Assets: {swiper_data?.nfts?.length}
                          </div>
                        </div>
                        <div className="">
                          <button className="px-6 py-3 btn-gradient rounded-lg font-inter font-medium" onClick={() => Router.push(`/celebrity/${swiper_data._id}`)} >
                            View details
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-white">
                      {" "}
                      <Image
                        src={swiper_data.banner}
                        alt="Background image"
                        width={500}
                        height={500}
                        className="w-full h-[100%] object-cover -z-50 rounded-2xl absolute top-0 left-0 opacity-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Celebrity;
