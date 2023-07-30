import SearchBox from "../core/SearchBox";
import NFT from "../core/NFT";
import SortOrder from "../core/SortOrder";
import EmptyState from "../core/EmptyState";
import Router from "next/router";


function Drafts(props) {
  const assets = props.assets;
  
  return (
    <div>
      {assets && assets?.length ? (
        <>
          <div className="grid grid-cols-4 gap-4">
            <SearchBox />
            <SortOrder />
          </div>
          <p className="mt-4 text-lg font-bold ">Inocyx Land</p>
          <div className="mt-4 grid w-11/12 grid-cols-5 gap-4 font-sans ">
            {assets?.map((asset) => (
              <NFT key={asset.id} asset={asset} onClick={() => Router.push(`/asset/${asset.id}`)} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState description="No NFTs in your Wallet" />
      )}
      
    </div>
  );
}

export default Drafts;
