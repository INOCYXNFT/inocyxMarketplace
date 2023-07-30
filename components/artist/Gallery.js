import Image from "next/image"
const Gallery = ({ celebrityCollection }) => {

    return (
        <div className="flex flex-col items-center justify-center" >
            <p className="font-bold text-6xl my-10">Gallery</p>
            <div className="grid grid-cols-5 w-11/12 mx-auto gap-6" >
                <div className="col-span-3 grid grid-rows-2 gap-8" >
                    <div className="row-span-1 h-[400px] overflow-hidden w-full bg-black">
                        <Image src={celebrityCollection?.gallary?.[0]} alt="img" className="object-fit w-full bg-white/5 " />
                    </div>
                    <div className="row-span-1 h-[400px] overflow-hidden w-full" >
                        <Image src={celebrityCollection?.gallary?.[1]} alt="img" className="object-fit w-full bg-white/5 " />
                    </div>
                </div>
                <div className="col-span-2 grid grid-rows-3 gap-6" >
                    <div className="row-span-1 h-64 overflow-hidden w-full" >
                        <Image src={celebrityCollection?.gallary?.[2]} alt="img" className="object-fit w-full bg-white/5 " />
                    </div>
                    <div className="row-span-1 h-64 overflow-hidden w-full" >
                        <Image src={celebrityCollection?.gallary?.[3]} alt="img" className=" object-contain w-full bg-white/5" />
                    </div>
                    <div className="row-span-1 h-64 overflow-hidden w-full" >
                        <Image src={celebrityCollection?.gallary?.[0]} alt="img" className="object-fit w-full bg-white/5 " />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Gallery