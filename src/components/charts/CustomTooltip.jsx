import React from 'react'

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
          <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
            <p className="text-xs font-semibold text-purple-800 mb-1">{payload[0].name}</p>
            <p className="text-xs text-gray-600">Count: {payload[0].value}</p>
          </div>
        )
    }
    return null;
}

export default CustomTooltip;
