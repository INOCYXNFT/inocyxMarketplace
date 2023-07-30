import { useQuery } from "@apollo/client"
import { CollectionTimeActions } from "../../components/core/ActionGroups"
import CollectionTable from "./CollectionTable"
import { getAllCollections } from "../../apollo/api/query"
export default function HotCollections() {

    const { data, loading, error } = useQuery(getAllCollections, {
        variables: {
            name: "",
            sort: 1
        }
    });

    return (
        <div className="flex flex-col gap-6 mb-10 items-center justify-center mx-auto pt-10 w-11/12 max-w-screen-2xl" >
            <div className="flex flex-row items-center justify-between w-full" >
                <p className="font-sans text-2xl">Hot collections</p>
                {/* <CollectionTimeActions /> */}
            </div>
            <CollectionTable data={data?.getAllCollections} loading={loading} />
        </div>
    )
}