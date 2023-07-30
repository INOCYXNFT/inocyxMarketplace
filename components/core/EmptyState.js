import Lottie from "react-lottie-player"
const EMPTY = require("../../public/empty-state.json");

function EmptyState( { description } ){
    return (
        <div className="flex h-[40vh] w-full flex-col items-center justify-center grayscale">
          <Lottie
            animationData={EMPTY}
            play
            loop
            style={{ width: 200, height: 200 }}
          />
          <span className="opacity-40 -mt-10" >{description}</span>
        </div>
    )
}

export default EmptyState