
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import "./styles.css";

// import required modules
import { Autoplay } from "swiper";
import Link from "next/link";
import Image from "next/image";
import { truncateAddress } from "../../utility/index";
import Router from "next/router";
// import ColorThief from "colorthief"


function FeaturedNFTAnimation(props) {

  return (
    <div className="flex rotate-12 scale-110 transform flex-row items-center justify-center">
      <Swiper
        direction="vertical"
        className="mySwiper ml-0 mr-0 h-[100vh] text-white"
        loop
        autoplay={{ reverseDirection: true, delay: 2000 }}
        spaceBetween={40}
        slidesPerView={3}
        modules={[Autoplay]}
      >
        {props?.spotlight?.map((data) => (
          <Link key={data.id} href={`/asset/${data.id}`}>
            <SwiperSlide
              key={data.id}
              onClick={() => Router.push(`/asset/${data.id}`)}
              className="group w-48 transform overflow-hidden rounded-2xl bg-black text-black hover:cursor-pointer hover:brightness-110 md:w-56"
            >
              <div className="absolute bottom-0 z-10 hidden w-full flex-col items-start bg-black/60 p-4 text-white backdrop-blur-md transition-all group-hover:flex">
                <span className="font-sans font-bold">{data.itemName}</span>
                <span className="font-sans text-sm">
                  @{truncateAddress(data.ownerAddress)}
                </span>
              </div>
              {data?.assetFormat === 'mp4' || data?.assetFormat === 'mov' || data?.assetFormat === 'webm' ?
                <video
                  playsInline
                  preload="auto"
                  muted
                  // poster="/image_loader.gif"
                  width={500}
                  // height={800}
                  className="z-0 h-[50vh] w-64 object-cover"
                >
                  <source src={data.itemImage} type={`video/${data?.assetFormat}`} />
                </video>
                :
                <Image
                  className="z-0 h-[50vh] w-64 object-cover"
                  width="600"
                  height="800"
                  placeholder="/nft.png"
                  blurDataURL="/nft.png"
                  src={data.itemImage}
                  alt="img"
                />
              }
            </SwiperSlide>
          </Link>
        ))}
      </Swiper>

      <Swiper
        direction="vertical"
        className="mySwiper ml-10 mr-0 -mt-20 h-[100vh] text-white"
        loop
        autoplay={{ delay: 2000 }}
        spaceBetween={40}
        slidesPerView={3}
        modules={[Autoplay]}
      >
        {props?.spotlight?.map((data) => (
          <Link key={data.id} href={`/asset/${data.id}`}>
            <SwiperSlide
              key={data.id}
              onClick={() => Router.push(`/asset/${data.id}`)}
              className="group w-48 transform overflow-hidden rounded-2xl bg-black text-black hover:cursor-pointer hover:brightness-110 md:w-56"
            >
              <div className="absolute bottom-0 z-10 hidden w-full flex-col items-start bg-black/60 p-4 text-white backdrop-blur-md transition-all group-hover:flex">
                <span className="font-sans font-bold">{data.itemName}</span>
                <span className="font-sans text-sm">
                  @{truncateAddress(data.ownerAddress)}
                </span>
              </div>
              {data?.assetFormat === 'mp4' || data?.assetFormat === 'mov' || data?.assetFormat === 'webm' ?
                <video
                  playsInline
                  preload="auto"
                  muted
                  // poster="/image_loader.gif"
                  width={500}
                  // height={800}
                  className="z-0 h-[40vh] w-64 object-cover"
                >
                  <source src={data.itemImage} type={`video/${data?.assetFormat}`} />
                </video>
                :
                <Image
                  className="z-0 h-[40vh] w-64 object-cover"
                  width="600"
                  height="800"
                  placeholder="/nft.png"
                  blurDataURL="/nft.png"
                  src={data.itemImage}
                  alt="img"
                />
              }
            </SwiperSlide>
          </Link>
        ))}
      </Swiper>

      <Swiper
        direction="vertical"
        className="mySwiper ml-10 mr-0 -mt-20 h-[100vh] text-white"
        loop
        spaceBetween={40}
        autoplay={{ reverseDirection: true, delay: 2000 }}
        slidesPerView={3}
        modules={[Autoplay]}
      >
        {props?.spotlight?.map((data) => (
          <Link key={data.id} href={`/asset/${data.id}`}>
            <SwiperSlide
              key={data.id}
              onClick={() => Router.push(`/asset/${data.id}`)}
              className="group w-48 transform overflow-hidden rounded-2xl bg-black text-black hover:cursor-pointer hover:brightness-110 md:w-56"
            >
              <div className="absolute bottom-0 z-10 hidden w-full flex-col items-start bg-black/60 p-4 text-white backdrop-blur-md transition-all group-hover:flex">
                <span className="font-sans font-bold">{data.itemName}</span>
                <span className="font-sans text-sm">
                  @{truncateAddress(data.ownerAddress)}
                </span>
              </div>
              {data?.assetFormat === 'mp4' || data?.assetFormat === 'mov' || data?.assetFormat === 'webm' ?
                <video
                  playsInline
                  preload="auto"
                  muted
                  // poster="/image_loader.gif"
                  width={500}
                  // height={800}
                  className="z-0 h-[40vh] w-64 object-cover"
                >
                  <source src={data.itemImage} type={`video/${data?.assetFormat}`} />
                </video>
                :
                <Image
                  className="z-0 h-[40vh] w-64 object-cover"
                  width="600"
                  height="800"
                  placeholder="/nft.png"
                  blurDataURL="/nft.png"
                  src={data.itemImage}
                  alt="img"
                />
              }
            </SwiperSlide>
          </Link>
        ))}
      </Swiper>
    </div>
  );
}

export default FeaturedNFTAnimation;
