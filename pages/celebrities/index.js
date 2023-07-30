import { useEffect, useState } from "react";
import { FIND_ALL_CELEBRITY } from "../../apollo/api/query";
import client from "../../apollo/apolloClient";
import EmptyState from "../../components/core/EmptyState";
import Loader from "../../components/core/Loader";
import Celebrity from "../../components/core/Celebrity";
import Image from "next/image";
import PageTransition from "../../components/core/PageTransition";
import { CelebritySkeleton } from "../../components/core/SkeletonHub";
import { useQuery } from "@apollo/client";
import { SearchNormal } from "iconsax-react";

let INIT_FILTER = {
  text: "",
  limit: 10,
  pageCount: 1
}

function Creator() {
  const [celebrities, setCelebrities] = useState([]);
  const [page, setPage] = useState(1)
  const [filterProperties, setFilterProperties] = useState(INIT_FILTER)
  const { data, loading, error, refetch } = useQuery(FIND_ALL_CELEBRITY, {
    variables: filterProperties,
    fetchPolicy: "network-only"
  })

  useEffect(() => {
    if (data && data?.errors) {
      console.log(error)
      setCelebrities([])
    } else if (!loading && data) {
      setCelebrities(data?.findAllCelebrities)
    }
  }, [data, celebrities, filterProperties])

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      setPage(prevPage => prevPage + 1);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleFilterPropertyChange(type, value) {
    switch (type) {
      case 'search':
        setFilterProperties(prevProp => Object.assign(prevProp, { text: value }))
        break;
    }
    refetch(filterProperties)
  }

  return (
    <PageTransition>
      <div className="py-4 h-full">
        <div className="flex flex-row w-11/12 md:w-1/2 mx-auto bg-transparent relative hover:border-white/30 rounded-full border-[1px] border-white/20 outline-none " >
          <input onChange={(e) => handleFilterPropertyChange('search', e.target.value)} placeholder={`Search celebrities`} className="p-3 bg-transparent rounded-full px-6 w-full transition-all focus:outline-transparent font-sans" />
          <SearchNormal size="18" className="mr-10 outline-primary absolute -right-5 top-4" />
        </div>

        {loading ?
          <div className="w-11/12 mx-auto mt-10">
            <CelebritySkeleton />
          </div>
          :
          data?.findAllCelebrities?.length ? (
            <div className="grid md:grid-cols-5 grid-cols-1 mx-auto gap-4 w-11/12 mt-10">
              {data?.findAllCelebrities?.map((celebrity) => (
                <Celebrity key={celebrity._id} celebrityDetails={celebrity} />
              ))}
            </div>
          ) : (
            <EmptyState description="No Celebrities to show" />
          )}


      </div>
    </PageTransition>
  );
}

export default Creator;
