import Image from "next/image";
import { IconButton } from "@mui/material";
import client from "../../apollo/apolloClient";

import { getNFTByID } from "../../apollo/api/query";
import { Button } from "@mui/material";
import { Close, ContentPasteOffSharp, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { truncateAddress } from "../../utility";
import { useAccount } from "wagmi";

const LandModal = (props) => {
  const { landId } = props;
  const [land, setLand] = useState(null);
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const { address } = useAccount();
  const account = address;
  useEffect(() => {
    if (landId) {
      console.log(landId)
      client
        .query({
          query: getNFTByID,
          variables: {
            nftId: landId,
          },
        })
        .then(async (result) => {
          console.log(result)
          setLand(result.data.getNFTByID);
          const property = await fetch(result?.data?.getNFTByID?.metaDataURL)
            .then((res) => res.json())
            .then((data) => data);

          setProperties(property?.properties);
        })
        .catch(() => { });
    }
  }, [landId]);

  return land && Object.keys(land)?.length ? (
    <div className="bg-[#070208]/10 text-white h-[85%] overflow-y-scroll p-4 ml-2 rounded-xl flex absolute md:right-2 right-5 top-32 flex-col items-start justify-start backdrop-blur-xl md:w-1/4 w-11/12 font-sans z-40 no-scroll">
      <IconButton
        className="self-end text-white"
        onClick={() => {
          setLand(null);
        }}
      >
        <Close />
      </IconButton>
      <h3 className="text-3xl mt-4 font-KronaOne font-normal">{land?.itemName}</h3>
      <p className="mt-1 text-lg font-mulish font-normal text-white/70">{land?.location}</p>
      {/* <span
        className="mt-4 self-start text-md hover:cursor-pointer font-bold "
        onClick={() => router.push(`/profile/${land?.ownerAddress}`)}
      >
       
        <span className="text-primary">
          {" "}
          {land?.ownerAddress === account
            ? "You"
            : truncateAddress(land?.ownerAddress)}
        </span>
      </span> */}

      <Image
        src={land?.itemImage}
        alt="map"
        className="w-full h-[50vh] bg-primary rounded-lg mt-4"
        width={100}
        height={100}
      />
      <p className="font-mulish font-normal text-md text-white mt-2 pb-6 pt-2">
        {land?.itemDescription}
      </p>

      <div className="flex flex-row gap-3 items-center p-2">
        <span className="text-lg opacity-60 font-inter font-medium mt-2 mb-2">Billboard:</span>
        <span className="text-sm text-white font-inter font-extrabold">5%</span>
      </div>


      {/* <div
        className={`${
          account === land?.ownerAddress ? "cursor-pointer" : ""
        } flex flex-row items-center justify-between rounded-md  w-full p-4 bg-white/20`}
       
      >
        <p>{land?.customInfo?.length > 0 ? land?.customInfo : "No Property"}</p>
        {account === land?.ownerAddress ? <Edit color="white" /> : <></>}
      </div> */}

      {properties?.length ? (
        <div className="my-4 flex w-full flex-col items-start justify-start -mt-2">

          <div className="grid w-full grid-rows-4 items-start justify-start gap-2 ">
            {properties?.map((property) => (
              <div
                key={property.trait_type}
                className="flex w-full flex-row gap-4 items-center rounded-md  p-2 text-left font-sans"
              >
                <span className="text-lg opacity-60 font-inter font-medium">
                  {property.trait_type}:
                </span>
                <span className="text-sm text-white font-inter font-extrabold">{property.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      {land?.forSale ? (
        <p className="my-2 self-start text-xl font-bold">
          Price: {land?.price} IYX
        </p>
      ) : (
        <></>
      )}
      <div className="flex flex-row items-center justify-center w-full mt-2 gap-3">
        <Button
          // type="submit"
          variant="contained"
          className="font-inter bg-[#343434] w-full py-3 mt-2 self-end"
          onClick={() => router.push(`/asset/${landId}`)}
        >
          View Details
        </Button>
        <div className="flex flex-col items-center ml-2 justify-center w-full">
          <span>Coming Soon</span>
          <Button
            // type="submit"
            variant="contained"
            disabled
            className="font-inter font-semibold  w-full py-3 mt-2 self-end btn-gradient text-white"
          // onClick={() => setSellModal('mint')}
          >
            Rent
          </Button>
        </div>
      </div>

      {land?.isMinted === false && (
        <Button
          // type="submit"
          variant="contained"
          className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
        // onClick={() => setSellModal('mint')}
        >
          Mint
        </Button>
      )}

      {land?.isMinted && land?.forSale && land?.ownerAddress === account ? (
        <div className="flex flex-row items-center w-full justify-center">
          {/* <Button
                    variant="contained"
                    className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
                    onClick={() => setSellModal('update')}
                  >
                    Update
                  </Button> */}
          <Button
            // type="submit"
            variant="contained"
            className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
          // onClick={() => {
          //   setSellModal('cancel')
          // }}
          >
            Cancel Listing
          </Button>
        </div>
      ) : (
        land?.isMinted &&
        land?.forSale &&
        land?.ownerAddress !== account && (
          <Button
            variant="contained"
            className="font-sans bg-primary w-full py-3 mt-2 self-end"
          // onClick={() => setSellModal('buy')}
          >
            Buy
          </Button>
        )
      )}

      {land?.isMinted &&
        land?.forSale === false &&
        land?.ownerAddress === account && (
          <Button
            variant="contained"
            className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
          // onClick={() => setSellModal('sell')}
          >
            Sell
          </Button>
        )}

      {/* {sellModal && sellModal?.length > 0 && (
        <div className="absolute w-full h-[100vh] top-0 rounded-2xl flex flex-col items-center justify-center overflow-hidden z-50 bg-black/40 ">
          <div className="w-1/4 flex flex-col items-center justify-center p-4 bg-black">
            <p className="py-4  font-sans text-2xl">Fix a selling amount</p>
            {sellModal === 'sell' || sellModal === 'update' ? (
              <input
                type="tel"
                placeholder="Price"
                value={price}
                onChange={e => {
                  setPrice(e.target.value);
                }}
                className="w-full text-black outline-none p-3"
              />
            ) : (
              <p className="p-3 bg-white/20 w-full">
                Price: {sellModal === 'mint' ? '0.01' : info?.currentSale?.listPrice}
              </p>
            )}
            <Button
              variant="contained"
              className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
              onClick={() => handleSubmit(sellModal)}
            >
              {loader ? <CircularProgress className="w-24 h-24" /> : 'Confirm'}
            </Button>
            <Button
              variant="contained"
              className="font-sans bg-white/30 text-white w-full py-3 mt-2 self-end"
              onClick={() => setSellModal(!sellModal)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {addPropertyPopup ? (
        <div className="absolute w-full h-[100vh] top-0 rounded-2xl flex flex-col items-center justify-center overflow-hidden z-50 bg-black/40 ">
          <div className="w-1/4 flex flex-col items-center justify-center p-4 bg-black">
            <p className="py-4  font-sans text-2xl">Add Property</p>
            <input
              type="text"
              placeholder="Property"
              value={addProperty}
              onChange={e => {
                setAddProperty(e.target.value);
              }}
              className="w-full text-black outline-none p-3"
            />
            <Button
              variant="contained"
              className="font-sans bg-yellow-500 w-full py-3 mt-2 self-end"
              onClick={() => handleProperty()}
            >
              {loader ? <CircularProgress color="white" /> : 'Save Property'}
            </Button>
            <Button
              variant="contained"
              className="font-sans bg-white/30 text-white w-full py-3 mt-2 self-end"
              onClick={() => setAddPropertyPopup(!addPropertyPopup)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )} */}
    </div>
  ) : (
    <div />
  );
};

export default LandModal;
