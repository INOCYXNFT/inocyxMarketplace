import { useQuery } from "@apollo/client"
import LayoutWrapper from "."
import NFT from "../../components/core/NFT"
import Router from "next/router"
import { GET_ALL_TRANSACTIONS } from "../../apollo/api/query"
import { NFTSkeleton } from "../../components/core/SkeletonHub"
import EmptyState from "../../components/core/EmptyState"
import { useEffect, useState } from "react"

function SelfChildComponent(props) {
    const cols = true ? 4 : 6
    const [filterValues, setFilterValues] = useState({
        minPrice: "",
        maxPrice: "",
        // status: "All",
        nftType: ""
    });

    useEffect(() => {
        if (props?.filter) {
            setFilterValues({
                minPrice: props?.filterValues?.minPrice,
                maxPrice: props?.filterValues?.maxPrice,
                // status: props?.filterValues?.status,
                nftType: props?.filterValues?.nftType
            });
        }
    }, [props?.filter]);
    const { data, loading, error } = useQuery(GET_ALL_TRANSACTIONS, {
        variables: {
            input: {
                name: props.searchQuery,
                minPrice: filterValues?.minPrice,
                maxPrice: filterValues?.maxPrice,
                nftType: filterValues?.nftType
            }
        }
    })
    return loading ?
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-6 md:gap-6 gap-2" >
            < NFTSkeleton />
        </div> :
        data?.getAllNFTTransactionHistory?.length === 0 ? <EmptyState description="No NFTs to show" /> :
            <div className={`grid grid-cols-2 md:grid-cols-${cols} lg:grid-cols-${cols} md:gap-6 gap-2`} >
                {data?.getAllNFTTransactionHistory?.map((history, key) => (
                    <NFT key={key} isDisplayCard={true} asset={history.nftDetails} transaction={history} onClick={() => Router.push(`/asset/${history._id}`)} />
                ))}
            </div>

}

export default function NFTTab() {

    return (
        <LayoutWrapper>
            <SelfChildComponent />
        </LayoutWrapper>
    )
}