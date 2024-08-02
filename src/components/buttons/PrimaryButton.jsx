import React from "react";

function PrimaryButton({ title, action, v2, width }) {
    return (
        <button
            onClick={action}
            className={`h-full ${v2 ? "w-full" : width ? `w-${width} md:w-44` : "w-20 md:w-44"} rounded-full bg-primary hover:tracking-wider duration-500 text-xs md:text-lg font-medium text-textCol md:pb-[1px] uppercase`}
        >
            {title}
        </button>
    );
}

export default PrimaryButton;
