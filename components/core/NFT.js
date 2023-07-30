import Image from "next/image";
import Link from "next/link";

const NFT = (props) => {
  const { asset, onClick, transaction, isDisplayCard, type } = props;
  const listQuantity = type === 'sale' ? transaction?.list_quantity : (type === 'created' ? transaction?.tokenQty : (transaction?.quantity ?? null));

  return (
    // <ButtonBase>
    // <ButtonBase className="group relative rounded-xl">
    <>
      <div
        key={asset?.id}
        className="md:p-2 p-1 relative border-[0.5px] border-gray-100/10 hover:border-gray-100/20 aspect-square  bg-white/5 rounded-xl  hover:-translate-y-1 hover:cursor-pointer hover:brightness-125 transition-all"
        onClick={() => onClick()}
      >
        <div className="overflow-hidden aspect-square row-span-3   object-cover rounded-xl relative">
          {asset?.collectionDetails?.name ? <div
            className="flex flex-row items-center absolute bottom-1 left-0 right-0 mx-2 py-1 rounded-full "
            style={{ zIndex: 1 }}
          >
            <span className="p-1 text-sm font-sans gap-1 font-normal bg-[#080702]/50 backdrop-filter backdrop-blur-sm flex items-center rounded-3xl">
              <Image
                src="/tickcircle.svg"
                alt="itemImage"
                width={16}
                height={16}
              />
              {asset?.collectionDetails?.name}
            </span>

          </div> : null}

          {listQuantity !== null ? <div
            className="flex flex-row items-center absolute top-2 right-2 px-3 py-1 rounded-full gap-1 bg-black/20 backdrop-blur-xl border-[1px] border-white/30"
            style={{ zIndex: 1 }}
          >
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm">{listQuantity}</span>
          </div> : null}

          {asset?.assetFormat === "mp4" ||
            asset?.assetFormat === "mov" ||
            asset?.assetFormat === "webm" ? (
            <video
              playsInline
              preload="auto"
              muted
              autoPlay
              width={500}
              className="hover:scale-110 transform object-cover transition-all h-[100%] z-0"
            >
              <source
                src={asset?.itemImage}
                type={`video/${asset?.assetFormat}`}
              />
            </video>
          ) : (
            <Image
              src={asset?.itemImage}
              blurDataURL="/dummyAvatar.png"
              placeholder="blur"
              width={1000}
              height={1000}
              alt="img"
              className="object-cover transition-all w-full h-[100%] rounded-lg"
            />
          )}
        </div>
        <div className="row-span-1 relative">
          <div className="flex mt-4 flex-col gap-2">
            <span className="font-inter font-semibold self-start md:text-md text-sm md:mx-2 mx-1 truncate w-full">
              {asset?.itemName}
            </span>
            {asset?.creatorData?.displayName ? <div className="flex flex-row items-center md:mx-2 mx-1">
              <Image
                src={asset?.creatorData?.profilePic ?? "/dummyAvatar.png"}
                alt="Background Image"
                width={24}
                height={24}
                className="rounded-full md:w-6 md:h-6 h-5 w-5"
              />
              <span className="font-inter font-medium text-[12px] pl-2 truncate">
                {asset?.creatorData?.displayName}
              </span>
            </div> : null}
            {isDisplayCard ? null : <div className="grid grid-cols-2 justify-between border-t-[1px] border-white/5 py-2 mt-2 w-full rounded-xl">
              {isDisplayCard || !transaction?.floor_price ? null : <div className="col-span-1">
                <p className="text-white/50 text-sm font-inter font-normal">Price</p>
                <p className="font-inter font-semibold md:text-md text-sm">
                  {transaction?.floor_price} IYX
                </p>
              </div>}
              {isDisplayCard || !transaction?.floor_price ? null : <div className="col-span-1">
                <p className="text-white/50 text-sm font-inter font-normal">Highest Bid</p>
                <p className="font-inter font-semibold md:text-md text-sm">
                  {transaction?.floor_price} IYX
                </p>
              </div>}
            </div>}
          </div>
          {/* <span className="font-bold ml-2 text-xl">
          {asset?.forSale ? `${asset?.currentSale?.listPrice} MATIC` : "Draft"}
        </span> */}

        </div>
      </div>
      {isDisplayCard ? null : <Link href={`/asset/${transaction?._id}`} className="bg-primary hidden md:block hover:brightness-125 p-4 rounded-bl-xl rounded-br-xl text-center absolute bottom-0 text-inter w-full opacity-0 group-hover:opacity-100 transition-all">
        View details
      </Link>}
    </>
    // </ButtonBase>
  );
};

export default NFT;
