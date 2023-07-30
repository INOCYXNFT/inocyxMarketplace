import { useQuery } from "@apollo/client"
import LayoutWrapper from "."
import { CelebritySkeleton } from "../../components/core/SkeletonHub"
import { GET_ALL_USERS } from "../../apollo/api/query"
import Users from "../../components/core/Users"
import { useEffect } from "react"
import EmptyState from "../../components/core/EmptyState"

function SelfChildComponent(props) {
    const { data, loading, error, refetch } = useQuery(GET_ALL_USERS)

    useEffect(() => {
        refetch({
            name: props.searchQuery
        })
    }, [props])

    return loading ? <CelebritySkeleton /> :
        data?.getAllUsers?.length === 0 ? <EmptyState description="No users to show" /> :
            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-6 w-full">
                {data?.getAllUsers?.map((eachUser) => (
                    <Users key={eachUser._id} user={eachUser} />
                ))}
            </div>

}

export default function UsersTab() {
    return (
        <LayoutWrapper>
            <SelfChildComponent />
        </LayoutWrapper>
    )
}