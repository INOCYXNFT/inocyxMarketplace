import React from 'react'
import Image from "next/image"

const AssetidHero = () => {
  return (
    <div className="hero_gradient_page">
      <div className="relative">
        <Image
          src="/hero_bg.webp"
          alt="Your Alt Text"
          width={100}
          height={100}
          className="w-full h-[420px] object-cover  backdrop-filter backdrop-blur-3xl bg-black opacity-60"
        />
      </div>
    </div>
  )
}

export default AssetidHero