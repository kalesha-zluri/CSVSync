import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface props {
  onUpload: (file: File) => void;
}

export function FileUpload({ onUpload }: props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    //validate file type
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }

    //validate file size
    if (file.size > 1048576) {
      alert("File size must be less than 1MB");
      return;
    }

    onUpload(file);
    setShowModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload CSV
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-2xl p-8 w-full max-w-md m-4">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full p-2 transition-colors"
            >
              <span className="text-2xl font-semibold">&times;</span>
            </button>

            <div className="flex flex-col items-center space-y-8">
              {/* Icon Container */}
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center shadow-md">
                <Upload className="w-12 h-12 text-indigo-600" />
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Upload CSV File
                </h3>
                <p className="text-sm text-gray-500">
                  Select a CSV file to upload your transactions
                </p>
              </div>

              {/* File Upload Area */}
              <div className="w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="w-full flex flex-col items-center justify-center px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <p className="text-sm text-gray-600 font-medium">
                    Click to select file
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum size: 1MB
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
