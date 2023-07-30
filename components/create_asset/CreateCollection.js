import { Formik, Form, Field, ErrorMessage } from "formik"
import Image from "next/image"
import { CREATE_COLLECTION } from "../../apollo/api/mutations"
import { useMutation } from "@apollo/client"
import { useEffect, useRef, useState } from "react"
import { uploadFileToS3 } from "../../utility"
import { useAccount } from "wagmi"
import * as Yup from "yup"
import Loader from "../core/Loader"
import { ethers } from "ethers"
import { FACTORY } from "../../contracts/Addresses"
import FactoryABI from "../../contracts/FactoryABI.json";
import { CircularProgress } from "@mui/material"
import { POLYGON_MUMBAI_RPC } from "../../constants"

const INITIAL_STATUS = {
    status: '',
    title: '',
    description: ""
}

function CreateCollection(props) {
    const { address } = useAccount()
    const [createCollection, { data, error, loading }] = useMutation(CREATE_COLLECTION)
    const [profileBuffer, setProfileBuffer] = useState('/dummyAvatar.png')
    const [profileObj, setProfileObj] = useState(null)
    const [loader, setLoader] = useState(false);
    const { isConnected } = useAccount()
    const { setTransactionStatus, setInfo, setShowCreateCollection } = props

    const validationSchema = Yup.object().shape({
        displayName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .required("Enter your display name"),
        description: Yup.string()
            .min(2, "Too Short!")
            .max(250, "Too Long!")
            .required("Enter your description"),
        symbol: Yup.string()
            .min(0, "Too Short!")
            .max(50, "Too Long!")
            .required("Enter your symbol"),
        royalty: Yup.number()
            .min(0, "Too Short!")
            .max(15, "Too Long!")
            .required("Enter your royalty")
    });


    async function handleCreateCollection(values) {
        const userMetadata = JSON.parse(window.localStorage.getItem('metadata'))
        if (!isConnected) {
            setInfo({ type: 'error', message: "Please connect your wallet to make transactions" });
            setTimeout(() => {
                setInfo({});
            }, 3000)
            return
        }
        setTransactionStatus({
            status: 'progress',
            title: 'Transaction in progress',
            description: "Your transaction is being processed by the Polygon network. You will be notified when it has been completed."
        })
        try {
            setShowCreateCollection(false)
            await ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []); // <- this promps user to connect metamask
            let signer = provider.getSigner();
            let signerAddress = await signer.getAddress()
            const RpcProvider = new ethers.providers.JsonRpcProvider(
                POLYGON_MUMBAI_RPC
            );

            const createCollectionRead = new ethers.Contract(
                FACTORY,
                FactoryABI,
                RpcProvider
            );
            const createCollectionWrite = new ethers.Contract(
                FACTORY,
                FactoryABI,
                signer
            );
            const contractForCollection = await createCollectionWrite.createCollection(props.nftType === 'erc721' ? 0 : 1, values.displayName, values.symbol);

            const receipt = await contractForCollection.wait();
            const collectionAddress = receipt.events[receipt.events.length - 2].args.collectionAddress;
            const transactionHash = receipt.events[receipt.events.length - 2].transactionHash;
            console.log(transactionHash)
            const imageUrl = await uploadFileToS3(profileObj);
            createCollection({
                variables: {
                    name: values.displayName,
                    banner: imageUrl,
                    description: values.description,
                    imageUrl: imageUrl,
                    launchDate: '0',
                    isUnique: true,
                    royaltyPercentage: values.royalty,
                    collectionAddress: collectionAddress,
                    walletAddress: address,
                    nftType: props.nftType,
                    transactionHash: transactionHash
                }
            }).then(() => {
                setTransactionStatus({
                    status: 'completed',
                    title: 'Transaction completeted',
                    description: "Your transaction is processed by the Polygon network."
                })
                setTimeout(() => {
                    setTransactionStatus(INITIAL_STATUS)
                }, 3000)
            }).catch(() => {
                setTransactionStatus({
                    status: 'error',
                    title: 'Transaction failed',
                    description: "Your transaction is failed while processing in the Polygon network."
                })
                setTimeout(() => {
                    setTransactionStatus(INITIAL_STATUS)
                    setShowCreateCollection(true)
                }, 3000)
            })
        } catch (e) {
            setTransactionStatus({
                status: 'error',
                title: 'Transaction failed',
                description: "Your transaction is failed while processing in the Polygon network."
            })
            setTimeout(() => {
                setTransactionStatus(INITIAL_STATUS)
                setShowCreateCollection(true)
            }, 3000)
        }
    }

    const handleProfileChange = (file) => {
        setProfileObj(file)

        var reader = new FileReader();

        reader.onload = function (e) {
            setProfileBuffer(e.target.result)
        }

        reader.readAsDataURL(file);

    }

    return (
        <div className="bg-background bg-gradient-to-tr from-primary/10 to-secondary/10 w-11/12 md:w-1/2 lg:w-1/3 z-50 p-5 overflow-y-scroll h-3/4 no-scroll md:p-10 rounded-2xl font-sans ">
            {!loader ?
                <>
                    <p className="text-xl font-bold" >Create Collection - {props.nftType.toUpperCase()}</p>
                    <div className="grid grid-cols-3 items-center justify-center my-5 gap-3 md:gap-6" >
                        <div className="col-span-1 w-30 h-32 rounded-xl bg-white/10">
                            <Image src={profileBuffer} width={100} height={100} alt='placeholder' className="object-cover w-full h-[100%] rounded-xl" />
                        </div>
                        <div className="flex flex-col items-start col-span-2" >
                            <span>At least 300x300 pixels, max. size 5MB, GIF, JPEG or PNG</span>
                            <div className="mt-2">
                                <input onChange={(e) => handleProfileChange(e.target.files[0])} type="file" />
                            </div>
                        </div>
                    </div>

                    <Formik
                        initialValues={{
                            displayName: "",
                            symbol: "",
                            description: "",
                            royalty: ''
                        }}
                        validateOnChange
                        enableReinitialize
                        validateOnBlur
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            handleCreateCollection(values);
                            // resetForm()
                            // sendJsontoIPFS(values, imageUrl, fileFormat);
                        }}
                    >
                        {({ values, errors, touched }) => {
                            return (
                                <Form className="w-full">
                                    <div className="mt-4 flex w-full flex-col">
                                        <label htmlFor="name">Display Name</label>
                                        <Field
                                            name="displayName"
                                            id="displayName"
                                            type="text"
                                            placeholder="enter display name"
                                            className="mt-2 rounded-xl bg-white/5 p-4"
                                        />
                                        <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                                            <ErrorMessage name="displayName" />
                                        </p>
                                    </div>
                                    <div className="mt-2 flex w-full flex-col">
                                        <label htmlFor="name">Symbol</label>
                                        <Field
                                            name="symbol"
                                            id="symbol"
                                            type="text"
                                            placeholder="enter symbol name"
                                            className="mt-2 rounded-xl bg-white/5 p-4"
                                        />
                                        <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                                            <ErrorMessage name="symbol" />
                                        </p>
                                    </div>
                                    <div className="mt-2 flex w-full flex-col">
                                        <label htmlFor="royalty">Royalty (Max 15%)</label>
                                        <Field
                                            name="royalty"
                                            id="royalty"
                                            type="number"
                                            placeholder="enter royalty percentage"
                                            className="mt-2 rounded-xl bg-white/5 p-4"
                                        />
                                        <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                                            <ErrorMessage name="royalty" />
                                        </p>
                                    </div>
                                    <div className="mt-2 flex w-full flex-col">
                                        <label htmlFor="name">Description</label>
                                        <Field
                                            name="description"
                                            id="description"
                                            type="text"
                                            placeholder="enter description name"
                                            className="mt-2 rounded-xl bg-white/5 p-4"
                                        />
                                        <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                                            <ErrorMessage name="description" />
                                        </p>
                                    </div>
                                    {/* <div className="mt-2 flex w-full flex-col">
                                        <label htmlFor="name">Collection Type</label>
                                        <Field
                                            as="select"
                                            name="collectionType"
                                            id="collectionType"
                                            type="text"
                                            placeholder="enter collectionType name"
                                            className="mt-2 rounded-xl bg-white/5 p-4"
                                        >
                                            <option value="erc721" >ERC721</option>
                                            <option value="erc1155">ERC1155</option>
                                        </Field>
                                        <p className="font-spaceMonoregular mr-4 mt-2 self-end text-xs tracking-wide text-red-600">
                                            <ErrorMessage name="description" />
                                        </p>
                                    </div> */}
                                    <button type="submit" className="bg-gradient-to-r from-primary to-secondary p-4 w-full rounded-xl mt-2" >
                                        Create collection
                                    </button>
                                </Form>
                            )
                        }}
                    </Formik>
                </> : <div className="flex items-center justify-center h-[100%]" ><CircularProgress /></div>
            }
        </div>
    )
}

export default CreateCollection