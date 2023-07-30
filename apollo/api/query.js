import { gql } from "@apollo/client";

const getUserDetails = gql`
query GetUserById($id: ID!, $walletAddress: String, $transactionType: String) {
  getUserById(id: $id, walletAddress: $walletAddress, transactionType: $transactionType) {
    _id
    discord
    username
    isCreator
    isCreatorApplicationInReview
    walletAddress
    displayName
    profilePic
    shortBio
    email
    twitter
    website
    createdAt
    updatedAt
    banner
    createdNft {
      _id
      tokenID
      collectionID
      categoryId
      isMinted
      forSale
      price
      burned
      ownerAddress
      itemName
      isUserCreated
      itemDescription
      itemImage
      itemIPFSImage
      metaDataURL
      recentTransactionID
      createdAt
      updatedAt
      nftType
      mintedAt
      tokenQty
      soldQty
      customInfo
      mintPrice
      isOpenEdition
      openEditionEndTime
      royalty
      creatorAddress
      assetFormat
      collectionaddress
      transactionHash
      totalMinted
      floorPrice
      volume
    }
  }
}
`;

export const GET_USER_BY_WALLET_ADDRESS = gql`
query GetUserByWalletAddress($walletAddress: String!) {
  getUserByWalletAddress(walletAddress: $walletAddress) {
    displayName
    email
    walletAddress
    _id
    username
  }
}
`;

const getNFTByID = gql`
query GetNFTByID($nftId: String!) {
  getNFTByID(nftId: $nftId) {
    _id
    tokenID
    collectionID
    categoryId
    isMinted
    forSale
    price
    burned
    ownerAddress
    itemName
    itemDescription
    itemImage
    itemIPFSImage
    metaDataURL
    recentTransactionID
    createdAt
    updatedAt
    nftType
    creatorData {
      _id
      displayName
      profilePic
    }
    collectionDetails {
      collectionID
      imageURL
      collectionAddress
      name
    }
    mintedAt
    tokenQty
    soldQty
    customInfo
    mintPrice
    isOpenEdition
    openEditionEndTime
    royalty
    creatorAddress
    assetFormat
    transactionHistory {
      _id
      nftId
      buyerId
      sellerId
      owner {
        _id
        displayName
        profilePic
      }
      seller{
        _id
        displayName
        profilePic
      }
      buyer {
        _id
        displayName
        profilePic
      }
      isSale
      ownerId
      quantity
      price
      transactionType
      hash
      createdAt
      listingId
    }
  }
}
`;

const getLandsByCollectionID = gql`
query getLandsByCollectionID($collectionID: String!, $lowToHigh: Boolean, $highToLow: Boolean) {
  getLandsByCollectionID(collectionID: $collectionID, lowToHigh: $lowToHigh, highToLow: $highToLow) {
    id
    tokenID
    collectionID
    itemImage
    itemDescription
    itemName
    assetFormat
    currentSale{
      listPrice
    }
    collectionDetails{
      collectionID
      name
    }
    country
    isMinted
    forSale
    ownerAddress
  }
}
`

export const getNFTSByCollectionID = gql`
query GetNFTSByCollectionID($collectionId: String!, $text: String, $categoryId: String, $minPrice: String, $maxPrice: String, $limit: Int, $pageCount: Int, $nftType: String, $status: String, $filterBy: String) {
  getNFTSByCollectionID(collectionId: $collectionId, text: $text, categoryId: $categoryId, minPrice: $minPrice, maxPrice: $maxPrice, limit: $limit, pageCount: $pageCount, nftType: $nftType, status: $status, filterBy: $filterBy) {
    _id
    tokenID
    tokenQty
    collectionID
    categoryId
    isMinted
    forSale
    price
    burned
    ownerAddress
    itemName
    creatorData {
      displayName
      profilePic
    }
    itemDescription
    itemImage
    itemIPFSImage
    metaDataURL
    recentTransactionID
    createdAt
    updatedAt
    nftType
    mintedAt
    customInfo
    royalty
    creatorAddress
    assetFormat
    transactionHistory {
      _id
      nftId
      nft {
        itemName
        itemImage
      }
      buyerId
      sellerId
      ownerId
      quantity
      price
      isSale
      isSold
      transactionType
      hash
      createdAt
      listingId
      buyer {
        displayName
      }
      seller {
        displayName
      }
      owner {
        displayName
      }
    }
  }
}
`

export const getAllCategory = gql`
  query getAllCategory{
    getAllCategory{
      id
      categoryName
      categoryImage
      createdAt
      updatedAt
    }
  }
`


export const getAllCollections = gql`
query GetAllCollections($name: String, $sort: Int, $nftType: String, $minPrice: String, $maxPrice: String) {
  getAllCollections(name: $name, sort: $sort, nftType: $nftType, minPrice: $minPrice, maxPrice: $maxPrice) {
    _id
    name
    description
    banner
    creatorAddress
    collectionID
    collectionAddress
    isVerified
    launchDate
    isUnique
    imageURL
    nftDetails
    floorPrice
    volume
    items
    owners
    transactionHash
    nftType
    royaltyPercentage
  }
}
`

export const getUsersActivity = gql`
  query getUsersActivity($walletAddress: String!){
    getUsersActivity(walletAddress: $walletAddress){
      id
      uniqueID
      status
      assetID
      contractListingID
      seller
      buyer
      listPrice
      isNativeToken
      transactionHash
      createdAt
    }
  }
`

export const getAllNFTsByWallet = gql`
  query getAllNFTsByWallet($walletAddress: String!){
    getAllNFTsByWallet(walletAddress: $walletAddress){
      id
      tokenID
      collectionID
      itemName
      collectionDetails{
      collectionID
      name
    }
      itemImage
      itemDescription
      currentSale{
        listPrice
      }
      ownerAddress
    }
  }
`

export const spotlightNFT = gql`
  query spotlightNFT{
    spotlightNFT{
      id
      tokenID
      assetFormat
      collectionID
      itemName
      itemImage
      itemDescription
      currentSale{
        listPrice
      }
      ownerAddress
    }
  }
`

export const GET_ALL_NFTS = gql`
  query GetAllNFTs($text: String, $minPrice: String, $maxPrice: String, $nftType: String, $status: String) {
  getAllNFTs(text: $text, minPrice: $minPrice, maxPrice: $maxPrice, nftType: $nftType, status: $status) {
    _id
    tokenID
    collectionID
    categoryId
    isMinted
    forSale
    price
    burned
    ownerAddress
    itemName
    itemDescription
    itemImage
    itemIPFSImage
    metaDataURL
    recentTransactionID
    createdAt
    updatedAt
    nftType
    mintedAt
    tokenQty
    soldQty
    customInfo
    mintPrice
    isOpenEdition
    openEditionEndTime
    royalty
    creatorAddress
    assetFormat
    collectionaddress
    transactionHash
    totalMinted
    floorPrice
    volume
  }
}
`

export const getUpcomingCollection = gql`
  query getUpcomingCollection{
    getUpcomingCollection{
      id
      name
      description
      banner
      creatorAddress
      isVerified
      launchDate
      imageURL
      createdAt
      nftDetails
    }
  }
`

export const GET_ALL_TRANSACTIONS = gql`
  query GetAllNFTTransactionHistory($input: filterInput) {
  getAllNFTTransactionHistory(input: $input) {
    _id
    listings
    floor_price
    nftDetails {
      nftHolding {
        list_quantity
      }
      collectionDetails {
        name
      }
      creatorData {
        displayName
        profilePic
      }
      creatorAddress
      itemImage
      itemName
    }
  }
}
`

export const getNFTsByWalletForSale = gql`
  query getNFTsByWalletForSale($walletAddress: String!){
    getNFTsByWalletForSale(walletAddress: $walletAddress){
      id
      tokenID
      collectionID
      itemName
      itemImage
      itemDescription
      forSale
      collectionDetails{
        collectionID
        name
      }
      currentSale{
        listPrice
      }
      ownerAddress
    }
  }
`

export const getCreatedNFTsByWallet = gql`
  query getCreatedNFTsByWallet($walletAddress: String!){
    getCreatedNFTsByWallet(walletAddress: $walletAddress){
      id
      tokenID
      collectionID
      itemName
      itemImage
      itemDescription
      forSale
      assetFormat
      collectionDetails{
        collectionID
        name
      }
      currentSale{
        listPrice
      }
      ownerAddress
    }
  }
`

export const getArtists = gql`
  query getArtists($username: String, $byRatings: Boolean, $byNew: Boolean){
    getArtists(username: $username, byRatings: $byRatings, byNew: $byNew){
      username,
      displayName
      userID,
      walletAddress
      isCreator
      isVerified
      totalFollowers
      ratings
      banner
      profilePic
      shortBio
      artistStats{
        userID
        ratings
        isFollower
      }
      allNFTs{
        id
      }
    }
  }
`

export const discoverNFTs = gql`
  query DiscoverNFTs($text: String, $categoryId: String, $minPrice: String, $limit: Int, $maxPrice: String, $pageCount: Int, $nftType: String, $status: String, $filterBy: String) {
  discoverNFTs(text: $text, categoryId: $categoryId, minPrice: $minPrice, limit: $limit, maxPrice: $maxPrice, pageCount: $pageCount, nftType: $nftType, status: $status, filterBy: $filterBy) {
    _id
    tokenID
    collectionID
    isMinted
    forSale
    price
    burned
    ownerAddress
    itemName
    itemDescription
    itemImage
    metaDataURL
    recentTransactionID
    createdAt
    updatedAt
    nftType
    mintedAt
    customInfo
    royalty
    creatorAddress
    assetFormat
    collectionDetails {
      name
    }
  }
}
`

export const getAllCollectionStats = gql`
query GetAllCollectionStats($name: String, $sort: Int) {
  getAllCollectionStats(name: $name, sort: $sort) {
    collectionID
    collectionimageURL
    collectionName
    totalItems
    owners
    floorPrice
    volume
  }
}
`
export const GetCollectionById = gql`
query GetCollectionById($collectionId: String!, $isLand: Boolean!) {
  getCollectionById(collectionID: $collectionId, isLand: $isLand) {
    collectionDescription
    collectionID
    creatorAddress
    collectionAddress
    collectionImageURL
    collectionName
    totalItems
    owners
    floorPrice
    volume
  }
}
`

export const globalSearch = gql`
query GlobalSearch($keyword: String!) {
  globalSearch(keyword: $keyword) {
    users {
      _id
      profilePic
      displayName
    }
    nftCollection {
      # _id
      imageURL
      name
    }
    nfts {
      _id
      itemImage
      itemName
      itemDescription
    }
  }
}
`

export const GET_USER_BY_ID = gql`
query GetUserById($getUserByIdId: ID!, $walletAddress: String, $transactionType: String) {
  getUserById(id: $getUserByIdId, walletAddress: $walletAddress, transactionType: $transactionType) {
    id
    discord
    username
    walletAddress
    displayName
    profilePic
    shortBio
    email
    twitter
    website
    createdAt
    updatedAt
    banner
    createdNft {
      _id
      tokenID
      collectionID
      categoryId
      isMinted
      forSale
      price
      burned
      ownerAddress
      itemName
      itemDescription
      itemImage
      itemIPFSImage
      metaDataURL
      recentTransactionID
      createdAt
      updatedAt
      nftType
      mintedAt
      isUserCreated
      tokenQty
      soldQty
      customInfo
      mintPrice
      isOpenEdition
      openEditionEndTime
      royalty
      creatorAddress
      assetFormat
      collectionaddress
      transactionHash
      totalMinted
      floorPrice
      volume
    }
  }
}
`

export const GET_TRANSACTION_BY_USER = gql`
query GetTransactionHistoryByUserId($userId: ID!) {
  getTransactionHistoryByUserId(userId: $userId) {
    _id
    nftId
    nft {
      _id
      tokenID
      collectionID
      categoryId
      isMinted
      forSale
      price
      burned
      collectionDetails {
        _id
        name
        description
        banner
        creatorAddress
        collectionID
        isVerified
        launchDate
        isUnique
        imageURL
        createdAt
        updatedAt
      }
      ownerAddress
      itemName
      itemDescription
      itemImage
      itemIPFSImage
      metaDataURL
      recentTransactionID
      createdAt
      updatedAt
      nftType
      mintedAt
      tokenQty
      soldQty
      customInfo
      mintPrice
      isOpenEdition
      openEditionEndTime
      royalty
      creatorAddress
      assetFormat
    }
    buyerId
    sellerId
    ownerId
    quantity
    price
    buyer {
      displayName
    }
    seller {
      displayName
    }
    owner {
      displayName
    }
    transactionType
    hash
    createdAt
    listingId
  }
}
`

export const GET_ACTIVITIES_BY_USER = gql`
query GetActivitiesByUserId($userId: String!, $transactionType: String) {
  getActivitiesByUserId(userId: $userId, transactionType: $transactionType) {
    _id
    nftId
    nft {
      _id
      tokenID
      collectionID
      categoryId
      isMinted
      forSale
      price
      burned
      ownerAddress
      itemName
      itemDescription
      itemImage
      itemIPFSImage
      metaDataURL
      recentTransactionID
      createdAt
      updatedAt
      nftType
      mintedAt
      tokenQty
      soldQty
      customInfo
      mintPrice
      isOpenEdition
      openEditionEndTime
      royalty
      creatorAddress
      assetFormat
      collectionaddress
      transactionHash
      totalMinted
      floorPrice
      volume
    }
    buyerId
    sellerId
    ownerId
    quantity
    price
    isSale
    isSold
    transactionType
    hash
    createdAt
    listingId
    buyer {
      _id
      displayName
    }
    owner {
      _id
      displayName
    }
    seller {
      _id
      displayName
    }
  }
}
`;

export const GET_COLLECTIONS_BY_USER_ID = gql`
query GetCollectionsByUserId($userId: String!, $name: String) {
  getCollectionsByUserId(userId: $userId, name: $name) {
    _id
    name
    description
    banner
    creatorAddress
    collectionID
    collectionAddress
    isVerified
    launchDate
    isUnique
    imageURL
    nftDetails
    transactionHash
    royaltyPercentage
    floorPrice
    volume
    items
    owners
    nftType
    createdAt
    updatedAt
  }
}
`;

export const GET_ACTIVITIES_BY_COLLECTION_ID = gql`
query GetActivitiesByCollectionId($collectionId: String!, $transactionType: String) {
  getActivitiesByCollectionId(collectionId: $collectionId, transactionType: $transactionType) {
    _id
    nftId
    buyerId
    sellerId
    ownerId
    quantity
    price
    isSale
    isSold
    transactionType
    hash
    createdAt
    listingId
    buyer {
      _id
      displayName
    }
    seller {
      _id
      displayName
    }
    owner {
      _id
      displayName
    }
    nft {
      _id
      creatorAddress
      createdAt
      floorPrice
      itemName
      itemImage
      itemDescription
      mintedAt
      mintPrice
      nftType
      ownerAddress
      price
      royalty
      tokenID
      tokenQty
      volume
      transactionHash
    }
  }
}
`;

export const FIND_ALL_CELEBRITY = gql`
query FindAllCelebrities($text: String, $limit: Int, $pageCount: Int) {
  findAllCelebrities(text: $text, limit: $limit, pageCount: $pageCount) {
    _id
    name
    description
    banner
    creatorAddress
    collectionID
    collectionAddress
    isVerified
    launchDate
    isUnique
    isCelebrity
    ownerAddress
    nfts{
      _id
    }
    royalty_id
    imageURL
    createdAt
    updatedAt
  }
}
`

export const GET_ALL_USERS = gql`
query GetAllUsers($page: Int, $name: String) {
  getAllUsers(page: $page, name: $name) {
    displayName
    banner
    _id
    profilePic
    shortBio
    ratings
  }
}
`

export const FIND_CELEBRITY_BY_ID = gql`
query FindCelebrityById($id: ID!) {
  findCelebrityById(id: $id) {
    _id
    name
    description
    banner
    creatorAddress
    collectionID
    collectionAddress
    isVerified
    launchDate
    isUnique
    isCelebrity
    ownerAddress
    royalty_id
    imageURL
    createdAt
    updatedAt
    nfts {
      _id
      tokenID
      collectionID
      categoryId
      isMinted
      forSale
      price
      burned
      ownerAddress
      mintPrice
      itemName
      itemDescription
      itemImage
      itemIPFSImage
      metaDataURL
      recentTransactionID
      createdAt
      updatedAt
      nftType
      mintedAt
      tokenQty
      soldQty
      customInfo
      isOpenEdition
      openEditionEndTime
      royalty
      creatorAddress
      assetFormat
    }
  }
}
`

export const GET_TRANSACTION_HOLDING = gql`
query GetTransactionHoldingHistory($userId: String!) {
  getTransactionHoldingHistory(userId: $userId) {
    nftData {
      collectionDetails {
        name
      }
      creatorData {
        displayName
        profilePic
      }
      _id
      soldQty
      nftType
      itemImage
      itemName
      creatorAddress
      tokenID
      isOpenEdition
    }
    userData {
      activity {
        _id
        nftId
        buyerId
        sellerId
        ownerId
        quantity
        price
        transactionType
        hash
        createdAt
        listingId
        buyer {
          displayName
        }
        seller {
          displayName
        }
        owner {
          displayName
        }
      }
    }
    list_quantity
    quantity
    _id
    nftId
  }
}
`

export { getUserDetails, getNFTByID, getLandsByCollectionID }

