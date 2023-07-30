import { GET_ALL_TRANSACTIONS } from "../../apollo/api/query";
import { useQuery } from "@apollo/client";
import NFT from "../core/NFT";
import Router from "next/router";
export default function TrendingNFT() {
    const { data, isLoading, error } = useQuery(GET_ALL_TRANSACTIONS, {
        variables: {
            input: {
                name: ""
            }
        }
    })

    return (
        <div className="w-11/12 overflow-hidden mx-auto max-w-screen-2xl" >
            <div className="flex flex-row items-center justify-between w-full" >
                <p className="font-sans text-2xl">Trending NFTs</p>
            </div>
            <div className="grid md:grid-cols-5 grid-cols-2 mt-6 gap-4" >
                {data?.getAllNFTTransactionHistory?.map((history, key) => (
                    <NFT key={key} asset={history.nftDetails} isDisplayCard={true} transaction={history} onClick={() => Router.push(`/asset/${history._id}`)} />
                ))}
            </div>
        </div>
    )
}