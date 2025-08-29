// TagsSidebar.jsx
import React from "react";

const TagsSidebar = ({ tags, selectedTag, setSelectedTag }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <button
                onClick={() => setSelectedTag("")}
                className={`px-3 py-1 rounded text-sm ${selectedTag === "" ? "bg-pink-600 text-white" : "bg-pink-100 text-pink-600"} hover:bg-pink-500 hover:text-white transition`}
            >
                All Tags
            </button>
            {tags.map((tag, idx) => (
                <button
                    key={idx}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded text-sm ${selectedTag === tag ? "bg-pink-600 text-white" : "bg-pink-100 text-pink-600"} hover:bg-pink-500 hover:text-white transition`}
                >
                    #{tag}
                </button>
            ))}
        </div>
    );
};

export default TagsSidebar;
