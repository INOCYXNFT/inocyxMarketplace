import NFT from "../core/NFT";
import EmptyState from "../core/EmptyState";
import Router from "next/router";

function Owned(props) {
  const assets = props.assets;

  return (
    <div>
      {assets && assets?.length ? (
        <>
          <div className="mt-4 grid w-11/12 grid-cols-5 gap-4 font-sans ">
            {assets?.map((asset) => (
              <NFT key={asset.id} asset={asset} onClick={() => Router.push(`/asset/${asset.id}`)} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState description="No NFTs in to show" />
      )}
      
    </div>
  );
}

export default Owned;
