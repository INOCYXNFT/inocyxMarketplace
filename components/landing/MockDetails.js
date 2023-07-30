import React from "react";

const MockDetails = () => {

    const MOCKDETAILS = [
        {
          title: "Creators",
          count: "24M+",
        },
        {
          title: "Collections",
          count: "240M+",
        },
        {
          title: "NFTs Sold",
          count: "24M+",
        },
        {
          title: "Transactions",
          count: "24M+",
        },
      ];
      
  return (
    <div className="absolute md:-bottom-24 md:mt-0 mt-20  left-0 right-0">
      <div className="md:mx-12 mx-4 px-8 grid  md:grid-cols-4 grid-cols-2 gap-4 md:items-center items-start md:place-items-center place-items-start md:py-16 py-8  bg-white/10 rounded-lg  backdrop-filter backdrop-blur-xl ">
        {MOCKDETAILS.map((item) => (
          <div key={item.title} className="flex flex-row gap-3">
            <div className="w-1 bg-gradient-to-b from-[#06D1F8] to-[#DE179E] rounded-lg"></div>
            <div>
              <div className="flex text-black col-span-1 flex-col items-start justify-center mx-3 ">
                <span className="md:text-3xl text-md font-normal font-KronaOne text-white">
                  {item.count}
                </span>
                <span className="font-mulish font-normal text-white text-left">
                  {item.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockDetails;
