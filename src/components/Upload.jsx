import React, { useEffect, useState } from "react";
import fileIcon from "../assets/FileIcon.svg";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { MainButton, PrimaryButton } from "./index.js";
import fileService from "../services/file.service.js";
import { updateStorageUsed } from "../store/userSlice.js";
import { useDispatch } from "react-redux";
import { TailSpin } from "react-loader-spinner";

function Upload({ onOperationComplete, folderId }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append("file", file);
            // console.log("File: ", file); // DEBUGGING
            formData.append("folderId", folderId); // Append folderId if required by the API
            // console.log("Folder ID: ", folderId); // DEBUGGING

            const response = await fileService.uploadFile(formData);
            // console.log(response); // DEBUGGING

            if (response.status === 200) {
                const uploadedFileSize = response.data.data.size;
                // console.log("Uploaded File Size: ", uploadedFileSize); // DEBUGGING
                dispatch(updateStorageUsed(uploadedFileSize));
            }

            setIsOpen(false);
            setIsUploading(false);
            onOperationComplete();
        } catch (error) {
            alert(error.response.data.message); // TODO: TEST
            setIsOpen(false);
            setIsUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    return (
        <>
            <MainButton
                action={() => setIsOpen(true)}
                title="Upload File"
                icon={fileIcon}
            />

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 flex w-screen items-center justify-center mx-auto bg-black bg-opacity-75">
                    <DialogPanel className="w-full max-w-96 h-64 bg-glass px-4 py-6 rounded-lg flex flex-col gap-6">
                        {isUploading ? (
                            <DialogTitle className="w-full text-xl font-light text-textCol text-center">
                                Uploading...
                            </DialogTitle>
                        ) : (
                            <DialogTitle className="w-full text-xl font-light text-textCol text-center">
                                Upload Image or Video File
                            </DialogTitle>
                        )}

                        {isUploading ? (
                            <div className="w-full h-full flex justify-center items-center">
                                <TailSpin width={48} color="#828FFF" />
                            </div>
                        ) : (
                            <>
                                <div className="w-full flex flex-col justify-center gap-3 my-1">
                                    <label
                                        className="text-textCol w-full text-left px-1"
                                        htmlFor="email"
                                    >
                                        File:
                                    </label>
                                    <input
                                        name="file"
                                        type="file"
                                        onChange={handleFileChange}
                                        className="text-textCol w-full"
                                    />
                                </div>

                                <div className="flex justify-center items-center w-full min-h-10 mt-2 mb-4">
                                    <PrimaryButton
                                        action={handleUpload}
                                        title="Upload"
                                    />
                                </div>
                            </>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default Upload;
