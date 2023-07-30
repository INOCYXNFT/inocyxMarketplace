import { CheckCircle, Star } from "@mui/icons-material";
import Image from "next/image";
import Router from "next/router";

function Artist({ artistDetails }) {
  return (
      <div
        key={artistDetails.id}
        className="group relative h-80 w-full transform overflow-hidden rounded-2xl border-[1px] border-white/30 bg-white/10 backdrop-filter backdrop-blur-md  hover:-translate-y-2 hover:cursor-pointer"
        onClick={() => Router.push(`/creator/${artistDetails.walletAddress}`)}
      >
        <Image
          className="h-40 w-full object-cover transform  transition-all group-hover:scale-100"
          // src={data.banner ?? "/dummyBanner.png"}
          src="/dummyBanner.png"
          alt="media"
          width={500}
          height={100}
        />
        <div className="absolute bottom-0 flex w-full flex-col items-start justify-center  pb-4 -mt-4 z-10">
          <div className="-mt-8 pl-4">
            <Image
              className="rounded-full border-2 border-gray-600 -mt-4 bg-white h-auto "
              // src={data.profilePic ?? "/dummyAvatar.png"}
              src="/dummyAvatar.png"
              alt="media"
              width={50}
              height={50}
            />
          </div>
          <div class="border-b-[1px] border-white/30 py-2 w-full ">
            <span className="text-xl mt-1  pl-4 font-inter flex flex-row items-center font-bold ">
              {artistDetails.displayName}{" "}
              {artistDetails.isVerified && (
                <span className="mx-2">
                  <Image
                    src="/tickcircle.svg"
                    alt="itemImage"
                    width={16}
                    height={16}
                  />
                </span>
              )}
            </span>
          </div>
          <div className="mt-1 flex w-4/5 flex-row items-center justify-between opacity-90 py-2 pl-4 z-20">
            <div className="flex flex-col text-white">
              <span className="text-sm font-inter font-normal">FOLLOWERS</span>
              <div className="flex flex-row py-1 gap-1 items-center">
                <Image
                  src="/usertag.svg"
                  alt="usertag"
                  width={16}
                  height={16}
                  className="w-5 h-5"
                />
                <p className="font-inter font-extrabold text-sm">
                  {" "}
                  {artistDetails.totalFollowers}
                </p>
              </div>
            </div>
            <div className="ml-4 flex flex-row items-center">
              <div className="flex flex-col">
                <span className="text-sm text-center font-inter font-normal">
                  RATING
                </span>
                <div className="flex-row  flex items-center gap-2">
                  <Image
                    src="/rating.svg"
                    alt="rating"
                    width={16}
                    height={16}
                    className="w-5 h-5"
                  />
                  <p className="font-inter font-extrabold text-white  text-sm">
                    {" "}
                    {artistDetails?.ratings}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Artist;
