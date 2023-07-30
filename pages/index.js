import React from 'react';
import Marketplace from "../components/marketplace"
import { Hero, HotCollections, TrendingNFT } from "../components/home"
import PageTransition from '../components/core/PageTransition';
// import Marketplace from '../components/landing/Marketplace';
// import Exchange from '../components/landing/Exchange';
// import MetaverseMaps from '../components/landing/MetaverseMaps';
// import RoadMap from '../components/landing/RoadMap';
// import Sponsors from '../components/landing/Sponsors';
// import Hero from '../components/landing/Hero';

// function Dashboard() {
//   return (
//     <div className="bg-black text-white">
//       <Head>
//         <title>Inocyx | Moon Marketplace</title>
//       </Head>
//       <Header />
//       <Hero />
//       <Exchange />
//       <Marketplace />
//       <MetaverseMaps />
//       <RoadMap />
//       <Sponsors />
//       <Footer />
//     </div>
//   );
// }


// export default Dashboard;
function Dashboard() {
  return (
    <PageTransition>
      <Hero />
      <HotCollections />
      <TrendingNFT />
      {/* <Marketplace /> */}
    </PageTransition>
  )

}

export default Dashboard