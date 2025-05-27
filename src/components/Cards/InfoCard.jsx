import React from 'react'

export const InfoCard = ({ icon, label, value, color = "bg-blue-500" }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Colored circle */}
      <div className={`w-3 h-3 ${color} rounded-full`} />
      {/* Text */}
      <div>
        <span className="text-sm md:text-[15px] text-black font-semibold">
          {value}
        </span>
        <span className="ml-1 text-xs md:text-[14px] text-gray-500">
          {label}
        </span>
      </div>
    </div>
  )
}

export default InfoCard;
