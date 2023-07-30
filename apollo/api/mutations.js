import { gql } from "@apollo/client";

const mintLand = gql`
mutation MintLand($uniqueID: String!, $wallet: String!) {
  mintLand(uniqueID: $uniqueID, wallet: $wallet) {
    id
    tokenID
    itemDescription
    collectionID
    itemImage
    itemName
    location
    country
    isMinted
    forSale
    ownerAddress
  }
}
`;

const purchaseNFT = gql`
mutation PurchaseNFT($uniqueID: String!, $buyer: String!) {
  purchaseNFT(uniqueID: $uniqueID, buyer: $buyer) {
    id
    tokenID
    itemDescription
    collectionID
    itemImage
    itemName
    location
    country
    isMinted
    forSale
    ownerAddress
  }
}
`;

export const createS3File = gql`
mutation CreateS3file($name: String!, $description: String!, $image: String!,$folder:String!,$filename:String!) {
  createS3file(name: $name, description: $description, image: $image,folder:$folder,filename:$filename)
}`

const PutOnSale = gql`
mutation PutOnSale($uniqueID: String!, $price: String!, $contractListingID: String!) {
  putOnSale(uniqueID: $uniqueID, price: $price, contractListingID: $contractListingID) {
    id
    tokenID
    itemDescription
    collectionID
    itemImage
    itemName
    location
    country
    isMinted
    forSale
    ownerAddress
  }
}
`;

const CancelNFTSale = gql`
mutation cancelNFTSale($uniqueID: String!) {
  cancelNFTSale(uniqueID: $uniqueID) {
    id
    tokenID
    itemDescription
    collectionID
    itemImage
    itemName
    location
    country
    isMinted
    forSale
    ownerAddress
  }
}
`;

export const mintNFT = gql`
mutation mintNFT($itemName: String!, $description: String, $tokenID: String, $categoryID: String!, $royality: String, $tokenURI: String, $imageUrl: String, $ownerAddress: String, $assetFormat: String, $imageIpfsUrl: String) {
  mintNFT(itemName: $itemName, description: $description, tokenID: $tokenID, categoryID: $categoryID, royality: $royality, tokenURI: $tokenURI, imageUrl: $imageUrl, ownerAddress: $ownerAddress, assetFormat: $assetFormat, , imageIpfsUrl: $imageIpfsUrl) {
    id
    tokenID
    itemDescription
    collectionID
    itemImage
    itemName
    assetFormat
    isMinted
    forSale
    ownerAddress
  }
}
`;

const AddCustomInfo = gql`
mutation AddCustomInfo($id: String!, $content: String!) {
  addCustomInfo(id: $id, content: $content) {
    id
    tokenID
    itemDescription
    collectionID
    customInfo
    itemImage
    itemName
    location
    country
    isMinted
    forSale
    ownerAddress
  }
}
`;

export const followArtist = gql`
mutation followArtist($followerUserID: String!, $followingUserID: String!) {
  followArtist(followerUserID: $followerUserID, followingUserID: $followingUserID) {
    id
    displayName
    walletAddress
    userID
    username
    website
    email
    isCreatorApplicationInReview
    shortBio
    twitter
    isCreator
    banner
    profilePic
    artistStats{
      userID
      ratings
      isFollower
    }
    allNFTs {
      id
      tokenID
      collectionID
      itemImage
      collectionDetails{
        collectionID
        name
      }
      itemDescription
      itemName
      country
      isMinted
      forSale
      ownerAddress
    }
  }
}
`;

export const applyForCreator = gql`
mutation ApplyForCreator($userId: String!, $description: String!, $twitterHandle: String, $websiteURL: String, $instagramHandle: String, $showcaseURL: String) {
  applyForCreator(userID: $userId, description: $description, twitterHandle: $twitterHandle, websiteURL: $websiteURL, instagramHandle: $instagramHandle, showcaseURL: $showcaseURL) {
    _id
    userID
    description
    reason
    status
    twitterHandle
    instagramHandle
    websiteURL
    showcaseURL
    createdAt
    updatedAt
  }
}
`;

export const rateArtist = gql`
mutation rateArtist($fromUserID: String!, $artistUserID: String!, $rating: Int!) {
  rateArtist(fromUserID: $fromUserID, artistUserID: $artistUserID, rating: $rating) {
    id
    displayName
    walletAddress
    userID
    username
    website
    email
    isCreatorApplicationInReview
    shortBio
    twitter
    isCreator
    banner
    profilePic
    artistStats{
      userID
      ratings
      isFollower
    }
    allNFTs {
      id
      tokenID
      collectionID
      itemImage
      collectionDetails{
        collectionID
        name
      }
      itemDescription
      itemName
      country
      isMinted
      forSale
      ownerAddress
    }
  }
}
`;

export const burnNFT = gql`
mutation burnNFT($id: String!, $userID: String!, $isLand: Boolean!) {
  burnNFT(id: $id, userID: $userID, isLand: $isLand){
    id
  }
}
`;

export const generateHypervergeToken = gql`
mutation generateHypervergeToken {
  generateHypervergeToken{
    status
    statusCode
    result
  }
}
`;

export const reportNFT = gql`
mutation reportNFT($userID: String!, $collectionID: String!, $tokenID: String!, $reason: String!) {
  reportNFT(userID: $userID, collectionID: $collectionID, tokenID: $tokenID, reason: $reason) {
    id
  }
}
`;

const UpdateProfile = gql`
mutation UpdateProfile($id: String!, $displayName: String, $username: String!, $shortBio: String, $email: String, $website: String, $twitter: String) {
  updateProfile(id: $id, displayName: $displayName, username: $username shortBio: $shortBio, email: $email, website: $website, twitter: $twitter){
    _id
    displayName
    isCreator
    isCreatorApplicationInReview
    isVerified
    username
    banner
    profilePic
    shortBio
    email
    website
    twitter
    facebook
    instagram
    discord
    telegram
    behance
    linkedIn
    isKYCVerified
    kycStatus
    kycDetails
    createdAt
    updatedAt
    ratings
    totalFollowers
  }
}`

export const uploadProfilePic = gql`
mutation uploadProfilePic($id: String!, $imageURL: String!) {
  uploadProfilePic(id: $id, imageURL: $imageURL){
    _id
    displayName
    username
    website
    email
    isCreatorApplicationInReview
    shortBio
    profilePic
    twitter
    isCreator
  }
}`

export const UploadProfileBanner = gql`
mutation UploadProfileBanner($id: String!, $imageURL: String!) {
  UploadProfileBanner(id: $id, imageURL: $imageURL){
    _id
    displayName
    username
    website
    email
    isCreatorApplicationInReview
    shortBio
    profilePic
    banner
    twitter
    isCreator
  }
}`

export const UpdateKYC = gql`
mutation UpdateKYC($id: String!, $success: Boolean!, $status: String!, $kycDetails: String!){
  updateKYCStatus(
    id: $id
    success: $success
    status: $status
    kycDetails: $kycDetails
  ){
    id
    displayName
    walletAddress
    userID
    username
    website
    email
    isCreatorApplicationInReview
    shortBio
    profilePic
    isKYCVerified
    banner
    twitter
    isCreator
    artistStats{
      userID
      ratings
      isFollower
    }
    allNFTs {
      id
      tokenID
      collectionID
      itemImage
      collectionDetails{
        collectionID
        name
      }
      itemDescription
      itemName
      country
      isMinted
      forSale
      ownerAddress
    }
  }
}
`

const CREATE_USER = gql`
mutation createUser($displayName: String!, $email: String!, $username: String!, $country: String!){
  createUser(
    displayName: $displayName
    email: $email
    username: $username
    country: $country
  ){
    _id
    displayName
    username
    email
  }
}
`

const SEND_EMAIL = gql`
mutation sendEmailOtp($email: String!){
    sendEmailOtp(email: $email){
      message
    }
  }
`

const VERIFY_OTP = gql`
  mutation verifyOtp($email: String!, $otp: Int!){
    verifyOtp(email: $email, otp: $otp){
      message
    }
  }
`

export const SIGNUP_GOOGLE = gql`
mutation signUpGoogle($token: String!, $country: String!){
  signUpGoogle(token: $token, country: $country){
    _id
    displayName
    walletAddress
    username
    email
  }
}`

export const VERIFY_OTP_LOGIN = gql`
mutation verifyOtpLogin($email: String!, $otp: Int!){
  verifyOtpLogin(email: $email, otp: $otp){
    message
    user{
      _id
      username
      displayName
      email
      banner
      walletAddress
      profilePic
    }
  }
}`

export const UPDATE_WALLET_ADDRESS = gql`
  mutation updateWalletAddress($id: ID!, $address: String!){
    updateWalletAddress(id: $id, address: $address){
      walletAddress
    }
  }
`

export const CREATE_NFT_TRANSACTION = gql`
mutation CreateNFTTransactionHistory($nftId: String!, $ownerId: String!, $hash: String!, $quantity: Int!, $listingId: String, $buyerId: String, $sellerId: String, $price: String, $transactionType: String, $transactionId: String) {
  createNFTTransactionHistory(nftId: $nftId, ownerId: $ownerId, hash: $hash, quantity: $quantity, listingId: $listingId, buyerId: $buyerId, sellerId: $sellerId, price: $price, transactionType: $transactionType, transactionId: $transactionId)
}
`

export const CREATE_COLLECTION = gql`
mutation CreateCollection($name: String!, $collectionAddress: String!, $description: String, $banner: String, $imageUrl: String, $launchDate: String, $isUnique: Boolean, $walletAddress: String, $transactionHash: String, $nftType: String, $royaltyPercentage: Int!) {
  createCollection(name: $name, collectionAddress: $collectionAddress, description: $description, banner: $banner, imageURL: $imageUrl, launchDate: $launchDate, isUnique: $isUnique, walletAddress: $walletAddress, transactionHash: $transactionHash, nftType: $nftType, royaltyPercentage: $royaltyPercentage) {
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
    createdAt
    updatedAt
  }
}
`

export const CREATE_NFT = gql`
mutation CreateNFT($tokenId: String!, $collectionId: String!, $itemName: String!, $itemDescription: String!, $itemImage: String!, $metaDataUrl: String!, $price: String, $isMinted: Boolean, $assetFormat: String, $itemIpfsImage: String, $categoryId: String, $nftType: String, $tokenQty: String, $royalty: String, $creatorAddress: String, $ownerAddress: String, $isCelebrityAuction: Boolean, $auctionStartPrice: String, $auctionEndTime: String, $isOpenEdition: Boolean, $collectionaddress: String, $transactionHash: String, $isUserCreated: Boolean) {
  createNFT(tokenID: $tokenId, collectionID: $collectionId, itemName: $itemName, itemDescription: $itemDescription, itemImage: $itemImage, metaDataURL: $metaDataUrl, price: $price, isMinted: $isMinted, assetFormat: $assetFormat, itemIPFSImage: $itemIpfsImage, categoryId: $categoryId, nftType: $nftType, tokenQty: $tokenQty, royalty: $royalty, creatorAddress: $creatorAddress, ownerAddress: $ownerAddress, isCelebrityAuction: $isCelebrityAuction, auctionStartPrice: $auctionStartPrice, auctionEndTime: $auctionEndTime, isOpenEdition: $isOpenEdition, collectionaddress: $collectionaddress, transactionHash: $transactionHash, isUserCreated: $isUserCreated) {
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

export { AddCustomInfo, CancelNFTSale, PutOnSale, purchaseNFT, mintLand, UpdateProfile, CREATE_USER, VERIFY_OTP, SEND_EMAIL }



