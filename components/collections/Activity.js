import { Chip } from "@mui/material"
import { Tag, Ethereum, ArrangeVerticalCircle, Flash, Shapes1, Medal } from "iconsax-react"
import ActivityTable from "./ActivityTable"
import TabTransition from "../core/TabTransition"
import React from "react"

const Filters = [
    {
        name: "All",
        type: "",
        icon: ''
    },
    // {
    //     name: "Listings",
    //     icon: <Tag />
    // },
    // {
    //     name: "Purchase",
    //     icon: <Ethereum />
    // },
    // {
    //     name: "Transfer",
    //     icon: <ArrangeVerticalCircle />
    // },
    // {
    //     name: "Burn",
    //     icon: <Flash />
    // },
    {
        name: "Mint",
        type: "mint",
        icon: <Shapes1 />
    },
    {
        name: "Trade",
        type: "trade",
        icon: <ArrangeVerticalCircle />
    },
    {
        name: "List",
        type: "list",
        icon: <Tag />
    },
    {
        name: "Buy",
        type: "buy",
        icon: <Ethereum />
    },
    // {
    //     name: "Bids",
    //     icon: <Medal />
    // },
]

export default function Activity({ loading, data, transactionType, setTransactionType }) {
    return (
        <TabTransition>
            <div className="flex flex-col items-start justify-center gap-8 w-full" >
                {data !== null && <div className="flex flex-row flex-wrap w-full gap-2" >
                    {Filters.map((filter) => (
                        <Chip
                            clickable
                            variant={transactionType === filter.type ? "outlined" : "filled"}
                            className="bg-white/10 p-2"
                            icon={filter.icon}
                            label={filter.name}
                            onClick={() => setTransactionType(filter.type)}
                        />
                    ))}
                </div>}
                <ActivityTable loading={loading} data={data} />
            </div>
        </TabTransition>
    )
}