
import { createElement } from "react";
import Link from "next/link"
import { memo, useEffect, useState, cloneElement } from "react"
import { CollectionTimeActions } from "../../components/core/ActionGroups";
import { SearchNormal, Filter, ArrowDown2, CloseCircle } from "iconsax-react"
import { motion } from "framer-motion"
import { Accordion, AccordionDetails, AccordionSummary, ButtonBase, Chip, Drawer, IconButton } from "@mui/material";
import TabTransition from "../../components/core/TabTransition";
import PageTransition from "../../components/core/PageTransition";
import { isMobileChecker } from "../../utility";
import { useQuery } from "@apollo/client";
import Router from "next/router";
const tabs = [
    {
        name: "Collections",
        href: "/discover/collections",
        path: "collections"
    },
    {
        name: "NFTs",
        href: "/discover/nfts",
        path: "nfts"
    },
    {
        name: "Users",
        href: "/discover/users",
        path: "users"
    }
]

function Filters({ expandedView, filterValues, setFilterValues, setFilter }) {
    const [priceError, setPriceError] = useState({
        minPrice: false,
        maxPrice: false
    })
    return (
        <div style={{ height: "fit-content" }} className={`col-span-3 mt-6 sticky top-20 border-[1px] border-white/20 rounded-3xl`} >
            <Accordion defaultExpanded className="bg-transparent shadow-none border-b-[1px] border-white/5 rounded-none p-3" style={{ backgroundImage: "none", background: "transparent" }} >
                <AccordionSummary expandIcon={<ArrowDown2 />} >
                    <div className="flex flex-row items-center gap-2">
                        <span>Price</span> <Chip label="IYX" />
                    </div>
                </AccordionSummary>
                <AccordionDetails style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: 'center',
                }} >
                    {priceError.minPrice && <span className="text-red-600 mb-1 text-xs inline-block">Min Price cannot be higher than Max Price!</span>}
                    <input
                        placeholder="Min"
                        style={{
                            width: "40%",
                            padding: "10px",
                            background: "transparent",
                            border: "1px solid #ffffff38",
                            borderRadius: "8px"
                        }}
                        className="p-3 bg-transparent rounded-xl px-6  transition-all border-[1px] border-white/10"
                        value={filterValues.minPrice}
                        onChange={(e) => {
                            setFilterValues((prev) => {
                                setPriceError({ minPrice: false, maxPrice: false })
                                return { ...prev, minPrice: e.target.value.toString() }
                            })
                        }
                        }
                        onBlur={(e) => {
                            if (e.target.value !== "" && e.target.value > parseInt(filterValues.maxPrice)) {
                                setPriceError((prev) => {
                                    return { ...prev, minPrice: true }
                                })
                            }
                        }}
                    />
                    <span className="opacity-40">to</span>
                    <input
                        placeholder="Max"
                        style={{
                            width: "40%",
                            padding: "10px",
                            background: "transparent",
                            border: "1px solid #ffffff38",
                            borderRadius: "8px"
                        }}
                        value={filterValues.maxPrice}
                        onChange={(e) => {
                            setFilterValues((prev) => {
                                setPriceError({ minPrice: false, maxPrice: false })
                                return { ...prev, maxPrice: e.target.value.toString() }
                            })
                        }
                        }
                        onBlur={(e) => {
                            if (e.target.value !== "" && e.target.value < parseInt(filterValues.minPrice)) {
                                setPriceError((prev) => {
                                    return { ...prev, maxPrice: true }
                                })
                            }
                        }}
                    />
                    {priceError.maxPrice && <span className="text-red-600 mt-1 text-xs inline-block">Max Price cannot be lower than Min Price!</span>}
                    {/* <button className="bg-white/5 px-6 p-3 rounded-xl ml-2" >IYX</button> */}
                </AccordionDetails>
            </Accordion>

            {/* <Accordion defaultExpanded className="bg-transparent shadow-none border-b-[1px] border-white/5 rounded-none p-3" style={{ backgroundImage: "none", background: "transparent" }} >
                <AccordionSummary expandIcon={<ArrowDown2 />} >
                    Status
                </AccordionSummary>
                <AccordionDetails style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    flexWrap: "wrap",
                    alignItems: 'center',
                }} >
                    <Chip label="All" clickable variant={filterValues.status === "All" ? "filled" : "outlined"} onClick={() => setFilterValues((prev) => { return { ...prev, status: "All" } })} />
                    <Chip label="Buy Now" clickable variant={filterValues.status === "Buy Now" ? "filled" : "outlined"} onClick={() => setFilterValues((prev) => { return { ...prev, status: "Buy Now" } })} />
                    <Chip label="Live Auction" clickable variant={filterValues.status === "Live Auction" ? "filled" : "outlined"} onClick={() => setFilterValues((prev) => { return { ...prev, status: "Live Auction" } })} />
                </AccordionDetails>
            </Accordion> */}

            <Accordion defaultExpanded className="bg-transparent shadow-none border-b-[1px] border-white/5 rounded-none p-3" style={{ backgroundImage: "none", background: "transparent" }} >
                <AccordionSummary expandIcon={<ArrowDown2 />} >
                    Type
                </AccordionSummary>
                <AccordionDetails style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    flexWrap: "wrap",
                    alignItems: 'center',
                }} >
                    <Chip label="All" clickable variant={filterValues.nftType === "" ? "filled" : "outlined"} onClick={() => setFilterValues((prev) => { return { ...prev, nftType: "" } })} />
                    <Chip label="Single Edition" clickable variant={filterValues.nftType === "erc721" ? "filled" : "outlined"} onClick={() => setFilterValues((prev) => { return { ...prev, nftType: "erc721" } })} />
                    <Chip label="Multiple Editions" clickable variant={filterValues.nftType === "erc1155" ? "filled" : "outlined"} onClick={() => setFilterValues((prev) => { return { ...prev, nftType: "erc1155" } })} />
                </AccordionDetails>
            </Accordion>
            <div className="p-2 flex justify-end items-end align-middle ">
                <ButtonBase className="rounded-full align-middle items-end justify-end w-full">
                    <button
                        className="md:px-4 md:py-2 px-3 py-2 border-[1px] border-white/20 hover:border-white/30 font-sans w-full rounded-full "
                        onClick={() => {
                            if (!priceError.minPrice && !priceError.maxPrice) {
                                setFilter(true);
                                setTimeout(() => {
                                    setFilter(false);
                                }, 500);
                            }
                        }}
                    >
                        Apply
                    </button>
                </ButtonBase>
            </div>
        </div>
    )
}

function LayoutWrapper({ children }) {
    const [activePage, setActivePage] = useState('');
    const [expandedView, setExpandedView] = useState(false);
    const [isMobile, setisMobile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState(false)
    const [filterValues, setFilterValues] = useState({
        minPrice: "",
        maxPrice: "",
        status: "All",
        nftType: ""
    });

    const TabsDOM = tabs.map((tab) => (
        <Link className={`${tab.path === activePage ? "font-bold" : "font-sans opacity-50"} md:text-2xl text-xl `} href={tab.href} >
            {tab.name}
        </Link>
    ))

    useEffect(() => {
        window.addEventListener('resize', () => {
            Router.reload()
            // setisMobile(isMobileChecker
        })
        setisMobile(isMobileChecker());
        const pagePath = window.location.pathname?.split('/')?.[2]
        setActivePage(pagePath)
    }, [])

    if (!children) return <div />

    return (
        // <PageTransition>
        <div className=" transition-all">
            <div className="flex flex-col py-2 items-start w-11/12 mx-auto justify-start gap-2 font-sans max-w-screen-2xl " >
                <div className="flex py-2 md:flex-row flex-col gap-4 items-start md:items-center justify-between w-full" >
                    <div className="flex flex-row items-start justify-start gap-6" >
                        {TabsDOM}
                    </div>
                    <div className="flex flex-row md:flex-row items-center justify-center gap-2 md:w-1/2 w-full" >
                        <div className="flex flex-row w-full bg-transparent relative hover:border-white/30 rounded-full border-[1px] border-white/20 outline-none " >
                            <input onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Search by ${activePage}`} className="p-3 bg-transparent rounded-full px-6 w-full transition-all focus:outline-transparent" />
                            <SearchNormal size="18" className="mr-10 outline-primary absolute -right-5 top-4" />
                        </div>
                        {/* <div className="flex flex-row gap-4"> */}
                        {/* {activePage !== 'users' ? <CollectionTimeActions /> : null} */}
                        {isMobile ? <div className="border-[1px] border-white/10 rounded-full">
                            <ButtonBase className={`p-3 ${expandedView ? "bg-transparent" : "bg-white/5"}  rounded-full px-4 gap-2`} onClick={() => setExpandedView(!expandedView)} >
                                <p>Filters</p>
                                <Filter className="text-primary" size="20" />
                            </ButtonBase>
                        </div> : null}
                        {/* </div> */}
                    </div>
                </div>
                <div className="w-full grid grid-cols-12 gap-4 transition-all" >

                    <div className={`${isMobile || activePage === 'users' ? "col-span-12" : "col-span-9"} `} >
                        <TabTransition>
                            {/* {children} */}
                            {cloneElement(children, { searchQuery, filterValues, filter })}
                        </TabTransition>
                    </div>


                    {isMobile ?
                        <Drawer PaperProps={{
                            sx: {
                                borderRadius: 5,
                                padding: "15px 15px",
                                backgroundImage: "linear-gradient(45deg, #da1b9b21, #15ddff1c)",
                                backgroundColor: "#07071B"
                            }
                        }} open={expandedView} onBackdropClick={() => setExpandedView(false)} anchor="bottom" >
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", padding: "15px 15px" }}>
                                <p style={{ fontSize: 20, fontFamily: "DM Sans" }}>Filters</p>
                                <IconButton onClick={() => setExpandedView(false)} >
                                    <CloseCircle />
                                </IconButton>
                            </div>
                            {activePage === 'collections' || activePage === 'nfts' ? <Filters filterValues={filterValues} setFilterValues={setFilterValues} setFilter={setFilter} /> : null}
                        </Drawer> :
                        <>
                            {activePage === 'collections' || activePage === 'nfts' ?
                                <Filters filterValues={filterValues} setFilterValues={setFilterValues} setFilter={setFilter} />
                                : null}
                        </>
                    }


                </div>
            </div>
        </div>
        // </PageTransition>
    )
}

export default memo(LayoutWrapper)