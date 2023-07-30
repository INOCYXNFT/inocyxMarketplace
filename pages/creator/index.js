import Artist from '../../components/core/Artist'
import SortOrder from '../../components/core/SortOrder'
import { useEffect, useState } from 'react'
import { getArtists } from "../../apollo/api/query"
import client from "../../apollo/apolloClient"
import EmptyState from "../../components/core/EmptyState"
import Loader from '../../components/core/Loader'
import Image from "next/image"
import SearchBox from "../../components/core/SearchBox";
import PageTransition from '../../components/core/PageTransition'

function Creator() {
  const [sortOption, setSortOption] = useState(0)
  const [artists, setArtists] = useState([])
  const [query, setQuery] = useState("")
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true)
    client.query({
      query: getArtists,
      variables: {
        username: query,
        byRatings: sortOption === 0,
        byNew: sortOption === 1,
      }
    }).then((res) => {
      setLoader(false)
      setArtists(res.data.getArtists)
    }).catch(e => {
      setLoader(false)
    })
  }, [query, sortOption])

  return (
    <PageTransition>
      <div className="mt-16 h-full">
        <Loader isLoading={loader} />
        <div className="hero_gradient_page">
          <div className="relative ">
            <Image
              src="/hero_bg.webp"
              alt="Your Alt Text"
              width={100}
              height={100}
              className="w-full h-[300px] object-cover "
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col gap-4 justify-center items-center text-white">
              <h1 className=" font-bold font-KronaOne md:text-4xl text-3xl ">
                {" "}
                Artists
              </h1>
              <p className="font-mulish font-normal md:text-xl text-lg text-center">
                The largest digital marketplace NFTs ranked by volume, floor price and other <br /> statistics! Stop saying tomorrow and start now! Start to save your asset.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-11/12 mx-auto items-center justify-between -mt-6">
          <SearchBox setQuery={(e) => setQuery(e)} />
        </div>
        {artists?.length ?
          <div className="grid md:grid-cols-5 grid-cols-2 mx-auto gap-8 w-11/12 mt-10">
            {artists.map((artist) => (
              <Artist key={artist.id} artistDetails={artist} />
            ))}
          </div> : <EmptyState description="No Artist to show" />
        }
      </div>
    </PageTransition>
  )
}

export default Creator
