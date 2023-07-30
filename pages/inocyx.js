import Navbar from "../components/landing/Navbar"
import Hero from "../components/landing/Hero"
import Exchange from "../components/landing/Exchange"
import NFTMarketplace from "../components/landing/NFTMarketplace"
import Metaverase from "../components/landing/Metaverse"
import Footer from "../components/landing/Footer"
import Roadmap from "../components/landing/Roadmap"

export default function Home() {
  return (
    <div className="w-full element" >
        <Navbar />
            <Hero />
            <Exchange />
            <NFTMarketplace />
            <Metaverase />
            <Roadmap />
        <Footer />
    </div>
    )
}