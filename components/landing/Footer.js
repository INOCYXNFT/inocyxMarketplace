import React from "react"
import Image from "next/image"

function Footer() {
  return (
    <footer className="p-4 flex flex-col items-center justify-center w-full bg-[#0B0D17] text-white fixed" >
      <div className="flex md:flex-row flex-col items-start w-11/12 mt-10 justify-between">
        <div className='flex flex-col items-start'>
          <Image src="/inocyx.png" alt="Logo" className='md:w-64 w-56 h-auto'  width={100} height={100}/>
          <span className='md:text-xl text-md mt-2 w-1/2' >
            A new way to become a millionaire. The only limit of trading is your imagination.
          </span>
        </div>
        <div className='flex flex-col items-start md:mt-0 mt-8'>
          <span className="text-sm font-bold uppercase text-primary mb-2">SITEMAP</span>
          <div className='flex flex-col items-start'>
            <a href="discover" className="text-lg cursor-pointer hover:underline mt-2">Discover</a>
            <a href="collections" className="text-lg cursor-pointer hover:underline mt-2">
              Collections
            </a>
            <a href="creator" className="text-lg cursor-pointer hover:underline mt-2">
              Creators
            </a>
          </div>
        </div>
        <div className='flex flex-col items-start md:mt-0 mt-8'>
          <span className="text-sm font-bold uppercase text-primary mb-2">METAVERSE</span>
          <div className='flex flex-col items-start'>
            <span className="text-lg cursor-pointer hover:underline mt-2">Maps</span>
            <span className="text-lg cursor-pointer hover:underline mt-2">Games</span>
          </div>
        </div>
        <div className='flex flex-col items-start md:mt-0 mt-8'>
          <span className="text-sm font-bold uppercase text-primary mb-2">METAVERSE</span>
          <div className='flex flex-col items-start'>
            <span className="text-lg cursor-pointer hover:underline mt-2">Maps</span>
            <span className="text-lg cursor-pointer hover:underline mt-2">Games</span>
          </div>
        </div>
      </div>
      <span className='p-6 mt-14 border-t-2 border-white/10 w-full text-center'>
        Inocyx . 2022 Copyrights. All rights are reserved
      </span>
    </footer>
  )
}

export default Footer