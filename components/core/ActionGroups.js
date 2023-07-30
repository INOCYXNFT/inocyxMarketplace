import { ButtonBase } from "@mui/material";
import { useEffect, useRef, useState } from "react"

export function CollectionTimeActions() {
    const containerRef = useRef()
    const defaultRef = useRef()
    const [dimension, setDimension] = useState({
        left: 0,
        width: 0,
        height: 0
    });

    useEffect(() => {
        handleActiveTab(defaultRef.current)
    }, [])

    function handleActiveTab(e) {
        const boundingContainer = containerRef.current.getBoundingClientRect()
        const boundingTarget = e.getBoundingClientRect();
        const positionX = boundingTarget.left - boundingContainer.left
        setDimension({
            left: positionX,
            width: boundingTarget.width,
            height: boundingTarget.height,
        })
    }

    return (
        <div className="flex flex-row items-center justify-center border-[1px] border-white/10 bg-transparent rounded-full relative transition-all p-1" ref={containerRef} >
            <ButtonBase className="bg-white/10 absolute rounded-full px-4 transition-all" style={{ ...dimension }} />
            <ButtonBase ref={defaultRef} onClick={(e) => handleActiveTab(e.target)} className="w-14 h-10 focus:text-primary rounded-full " >1H</ButtonBase>
            <ButtonBase onClick={(e) => handleActiveTab(e.target)} className="w-14 h-10 focus:text-primary rounded-full" >1D</ButtonBase>
            <ButtonBase onClick={(e) => handleActiveTab(e.target)} className="w-14 h-10 focus:text-primary rounded-full" >7D</ButtonBase>
            <ButtonBase onClick={(e) => handleActiveTab(e.target)} className="w-14 h-10 focus:text-primary rounded-full" >30D</ButtonBase>
        </div>
    )
}
