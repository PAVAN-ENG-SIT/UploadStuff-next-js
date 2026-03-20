"use client"

import { useState } from "react";
import { ImageKitAbortError, upload } from "@imagekit/next";
// Import the specific response type for better autocompletion
// Try this first
// Replace the failing import with this manual definition
interface UploadResponse {
    fileId: string;
    name: string;
    url: string;
    thumbnailUrl: string;
    filePath: string;
    fileType: "image" | "video" | "non-image";
    size: number;
    width?: number;
    height?: number;
    // Add other fields you might need from the ImageKit docs
}
interface FileUploadProps {
    onSuccess: (res: UploadResponse) => void; 
    onProgress?: (progress: number) => void; 
    fileType?: "image" | "video" | "application/pdf"; 
}


// 1. Pass the props to the component
const FileUpload = ({ onSuccess, onProgress, fileType = "image" }: FileUploadProps) => {
  
    const [uploading, setUploading] = useState(false); 
    const [error, setError] = useState<string | null>(null);

    // 2. Combined validation function
    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Please upload a valid video file");
                return false;
            }
        } else {
            if (!file.type.startsWith("image/") && fileType === "image") {
                setError("Please upload a valid image file");
                return false;
            }
        }

        if (file.size > 1024 * 1024 * 100) { // 100MB
            setError("File size should be less than 100MB");
            return false;
        }

        return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateFile(file)) return;

        setUploading(true);
        setError(null);

        try {
            // Fetch auth params from your API route
            const authRes = await fetch("/api/imagekit-auth"); // Ensure this path is correct
            const auth = await authRes.json();

            const response = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                onProgress: (event) => {
                    const percent = (event.loaded / event.total) * 100;
                    if (onProgress) onProgress(Math.round(percent));
                },
            });

            onSuccess(  response as UploadResponse); // Cast to the correct type
        } catch (err) {
            if (err instanceof ImageKitAbortError) {
                setError("Upload aborted. Please try again.");
            } else {
                setError("Upload failed. Please check your connection.");
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <input 
                type="file" 
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
                disabled={uploading}
            />
            
            {uploading && <div className="text-sm text-blue-500">Uploading...</div>}
            {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
    );
};

export default FileUpload;
