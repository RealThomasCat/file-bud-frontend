import React from "react";

function SecondaryButton({ title, action }) {
    return (
        <button
            onClick={action}
            className="h-full w-20 md:w-44 rounded-full text-xs md:text-lg md:pb-[1px] text-primary hover:tracking-wider duration-500 font-medium border-2 border-primary uppercase"
        >
            {title}
        </button>
    );
}

export default SecondaryButton;
