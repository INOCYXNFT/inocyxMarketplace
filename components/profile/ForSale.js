import { SearchNormal, Filter, ArrowDown2 } from "iconsax-react"
import { ButtonBase, Accordion, AccordionSummary, AccordionDetails, Chip } from "@mui/material"
import Router from "next/router"
import NFT from "../core/NFT"
import { NFTSkeleton } from "../core/SkeletonHub"
import EmptyState from "../core/EmptyState"

export default function Sales({ loading, data }) {
  console.log(data)
  return (
    <div className="flex flex-col w-full" >
      <div className="flex flex-row items-center justify-between gap-4 w-full" >
        {/* <div className="flex flex-row w-1/4 bg-transparent relative hover:border-white/20 rounded-full border-[1px] border-white/10 outline-none " >
          <input placeholder={`Search by NFT's`} className="p-3 bg-transparent rounded-full px-6 w-full transition-all focus:outline-transparent" />
          <SearchNormal size="18" className="mr-10 outline-primary absolute -right-5 top-4" />
        </div> */}
        {/* <div className="border-[1px] border-white/10 rounded-full">
          <ButtonBase className={`p-3 bg-transparent rounded-full px-6 gap-2`}  >
            <p>Filters</p>
            <Filter className="text-primary" size="20" />
          </ButtonBase>
        </div> */}
      </div>
      <div className="grid grid-cols-12 w-full mt-6 gap-6" >
        <div className="col-span-12" >
          {loading ?

            <div className="grid grid-cols-4 gap-6" >
              <NFTSkeleton />
            </div>

            : data?.length === 0 ?

              <EmptyState description="No NFTs to show" /> :

              <div className="grid grid-cols-2 md:grid-cols-6 gap-6" >
                {data?.map((history) => (
                  <NFT isDisplayCard={true} asset={history?.nftData} type="sale" transaction={history} onClick={() => Router.push(`/asset/${history.nftId}`)} />
                ))}

              </div>
          }
        </div>
        {/* <div className="col-span-3 border-[1px] border-white/10 rounded-xl" >
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
  )
}