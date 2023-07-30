export const MARKETPLACE_ADDRESS = "0x5c9c886d6074520CAEDd60729D286153A68930E9";
export const LAND_ADDRESS = "efa06297-ee27-47fa-ad62-dd0c57a5aa6f";

export const TRANSACTION_ENDPOINT =
    // process.env.NODE_ENV === 'production' ?
    //     "https://polygonscan.com"
    //     :
    "https://mumbai.polygonscan.com"

export const NFT_TYPES = [
    {
        name: "All",
        value: "all",
    },
    {
        name: "Single",
        value: "erc721",
    },
    {
        name: "Multiple",
        value: "erc1155",
    },
]

export const NFT_SORTING = [
    {
        name: "Recently Listed",
        value: "latest",
    },
    {
        name: "Price: High to Low",
        value: "max",
    },
    {
        name: "Price: Low to High",
        value: "min",
    },
]

export const NFT_STATUS = [
    {
        name: "All",
        value: 'all',
    },
    {
        name: "Buy Now",
        value: 'buynow',
    },
    {
        name: "Live Auction",
        value: 'liveauction',
    },
]

export const BASE_URI = 'https://inocyx-statics.s3.ap-south-1.amazonaws.com'

export const POLYGON_MUMBAI_RPC = 'https://polygon-mumbai.g.alchemy.com/v2/VBbcSM3TK1TUCF1gK8yHXWGwG2JbGuSr'