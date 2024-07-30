import React, { useEffect, useState } from "react";
import folderIcon from "../assets/FolderIcon.svg";
import { OptionsButton } from "./index.js";
import { useNavigate } from "react-router-dom";
import folderService from "../services/folder.service.js";

// TODO: folder object should be passed as props
function FolderCard({ folder, onOperationComplete }) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // You can adjust the width as needed
        };

        // Initial check
        handleResize();

        // Listen for resize events
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleClick = () => {
        if (isMobile) {
            navigate(`/folders/${folder._id}`); // Single tap/click on mobile
        }
    };

    const handleDoubleClick = () => {
        if (!isMobile) {
            navigate(`/folders/${folder._id}`); // Double click on larger screens
        }
    };

    const handleDelete = async () => {
        try {
            const response = await folderService.deleteFolder(folder._id);

            if (response.status === 200) {
                onOperationComplete();
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            className="h-fit text-textCol flex justify-between items-center gap-3 bg-glass hover:bg-glassHov duration-500 pl-3 pr-1 py-2 rounded-lg overflow-hidden"
        >
            <div className="w-full h-full flex items-center gap-2 overflow-hidden">
                <div className="h-full ">
                    <img
                        src={folderIcon}
                        alt="Folder Icon"
                        className="max-h-4 min-h-4 object-contain"
                    />
                </div>
                <h1 className="w-4/5 text-ellipsis line-clamp-1 text-sm md:text-base">
                    {folder.title}
                </h1>
            </div>

            <OptionsButton
                type="folder"
                folder={folder}
                handleDelete={handleDelete}
                showDetails
            />
        </div>
    );
}

export default FolderCard;
