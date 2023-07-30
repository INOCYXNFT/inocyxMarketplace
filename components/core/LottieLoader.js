import Lottie from "react-lottie-player"
import TransactionProgress from "../../public/video/transaction_progress.json"
import TransactionCompleted from "../../public/video/transaction_completed.json"
import TransactionError from "../../public/video/transaction_error.json"
import Map from "../../public/video/map.json"
import LOADER from "../../public/loader.json";
import { useEffect, useState } from "react";

function LottieLoader({ loader_name, loading, loop, width, height }) {
    let [animationData, setAnimationData] = useState(LOADER)

    useEffect(() => {
        switch (loader_name) {
            case "progress":
                setAnimationData(TransactionProgress)
                break;
            case "completed":
                setAnimationData(TransactionCompleted)
                break;
            case "error":
                setAnimationData(TransactionError)
                break;
            case "map":
                setAnimationData(Map)
                break;
        }
    }, [loader_name])

    return (
        <Lottie
            animationData={animationData}
            play
            loop={loop}
            style={{ width: width, height: height }}
        />
    )
}

export default LottieLoader

LottieLoader.defaultProps = {
    width: 150,
    height: 150
}