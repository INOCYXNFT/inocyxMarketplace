"use client"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Gallery from "../../components/artist/Gallery"
import Hero from "../../components/artist/Hero"
import NFTLanding from "../../components/artist/NFTListing"
import client from "../../apollo/apolloClient"
import { FIND_CELEBRITY_BY_ID } from "../../apollo/api/query"
import { useLazyQuery, useQuery } from "@apollo/client"
import PageTransition from "../../components/core/PageTransition"
import Modal from "../../components/core/Modal"
import { ethers } from "ethers"
import LimitedEditionABI from "../../contracts/LimitedEditionNFT_ABI.json"
import LimitedTimeABI from "../../contracts/LimitedTimeNFT_ABI.json"
import IOXToken from "../../contracts/InocyxToken_ABI.json"
import { LIMITED_EDITION, LIMITED_TIME, IOX } from "../../contracts/Addresses"
import { CircularProgress, TextField, Button } from "@mui/material"
import { useAccount } from "wagmi"
import { Snackbar, Alert, AlertTitle } from "@mui/material"
import LottieLoader from "../../components/core/LottieLoader"
import { CREATE_NFT_TRANSACTION } from "../../apollo/api/mutations"
import { POLYGON_MUMBAI_RPC } from "../../constants"

const INITIAL_STATUS = {
    status: '',
    title: '',
    description: ""
}

const Celebrity = () => {
    const router = useRouter();
    const [transactionStatus, setTransactionStatus] = useState(INITIAL_STATUS);
    const [copiesModal, setCopiesModal] = useState({});
    const { isConnected, address } = useAccount()
    const [info, setInfo] = useState({})
    const [copies, setCopies] = useState('');
    const [fetchCelebrity, { data, loading, error, refetch }] = useLazyQuery(FIND_CELEBRITY_BY_ID)

    useEffect(() => {
        if (router.isReady) {
            fetchCelebrity({
                variables: {
                    id: router.query.id
                }
            })
        }
    }, [router])

    const listing = [
        {
            id: 1,
            name: data?.findCelebrityById.name,
            description: "An NFT Marketplace is a decentralized platform that allows trading and storing Non-fungible tokens. ",
            auctionStartsOn: "02/23/2022",
            price: "23,0002.030 INR",
            benefits: "dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. ",
            editions: "2/2",
            image: "https://cdn.pixabay.com/photo/2022/02/08/06/35/bear-7000852_1280.jpg",
        },
        {
            id: 1,
            name: data?.findCelebrityById.name,
            description: "An NFT Marketplace is a decentralized platform that allows trading and storing Non-fungible tokens. ",
            auctionStartsOn: "02/23/2022",
            price: "23,0002.030 INR",
            benefits: "dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. ",
            editions: "2/2",
            image: "https://cdn.pixabay.com/photo/2022/02/08/06/35/bear-7000852_1280.jpg",
        },
        {
            id: 1,
            name: data?.findCelebrityById.name,
            description: "An NFT Marketplace is a decentralized platform that allows trading and storing Non-fungible tokens. ",
            auctionStartsOn: "02/23/2022",
            price: "23,0002.030 INR",
            benefits: "dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. ",
            editions: "2/2",
            image: "https://cdn.pixabay.com/photo/2022/02/08/06/35/bear-7000852_1280.jpg",
        }
    ]


    async function handleMintNFT(nftMetadata) {
        const RpcProvider = new ethers.providers.JsonRpcProvider(
            POLYGON_MUMBAI_RPC
        );
        const { isOpenEdition } = nftMetadata
        const userMetadata = JSON.parse(window.localStorage.getItem('metadata'))
        if (!isConnected || !userMetadata) {
            setInfo({ type: 'error', message: "Please connect your wallet to make transactions" });
            setTimeout(() => {
                setInfo({});
            }, 3000)
            return
        }
        setCopiesModal({})
        setTransactionStatus({
            status: 'progress',
            title: 'Transaction in progress',
            description: "Your transaction is being processed by the Polygon network. You will be notified when it has been completed."
        })
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
            let signer = provider.getSigner();
            let signerAddress = await signer.getAddress()
            let limitedTimeRead = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, RpcProvider); // 
            let limitedTimeWrite = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, signer);
            let limitedEditionRead = new ethers.Contract(LIMITED_EDITION, LimitedEditionABI, RpcProvider); // 
            let limitedEditionWrite = new ethers.Contract(LIMITED_EDITION, LimitedEditionABI, signer);
            let iox = new ethers.Contract(IOX, IOXToken, signer);
            let transaction_hash = ''
            if (isOpenEdition) {
                const ether = ethers.utils.parseEther((parseInt(copies) * 2).toString()); // 10 for Limited Edition
                const wei = ether.toString();
                let approved = await iox.approve(LIMITED_TIME, wei)
                await approved.wait()
                console.log(approved)
                const hash = await provider.getTransactionReceipt(approved.hash)
                console.log(hash, copies)
                let buy = await limitedTimeWrite.mintTokens(copies)
                await buy.wait()
                const buyhash = await provider.getTransactionReceipt(buy.hash)
                transaction_hash = buyhash.transactionHash
            } else {
                const ether = ethers.utils.parseEther((parseInt(copies) * 10).toString()); // 10 for Limited Edition
                const wei = ether.toString();
                let approved = await iox.approve(LIMITED_EDITION, wei)
                await approved.wait()
                console.log(approved)
                const hash = await provider.getTransactionReceipt(approved.hash)
                console.log(hash, copies)
                let buy = await limitedEditionWrite.mintTokens(nftMetadata.tokenID, copies)
                await buy.wait()
                const buyhash = await provider.getTransactionReceipt(buy.hash)
                transaction_hash = buyhash.transactionHash
            }
            client.mutate({
                mutation: CREATE_NFT_TRANSACTION,
                variables: {
                    nftId: nftMetadata._id,
                    ownerId: userMetadata._id,
                    quantity: parseInt(copies),
                    price: isOpenEdition ? copies : (parseInt(copies) * 10).toString(),
                    hash: transaction_hash,
                    buyerId: userMetadata._id,
                    sellerId: '',
                    transactionType: 'mint'
                }
            }).then(() => {
                setTransactionStatus({
                    status: 'completed',
                    title: 'Transaction completeted',
                    description: "Your transaction is processed by the Polygon network."
                })
                setTimeout(() => {
                    setTransactionStatus(INITIAL_STATUS)
                    window.location.reload()
                }, 3000)
            })
            // let buy = await limitedEditionWrite.mint('1', copies)
            // await buy.wait()
            // const buyhash = await provider.getTransactionReceipt(buy.hash)
            // console.log(buyhash.transactionHash)
            // setLoadingModal(false)
            // setTransactionStatus({
            //     status: 'completed',
            //     title: 'Transaction completed',
            //     description: "Your transaction is processed by the Polygon network."
            // })
            // setTimeout(() => {
            //     setTransactionStatus(INITIAL_STATUS)
            // }, 2000)

        } catch (e) {
            console.log(e)
            setTransactionStatus({
                status: 'error',
                title: 'Transaction failed',
                description: "Your transaction is failed while processing in the Polygon network."
            })
            // setIsTransactionProcessing(false)
        }
    }

    async function handleMintTimeNFT(docId, quantity) {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
            let signer = provider.getSigner();
            let signerAddress = await signer.getAddress();
            let limitedTimeRead = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, RpcProvider); // 
            let limitedTimeWrite = new ethers.Contract(LIMITED_TIME, LimitedTimeABI, signer);
            let iox = new ethers.Contract(IOX, IOXToken, signer);
            const ether = ethers.utils.parseEther(copies); // 10 for Limited Edition
            const wei = ether.toString();
            let approved = await iox.approve(LIMITED_EDITION, wei)
            await approved.wait()
            const hash = await provider.getTransactionReceipt(approved.hash)
            console.log(hash, signerAddress, copies)
            let buy = await limitedTimeWrite.mint(signerAddress, copies)
            await buy.wait()
            const buyhash = await provider.getTransactionReceipt(buy.hash)
            console.log(buyhash.transactionHash)
            // client.mutate({
            //     mutation: MARKETPLACE_NFT_BUY,
            //     variables: {
            //         userId: walletAddress,
            //         nftId: nftData?.nft_id,
            //         refId: docId,
            //         quantity: quantity,
            //         transactionHash: buyhash.transactionHash
            //     }
            // }).then((ticket) => {
            //     window.location.reload()
            // }).catch(error => {
            //     // setIsTransactionProcessing(false)
            // })
        } catch (e) {
            // setIsTransactionProcessing(false)
        }
    }

    return (
        <PageTransition>
            <Snackbar
                open={Object.keys(info)?.length > 0}
                autoHideDuration={6000}
                onClose={() => setInfo({})}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                style={{ zIndex: 99999 }}
            >
                <Alert variant="filled" onClose={() => setInfo({})} severity={info.type} sx={{ width: '100%' }}>
                    <AlertTitle>{info.type}</AlertTitle>
                    {info.message}
                </Alert>
            </Snackbar>
            <Modal open={transactionStatus.status.length > 0} backdropClosable={false} closable={false}>
                <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
                    <LottieLoader loader_name={transactionStatus.status} loading={true} loop={true} />
                    <h3 className="font-KronaOne text-xl self-center " >{transactionStatus.title}</h3>
                    <span className="my-2 text-md opacity-60 self-center text-center" >{transactionStatus.description}</span>
                    {transactionStatus.status !== 'progress' ? <Button className="bg-gradient-to-r from-primary to-secondary text-white" onClick={() => setTransactionStatus(INITIAL_STATUS)} >Ok</Button> : null}
                </div>
            </Modal>
            <Hero celebrityData={data?.findCelebrityById} />
            {data?.findCelebrityById?.nfts.map((list, index) => (
                <NFTLanding setCopiesModal={setCopiesModal} nft={list} dir={index % 2} />
            ))}
            <Modal open={Object.keys(copiesModal).length > 0} backdropClosable={false} handleClose={() => { setCopiesModal({}); setCopies('') }} closable={true}>
                <div className="flex flex-col items-center justify-center bg-background w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-1/3 z-50 p-10 rounded-xl"  >
                    <h3 className="font-KronaOne text-2xl self-start " >Editions ({copiesModal.isOpenEdition ? 'Unlimited' : '100'})</h3>
                    <span className="my-2 text-lg opacity-60 self-start" >Please enter number of editions for minting </span>
                    <TextField
                        label="Copies"
                        variant="outlined"
                        type="number"
                        value={copies}
                        inputMode="number"
                        inputProps={{ min: 0, max: copiesModal.isOpenEdition ? 3000000000000 : 100 }}
                        className="w-full my-6"
                        onChange={(e) => { setCopies(e.target.value) }}
                    />
                    <Button
                        disabled={parseInt(copies) <= 0}
                        className=" w-content self-start px-8 rounded-xl text-white btn-gradient p-3 hover:brightness-110"
                        onClick={() => handleMintNFT(copiesModal)}
                    >
                        Submit
                    </Button>
                </div>
            </Modal>
            {/* 
            <Gallery celebrityData={data?.findCelebrityById} /> */}
        </PageTransition>
    )
}

export default Celebrity