import { Skeleton, TableCell, TableRow } from "@mui/material"

export const NFTSkeleton = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => <div
        className="p-3 border-[1px] aspect-square border-gray-400/20 bg-white/5 rounded-xl transition-all pointer-events-none"
    >
        <div className="overflow-hidden aspect-square row-span-3   object-cover rounded-xl relative">
            <Skeleton animation="pulse" width="100%" height="100%" >
            </Skeleton>
        </div>
        <div className="row-span-1">
            <div className="flex mt-4 mx-2 flex-col gap-2">
                <Skeleton animation="pulse" className="font-inter font-semibold text-xl " />
                <div>
                    <div className="flex flex-row items-center  ">
                        <Skeleton animation="pulse" className="font-inter font-medium text-sm pl-2 w-1/2" />
                    </div>
                </div>
                <div>
                    <Skeleton animation="pulse" />
                </div>
            </div>
        </div>
    </div>
    )
}

export const CollectionSkeleton = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
        < TableRow >
            <TableCell className='flex flex-row gap-4'>
                <Skeleton animation="wave" variant='circular' width={40} height={40} />
                <Skeleton animation="wave" height={40} width={100 + (Math.random() * 100)} />
            </TableCell>
            <TableCell><Skeleton animation="wave" style={{ height: 40, width: 75 + (Math.random() * 50) }} /></TableCell>
            <TableCell><Skeleton animation="wave" style={{ height: 40, width: 75 + (Math.random() * 50) }} /></TableCell>
            <TableCell><Skeleton animation="wave" style={{ height: 40, width: 75 + (Math.random() * 50) }} /></TableCell>
            <TableCell><Skeleton animation="wave" style={{ height: 40, width: 75 + (Math.random() * 50) }} /></TableCell>
            <TableCell><Skeleton animation="wave" style={{ height: 40, width: 75 + (Math.random() * 50) }} /></TableCell>
        </TableRow>
    ))
}

export const CelebritySkeleton = () => {
    return (
        <div className="grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() =>
                <div
                    className="flex flex-col items-center transition-all transform justify-center rounded-2xl overflow-hidden bg-white/10"
                >
                    <Skeleton className="h-24 object-cover w-full scale-125 transition-all" />
                    <div className="px-4 pb-4 w-full flex flex-col items-center justify-center mt-4" >
                        <div className="mt-4 flex flex-row items-center justify-center">
                            <Skeleton className="w-36" />
                        </div>
                        <Skeleton className="w-20" />
                    </div>
                </div>
            )}
        </div>
    )
}