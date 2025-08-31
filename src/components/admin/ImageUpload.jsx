"use client";

import React, { useState, useRef } from "react";
import { Upload, X, AlertCircle, Check } from "lucide-react";
import { useSelector } from "react-redux";

const ImageUpload = ({
  value,
  onChange,
  disabled = false,
  className = "",
  placeholder = "Click to upload or drag and drop",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Get token from Redux store the same way your blogsApi does
  const token = useSelector((state) => state.auth.accessToken);

  // Handle file selection
  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append("image", file);

      // Get token the same way your blogsApi does
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/blog/api/upload/image/`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            // Don't set Content-Type - let browser set it for multipart
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.message || "Upload failed"
        );
      }

      const data = await response.json();

      // Handle your backend's actual response format: { status: "success", image_url: "...", filename: "..." }
      const imageUrl =
        data.image_url || data.imageUrl || data.url || data.data?.imageUrl;

      if (imageUrl) {
        onChange(imageUrl);
      } else {
        throw new Error("No image URL returned from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error?.message || "Failed to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file input change
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle remove image
  const handleRemove = () => {
    onChange("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasImage = value && value.trim() !== "";

  return (
    <div className={`relative ${className}`}>
      {!hasImage ? (
        // Upload Area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() =>
            !disabled && !isUploading && fileInputRef.current?.click()
          }
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-gray-400"
            }
            ${
              disabled || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled || isUploading}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">{placeholder}</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>
      ) : (
        // Image Preview
        <div className="relative">
          <img
            src={value || "/placeholder.svg"}
            alt="Uploaded image"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=192&width=384";
            }}
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded text-xs">
            <Check className="h-3 w-3" />
            <span>Uploaded</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="mt-2 flex items-center text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
