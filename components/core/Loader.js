import LOADER from "../../public/loader.json";
import Lottie from "react-lottie-player";

const Loader = ({ isLoading, description }) => {
  return isLoading ? (
    <div
      className="w-full h-full fixed top-0 left-0 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center"
      style={{ zIndex: 10000000 }}
    >
      <Lottie
        animationData={LOADER}
        play
        loop
        style={{ width: 200, height: 200 }}
      />
      <span className="opacity-40 -mt-10">{description}</span>
    </div>
  ) : (
    <></>
  );
};

export default Loader;
