import React from "react";

const ViewToggle = ({ viewMode, setViewMode }) => {
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-300
                    ${viewMode === "grid" ? "bg-[#ff008d] text-white" : "bg-gray-200 text-gray-700"}
                `}
            >
                Grid
            </button>
            <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-300
                    ${viewMode === "list" ? "bg-[#ff008d] text-white" : "bg-gray-200 text-gray-700"}
                `}
            >
                List
            </button>
        </div>
    );
};

export default ViewToggle;
