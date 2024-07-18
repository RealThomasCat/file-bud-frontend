import React from "react";

function PrimaryButton({ title, action }) {
    return (
        <button
            onClick={action}
            className="h-full w-44 rounded-full bg-primary hover:tracking-wider duration-500 text-lg font-medium text-textCol pb-[1px] uppercase"
        >
            {title}
        </button>
    );
}

export default PrimaryButton;
