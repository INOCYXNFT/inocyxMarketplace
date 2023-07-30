import Image from "next/image"
const Metaverase = () => {
    return <div className="flex flex-row items-center justify-around h-[80vh] w-4/5 mx-auto" id="metaverse" >
        <div className="flex flex-col items-start" >
        <h1 className="font-bold text-yellow-400 text-6xl w-1/2" >Metaverse Maps</h1>
            <p className="w-4/5 text-lg mt-6 text-left text-white " >It is a digital world, which lively represent us the moments of different places and it helps enhance the real-world operating computer-generated perceptual information. It is the newest macro-goal for many of the world&pos;s tech giants</p>
        </div>
        <Image alt="img" src="/maps.png" className="w-1/2" />
    </div>
}

export default Metaverase