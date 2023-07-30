/* eslint-disable @next/next/no-img-element */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import Timer from "../core/Timer"

// import "./styles.css";

// import required modules
import { EffectCoverflow, Autoplay, Navigation } from 'swiper'
import { truncateAddress } from '../../utility'
import Link from 'next/link'
// getUpcomingCollection

function UpcomingDrops(props) {
  return (
    <div className='py-10 flex flex-col'>
      <span className="text-2xl font-bold self-center border-b-4 border-yellow-500 p-4 ">Upcoming Drops</span>
      <Swiper
        effect="coverflow"
        direction="horizontal"
        className="mySwiper ml-0 mr-0 p-10 text-white w-full h-[40rem]"
        loop
        centeredSlides
        slideActiveClass="width: 1000px"
        autoplay
        slidesPerView={1}
        navigation={true}
        modules={[Autoplay, EffectCoverflow, Navigation]}
      >
        {props?.drops?.map((data) => (
          <SwiperSlide
            key={data.id}
            className="w-full group relative hover:brightness-110 transform rounded-2xl overflow-hidden bg-white text-black"
          >
            <div className='absolute w-full h-[40rem] text-white bg-gradient-to-tl from-black/90 via-black/40 to-black/90 flex flex-col items-start md:p-20 p-6 justify-evenly -mt-20' >
              <div className='w-full flex flex-col items-start justify-center'>
                <Timer date={new Date(parseInt(data.launchDate))} />
                <span className="text-md mt-2" >{new Date(parseInt(data.launchDate)).toDateString()}</span>
              </div>
              <div className='flex flex-col' >
                <span className="font-sans md:text-4xl text-2xl font-bold">{data.name}</span>
                <span className="font-sans mt-2 md:text-xl text-xl">@{truncateAddress(data.creatorAddress)}</span>
              </div>
              <Link href={`/celebrity/${data.id}`} target="_blank">
                <button className='bg-yellow-400 hover:brightness-110 text-black px-8 py-4 rounded-lg -mt-10' >
                  More details
                </button>
              </Link>
            </div>
            <img
              className="object-cover w-full  h-full "
              src={data.imageURL}
              alt="img"
            />
            {/* </div> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

  )
}

export default UpcomingDrops
