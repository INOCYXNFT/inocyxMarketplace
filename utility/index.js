import { ethers } from "ethers"
import axios from "axios"
import moment from "moment"
import AWS from "aws-sdk";
import client from "../apollo/apolloClient";
import { createS3File } from "../apollo/api/mutations";
import { v4 as uuidv4 } from "uuid"

const truncateAddress = (address) => {
  if (!address) return ""
  return address.substring(0, 5) + "..." + address.substring(15, 20)
}

const isMobileChecker = function () {
  let check = false;
  if (navigator) {
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true
    })(navigator.userAgent || navigator.vendor || window.opera)
  }
  return check
}

const dateFormat = (date) => {
  return moment(parseInt(date)).format("DD MMM YYYY, HH:MM A")
}

export async function verifyUrl(url) {
  if (!url || !url.match(/^https?:\/\//)) {
    return false;
  }

  // Create an XMLHttpRequest object.
  const request = new XMLHttpRequest();

  // Set the request method to GET.
  request.open('GET', url, true);

  // Send the request.
  request.send();

  // Check the response status code.
  if (request.status === 200) {
    // The URL is accessible.
    return true;
  } else {
    // The URL is not accessible.
    return false;
  }
}

export async function handleBuyTicket(docId, quantity, price, listingId, setLoading, setError) {
  setLoading(true)
  try {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
    let signer = provider.getSigner();
    let marketplaceRead = new ethers.Contract(Marketplace, OmmniverseMarketplaceABI, RpcProvider);
    let marketplaceWrite = new ethers.Contract(Marketplace, OmmniverseMarketplaceABI, signer);
    let tommi = new ethers.Contract(OmmniToken, TOmmi, signer);
    const ether = ethers.utils.parseEther(price);
    const wei = ether.toString();
    let approved = await tommi.approve(Marketplace, wei)
    await approved.wait()
    const hash = await provider.getTransactionReceipt(approved.hash)
    console.log(hash)
    let buy = await marketplaceWrite.buyNFT(listingId)
    await buy.wait()
    const buyhash = await provider.getTransactionReceipt(buy.hash)
    console.log(buyhash.transactionHash)
    client.mutate({
      mutation: MARKETPLACE_NFT_BUY,
      variables: {
        userId: walletAddress,
        nftId: nftData?.nft_id,
        refId: docId,
        quantity: quantity
      }
    }).then((ticket) => {
      setLoading(false);
    }).catch(error => { setLoading(false); setError(error) })
  } catch (e) {
    setLoading(false)
    setError(e)
  }
}

export async function handleSellTicket() {
  setLoading(true)
  try {
    await ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
    let signer = provider.getSigner();
    let signerAddress = await signer.getAddress();
    let claimContractRead = new ethers.Contract(Malaysia_Trip, MarketplaceABI, RpcProvider);
    let claimContractWrite = new ethers.Contract(Malaysia_Trip, MarketplaceABI, signer);
    let marketplaceRead = new ethers.Contract(Marketplace, OmmniverseMarketplaceABI, RpcProvider);
    let marketplaceWrite = new ethers.Contract(Marketplace, OmmniverseMarketplaceABI, signer);
    let isApproved = await claimContractRead.callStatic.isApprovedForAll(signerAddress, Marketplace)
    let tommi = new ethers.Contract(OmmniToken, TOmmi, signer);
    if (!isApproved) {
      let tx = await claimContractWrite.setApprovalForAll(Marketplace, true);
      await tx.wait()
    }
    const ether = ethers.utils.parseEther(sellPrice.toString());
    const wei = ether.toString();
    let balance = await tommi.callStatic.balanceOf(signerAddress)
    console.log(balance, wei, sellPrice)
    if (balance >= wei) {
      let listTicket = await marketplaceWrite.listNFT(Malaysia_Trip, '1', sellQuantity, sellPrice)
      await listTicket.wait();
      const hash = await provider.getTransactionReceipt(listTicket.hash)
      const listingId = hash.logs?.[hash.logs.length - 2]?.topics?.[3]
      console.log("250", listTicket, hash)
      client.mutate({
        mutation: MARKETPLACE_NFT_SELL,
        variables: {
          userId: walletAddress,
          nftId: nftData?.nft_id,
          price: sellPrice,
          listingId: parseInt(listingId).toString(),
          quantity: parseInt(sellQuantity)
        }
      }).then((ticket) => {
        window.location.reload()
        setLoading(false);
      }).catch(error => setLoading(false))

      // const listingId = ethers.utils.defaultAbiCoder.decode(
      //     ["uint256"],
      //     event.data
      // )[0];
      console.log('list', listingId)
    } else {
      setLoading(false)
    }
  } catch (e) {
    console.log(e)
    setLoading(false)
  }
}

export async function handleCancelListing(_listingId) {
  setLoading(true)
  await ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
  let signer = provider.getSigner();
  let marketplaceRead = new ethers.Contract(Marketplace, OmmniverseMarketplaceABI, RpcProvider)
  // let listing = await marketplaceRead.callStatic.listings('3')
  // console.log('listing', listing)
  let marketplaceWrite = new ethers.Contract(Marketplace, OmmniverseMarketplaceABI, signer);
  const cancelListing = await marketplaceWrite.cancelListing('5')
  await cancelListing.wait()
  const hash = await provider.getTransactionReceipt(cancelListing.hash)
  console.log(hash)
  setLoading(false)
  window.location.reload()
}

export const uploadFileToS3 = async (file) => {
  const s3 = new AWS.S3({
    accessKeyId: "AKIAQU2H7AZZPKGE5AE3",
    secretAccessKey: "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",
    region: 'ap-south-1'
  });

  const filename = file.name + uuidv4();
  const bucketName = "inocyx-statics";

  try {

    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: file,
      // ACL: 'public-read',
      ContentType: file.type,
    };

    const data = await s3.upload(params).promise();
    console.log(data)
    return data.Location;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload file to S3");
  }
};

export const uploadJsonToS3 = async (json) => {
  return await client.mutate({
    mutation: createS3File,
    variables: json
  }).then((res) => res.data.createS3file)
  // const s3 = new AWS.S3({
  //   accessKeyId: "AKIAQU2H7AZZPKGE5AE3",
  //   secretAccessKey: "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",
  //   region: 'ap-south-1'
  // });

  // const bucketName = "inocyx-statics";

  // try {
  //   const params = {
  //     Bucket: bucketName,
  //     Key: `${filename}.json`,
  //     Body: JSON.stringify(file),
  //     // ACL: 'public-read',
  //     ContentType: "application/json",
  //   };

  //   const data = await s3.upload(params).promise();
  //   console.log(data)
  //   return data.Location;
  // } catch (error) {
  //   console.log(error);
  //   throw new Error("Failed to upload file to S3");
  // }
};


export { truncateAddress, isMobileChecker, dateFormat }