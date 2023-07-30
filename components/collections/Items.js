import { SearchNormal, Filter, ArrowDown2, CloseCircle } from "iconsax-react"
import { ButtonBase, Accordion, AccordionSummary, AccordionDetails, Chip, Drawer, IconButton } from "@mui/material"
import Router from "next/router"
import NFT from "../core/NFT"
import { NFTSkeleton } from "../core/SkeletonHub"
import { motion } from "framer-motion"
import TabTransition from "../core/TabTransition"
import { useEffect, useState } from "react"
import { isMobileChecker } from "../../utility"
import EmptyState from "../core/EmptyState"

function Filters({ expandedView }) {
    return (
        <div style={{ height: "fit-content" }} className={`${expandedView ? "col-span-0 hidden " : 'col-span-3'} mt-6 border-[1px] border-white/20 rounded-xl`} >
            <Accordion defaultExpanded className="bg-transparent shadow-none border-b-[1px] border-white/5 rounded-none p-3" style={{ backgroundImage: "none", background: "transparent" }} >
                <AccordionSummary expandIcon={<ArrowDown2 />} >
                    Price
                </AccordionSummary>
                <AccordionDetails style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: 'center',
                }} >
                    <input placeholder="Min" style={{
                        width: "50%",
                        padding: "10px",
                        background: "transparent",
                        border: "1px solid #ffffff38",
                        borderRadius: "8px"
                    }} className="p-3 bg-transparent rounded-xl px-6 w-full transition-all border-[1px] border-white/10" />
                    <span className="opacity-40">to</span>
                    <input placeholder="Max" style={{
                        width: "50%",
                        padding: "10px",
                        background: "transparent",
                        border: "1px solid #ffffff38",
                        borderRadius: "8px"
                    }} />
                    <button className="bg-white/5 px-6 p-3 rounded-xl ml-2" >IYX</button>
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded className="bg-transparent shadow-none border-b-[1px] border-white/5 rounded-none p-3" style={{ backgroundImage: "none", background: "transparent" }} >
                <AccordionSummary expandIcon={<ArrowDown2 />} >
                    Status
                </AccordionSummary>
                <AccordionDetails style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: 'center',
                }} >
                    <Chip label="All" clickable variant="outlined" />
                    <Chip label="Buy now" clickable variant="filled" />
                    <Chip label="Live auction" clickable variant="outlined" />
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded className="bg-transparent shadow-none border-b-[1px] border-white/5 rounded-none p-3" style={{ backgroundImage: "none", background: "transparent" }} >
                <AccordionSummary expandIcon={<ArrowDown2 />} >
                    Type
                </AccordionSummary>
                <AccordionDetails style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: 'center',
                }} >
                    <Chip label="All" clickable variant="outlined" />
                    <Chip label="Single Edition" clickable variant="filled" />
                    <Chip label="Multiple Edtions" clickable variant="outlined" />
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default function Items({ loading, data, handleFilter }) {
    const [isMobile, setisMobile] = useState(false);
    const [expandedView, setExpandedView] = useState(false);

    useEffect(() => {
        setisMobile(isMobileChecker());
    }, [])

    return (
        <TabTransition>
            <div className="flex flex-col w-full" >
                <div className="flex flex-row items-center justify-between gap-4 w-full" >
                    <div className="flex flex-row md:w-1/4 w-full bg-transparent relative hover:border-white/20 rounded-full border-[1px] border-white/10 outline-none " >
                        <input onChange={(e) => {
                            handleFilter("search", e.target.value)
                        }} placeholder={`Search by NFT's`} className="p-3 bg-transparent rounded-full px-6 w-full transition-all focus:outline-transparent" />
                        <SearchNormal size="18" className="mr-10 outline-primary absolute -right-5 top-4" />
                    </div>
                    {/* <div className="border-[1px] border-white/10 rounded-full">
                        <ButtonBase onClick={() => setExpandedView(!expandedView)} className={`p-3 bg-transparent rounded-full px-6 gap-2`}  >
                            <p>Filters</p>
                            <Filter className="text-primary" size="20" />
                        </ButtonBase>
                    </div> */}
                </div>
                <div className="grid grid-cols-12 w-full mt-6 gap-6" >
                    <div className="col-span-12" >
                        {loading ?
                            <div className="grid grid-cols-2 md:grid-cols-6 md:gap-6 gap-2" >
                                <NFTSkeleton />
                            </div>
                            :
                            !data?.length ?
                                <EmptyState description="No NFTs to show" /> :
                                <div className="grid grid-cols-2 md:grid-cols-6 md:gap-6 gap-2" >
                                    {data?.map((history) => (
                                        <NFT isDisplayCard={true} asset={history} transaction={history} type="created" onClick={() => Router.push(`/asset/${history._id}`)} />
                                    ))}
                                </div>}
                    </div>
                    {/* {isMobile ?
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
                            <Filters expandedView={expandedView} />
                        </Drawer> : <Filters expandedView={expandedView} />
                    } */}
                    {/* <div className="md:col-span-3 border-[1px] border-white/10 rounded-xl" >
                        <Accordion defaultExpanded className="bg-transparent shadow-none border-b-[1px] border-white/5 rounded-none p-3" style={{ backgroundImage: "none" }} >
                            <AccordionSummary expandIcon={<ArrowDown2 />} >
                                Price
                            </AccordionSummary>
                            <AccordionDetails className="flex flex-row gap-4 items-center" >
                                <input placeholder="Min" className="p-3 bg-transparent rounded-xl px-6 w-full transition-all border-[1px] border-white/10" />
                                <span className="opacity-40">to</span>
                                <input placeholder="Max" className="p-3 bg-transparent rounded-xl px-6 w-full transition-all border-[1px] border-white/10" />
                                <button className="bg-white/5 px-6 p-3 rounded-xl ml-2" >ETH</button>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className="bg-transparent shadow-none border-b-[1px] border-white/5 rounded-none p-3" style={{ backgroundImage: "none" }} >
                            <AccordionSummary expandIcon={<ArrowDown2 />} >
                                Status
                            </AccordionSummary>
                            <AccordionDetails className="flex flex-row gap-2 items-center" >
                                <Chip label="All" clickable variant="outlined" />
                                <Chip label="Buy now" clickable variant="filled" />
                                <Chip label="Live auction" clickable variant="outlined" />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className="bg-transparent shadow-none border-b-[1px] border-white/5 rounded-none p-3" style={{ backgroundImage: "none" }} >
                            <AccordionSummary expandIcon={<ArrowDown2 />} >
                                Type
                            </AccordionSummary>
                            <AccordionDetails className="flex flex-row gap-2 items-center" >
                                <Chip label="All" clickable variant="outlined" />
                                <Chip label="Single Edition" clickable variant="filled" />
                                <Chip label="Multiple Edtions" clickable variant="outlined" />
                            </AccordionDetails>
                        </Accordion>
                    </div> */}
                </div>
            </div>
        </TabTransition>
    )
}