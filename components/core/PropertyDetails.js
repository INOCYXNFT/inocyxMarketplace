import React from "react";

const PropertyDetails = () => {
  return (
    <div className="flex md:flex-row flex-col gap-5 pt-8">
      <div className="bg-white/5 border-[1px] border-white/10 flex flex-col py-3 px-6 rounded-lg">
        <p className="text-white/50">Billboard</p>
        <span className="font-inter font-extrabold">2%</span>
      </div>
      <div className="bg-white/5 border-[1px] border-white/10 flex flex-col py-3 px-6 rounded-lg">
        <p className="text-white/50">Land Type</p>
        <span className="font-inter font-extrabold">Regular</span>
      </div>
      <div className="bg-white/5 border-[1px] border-white/10 flex flex-col py-3 px-6 rounded-lg">
        <p className="text-white/50">Latitude</p>
        <span className="font-inter font-extrabold">80.24</span>
      </div>
      <div className="bg-white/5 border-[1px] border-white/10 flex flex-col py-3 px-6 rounded-lg">
        <p className="text-white/50">Longitude</p>
        <span className="font-inter font-extrabold">13.098603</span>
      </div>
    </div>
  );
};

export default PropertyDetails;
