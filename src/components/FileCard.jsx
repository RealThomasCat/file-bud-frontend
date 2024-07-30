import React, { useEffect, useState } from "react";
import defaultThumbnail from "../assets/DefaultThumbnail.png";
import { MainButton, OptionsButton, PrimaryButton } from "./index.js";
import imageIcon from "../assets/ImageIcon.svg";
import videoIcon from "../assets/VideoIcon.svg";
import fileIcon from "../assets/FileIcon.svg";
import downloadIcon from "../assets/DownloadIcon.svg";
import deleteIcon from "../assets/DeleteIcon.svg";
import closeIcon from "../assets/CloseIcon.svg";
import { Dialog, DialogPanel } from "@headlessui/react";
import fileService from "../services/file.service.js";
import Player from "./Player.jsx";
import { TailSpin } from "react-loader-spinner";
import playIcon from "../assets/PlayIcon2.svg";

function FileCard({ file, onOperationComplete }) {
    const [fileUrl, setFileUrl] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const backendUrl = import.meta.env.VITE_API_URL;

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
            handleFileAction();
        }
    };

    const handleDoubleClick = () => {
        if (!isMobile) {
            handleFileAction();
        }
    };

    const handleFileAction = () => {
        if (file.resourceType === "image" && file.format !== "pdf") {
            showFile();
        } else if (file.resourceType === "video") {
            playVideo();
        } else {
            alert("This file type is not supported for preview.");
        }
    };

    const handleDownload = async () => {
        try {
            // console.log(file._id); // DEBUGGING
            const response = await fileService.downloadFile(file._id);
            console.log(response.data.data); // DEBUGGING

            // Create a temporary anchor element
            const link = document.createElement("a");
            link.href = response.data.data.signed_url;
            link.download = ""; // Optional: You can set a default filename here
            // Append the anchor to the body
            document.body.appendChild(link);
            // Programmatically click the anchor
            link.click();
            // Remove the anchor from the document
            document.body.removeChild(link);

            // return response;
        } catch (error) {
            console.log(error);
        }
    };

    const showFile = async () => {
        if (file.resourceType === "image") {
            try {
                setImageLoading(true);
                setIsOpen(true);
                // if file URL is already present then fetch the image from the disk cache
                if (!fileUrl) {
                    const response = await fileService.fetchFile(file._id);
                    setFileUrl(response.data.data.signed_url);
                    // console.log(response.data.data.signed_url); // DEBUGGING
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const playVideo = async () => {
        if (file.resourceType === "video") {
            try {
                const response = await fileService.streamVideo(file._id);
                console.log(response.data.data.signed_url); // DEBUGGING
                setVideoUrl(response.data.data.signed_url);
                setIsPlayerOpen(true);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            const response = await fileService.deleteFile(file._id);

            if (response.status === 200) {
                setIsOpen(false);
                // setIsConfirmOpen(false);
                onOperationComplete();
            }
        } catch (error) {
            alert(error.response.data.message);
            setDeleteLoading(false);
            setIsConfirmOpen(false);
        }
    };

    const showDetails = async () => {
        console.log("Details");
    };

    return (
        <>
            <div
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                className="aspect-square text-textCol flex flex-col gap-3 bg-glass hover:bg-glassHov duration-500 p-2 rounded-lg overflow-hidden"
            >
                <div className="w-full flex justify-between items-center pl-1">
                    <div className="w-full h-full flex items-center gap-2 overflow-hidden">
                        <div className="min-h-4 max-h-4 min-w-4 max-w-4">
                            <img
                                className="h-full w-full object-contain"
                                src={
                                    file.resourceType === "image"
                                        ? imageIcon
                                        : file.resourceType === "video"
                                          ? videoIcon
                                          : fileIcon
                                }
                                alt="File Type Icon"
                            />
                        </div>

                        <h1 className="w-4/5 line-clamp-1 text-ellipsis overflow-hidden text-sm md:text-base">
                            {file.title}
                        </h1>
                    </div>

                    <OptionsButton
                        type="file"
                        file={file}
                        handleDownload={handleDownload}
                        handleDelete={() => setIsConfirmOpen(true)}
                        showDetails={showDetails}
                    />
                </div>

                {/* Thumbnail */}
                <div className="h-full w-full aspect-auto rounded-sm overflow-hidden relative">
                    <img
                        // src={thumbnailLink ? thumbnailLink : defaultThumbnail}
                        src={
                            file._id &&
                            (file.resourceType === "image" ||
                                file.resourceType === "video")
                                ? `${backendUrl}/api/v1/files/thumbnail/${file._id}`
                                : defaultThumbnail
                        }
                        loading="lazy"
                        alt={file.title}
                        className="w-full h-full object-cover rounded-sm"
                    />

                    {file.resourceType === "video" && (
                        <img
                            src={playIcon}
                            alt="playIcon"
                            className="absolute top-1/2 left-1/2 w-10 h-10 transform -translate-x-1/2 -translate-y-1/2"
                        />
                    )}
                </div>
            </div>

            <Dialog
                open={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    // setImageLoading(true);
                }}
                className="z-50"
            >
                <div className="fixed inset-0 flex flex-col w-screen items-center justify-center mx-auto bg-black bg-opacity-75">
                    <DialogPanel className="w-fit h-full pt-28 mb-8 flex flex-col justify-center items-center">
                        {/* Header */}
                        <div className="fixed max-h-24 min-h-24 h-24 max-w-7xl w-full p-4 top-0">
                            <div className="w-full h-full p-3 flex justify-between items-center bg-glass md:text-xl rounded-full text-textCol text-center">
                                <h1 className="px-4 pb-0.5 overflow-hidden text-ellipsis">
                                    {file.title}
                                </h1>

                                {/* TODO: Height of this width is 38 but it should be 40 */}
                                <div className="h-full flex gap-3">
                                    <MainButton
                                        // title="Download"
                                        icon={downloadIcon}
                                        action={handleDownload}
                                        v2
                                    />

                                    <MainButton
                                        // title="Delete"
                                        icon={deleteIcon}
                                        action={() => setIsConfirmOpen(true)}
                                        v2
                                    />

                                    <MainButton
                                        // title="Close"
                                        icon={closeIcon}
                                        action={() => setIsOpen(false)}
                                        v2
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        {imageLoading && (
                            <TailSpin width={48} color="#828FFF" />
                        )}
                        <div
                            className={`h-full w-full ${imageLoading ? "hidden" : null}`}
                        >
                            <img
                                src={fileUrl}
                                alt={file.title}
                                className="h-full object-contain"
                                onLoad={() => setImageLoading(false)}
                            />
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <Dialog
                open={isPlayerOpen}
                onClose={() => {
                    setIsPlayerOpen(false);
                }}
                className="z-50"
            >
                <div className="fixed inset-0 flex flex-col w-screen items-center justify-center mx-auto bg-black bg-opacity-75">
                    <DialogPanel className="md:w-[64rem] max-w-5xl">
                        <Player file={file} videoUrl={videoUrl} />
                    </DialogPanel>
                </div>
            </Dialog>

            <Dialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                className="z-50"
            >
                <div className="fixed inset-0 flex flex-col w-screen items-center justify-center mx-auto bg-black bg-opacity-75">
                    <DialogPanel className="w-full max-w-96 h-40 bg-glass my-auto px-6 py-6 rounded-lg flex flex-col items-center gap-6 text-textCol">
                        {deleteLoading ? (
                            <h1 className="text-xl text-textCol font-light">
                                Deleting...
                            </h1>
                        ) : (
                            <h1 className="text-xl text-textCol font-light">
                                Are you sure?
                            </h1>
                        )}

                        {deleteLoading ? (
                            <TailSpin width={48} color="#828FFF" />
                        ) : (
                            <div className="h-12 w-full flex gap-4 ">
                                <button
                                    onClick={() => setIsConfirmOpen(false)}
                                    className="bg-glass border-2 border-primary w-full h-10 rounded-full uppercase font-medium text-lg pb-[1px] text-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-primary w-full h-10 rounded-full uppercase font-medium text-lg pb-[1px] text-textCol"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default FileCard;
