import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    const handleShadow = () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    };
    window.addEventListener("scroll", handleShadow);
  }, []);

  return (
    <div className="fixed top-0 w-full h-16  z-[100] ease-in-out duration-100 backdrop-blur-3xl">
      <div className="container mx-auto flex justify-between items-center w-11/12 px-2 2xl:px-16">
        <Link href="/">
          <Image
            src="/inocyx.png"
            alt="/"
            width="120"
            height="30"
            className="cursor-pointer"
          />
        </Link>
        <ul className="hidden md:flex">
          <Link href="#exchange">
            <li className="text-sm text-white font-circular_regular hover:bg-gradient-to-r from-white/5 to-white/10 hover:backdrop-blur-sm hover:border-white/5 border-[1px] border-transparent rounded-md  cursor-pointer px-12 py-4">
              <p>Exchange</p>
            </li>
          </Link>
          <Link href="#nft">
            <li className="text-sm text-white font-circular_regular hover:bg-gradient-to-r from-white/5 to-white/10 hover:backdrop-blur-sm hover:border-white/5 border-[1px] border-transparent rounded-md  cursor-pointer px-12 py-4">
              <p>Marketplace</p>
            </li>
          </Link>
          <Link href="#metaverse">
            <li className="text-sm text-white font-circular_regular hover:bg-gradient-to-r from-white/5 to-white/10 hover:backdrop-blur-sm hover:border-white/5 border-[1px] border-transparent rounded-md hover:text-yellow-400 cursor-pointer px-12 py-4">
              <p>Metaverse</p>
            </li>
          </Link>
          <Link href="#roadmap">
            <li className="text-sm text-white font-circular_regular hover:bg-gradient-to-r from-white/5 to-white/10 hover:backdrop-blur-sm hover:border-white/5 border-[1px] border-transparent rounded-md hover:text-yellow-400 cursor-pointer px-12 py-4">
              <p>Roadmap</p>
            </li>
          </Link>
        </ul>
        {/* Hamburger Icon */}
        <div onClick={handleNav} className="md:hidden sm:hidden">
          {nav ? <p>Open</p> : <p>Close</p>}
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Overlay */}
      <div
        className={
          nav
            ? "md:hidden absolute right-0 top-0 w-full h-screen bg-black/90 backdrop-blur-xl"
            : ""
        }
      >
        {/* Side Drawer Menu */}
        <div
          className={
            nav
              ? " absolute right-0 top-0 w-full sm:w-full md:w-full h-screen  p-4 duration-500"
              : "fixed right-[-100%] top-0 p-10 duration-500"
          }
        >
          {/* <div>
            <div className="flex w-full items-center justify-end">
              <div onClick={handleNav} className="cursor-pointer">
                <CloseIcon className="text-white" />
              </div>
            </div>
          </div> */}
          <div className="py-4 flex flex-col">
            <ul>
              <Link href="#about">
                <li
                  onClick={() => setNav(false)}
                  className="py-4 text-sm  text-white font-circular_regular hover:bg-neutral-800 p-3 rounded-2xl"
                >
                  Exchange
                </li>
              </Link>
              <Link href="#identity">
                <li
                  onClick={() => setNav(false)}
                  className="py-4 text-sm  text-white font-circular_regular hover:bg-neutral-800 p-3 rounded-2xl"
                >
                  Marketplace
                </li>
              </Link>
              <Link href="#services">
                <li
                  onClick={() => setNav(false)}
                  className="py-4 text-sm text-white   font-circular_regular hover:bg-neutral-800 p-3 rounded-2xl"
                >
                  Metaverse
                </li>
              </Link>
              <Link href="#roadmap">
                <li
                  onClick={() => setNav(false)}
                  className="py-4 text-sm text-white   font-circular_regular hover:bg-neutral-800 p-3 rounded-2xl"
                >
                  Roadmap
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
