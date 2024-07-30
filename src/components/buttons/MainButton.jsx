import React, { act } from "react";

function MainButton({ title, action, icon, v2 }) {
    return (
        <button
            onClick={action}
            className={`h-full md:w-44 flex justify-center items-center gap-3 rounded-full bg-glass text-sm md:text-base font-medium hover:bg-glassHov duration-500 text-textCol ${v2 && "border-2 border-primary"} ${!title ? "w-fit md:w-fit aspect-square" : "w-36"}`}
        >
            {icon && <img className="max-h-4" src={icon} alt="Icon" />}
            {title && <h1>{title}</h1>}
        </button>
    );
}

export default MainButton;
