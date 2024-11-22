import { ImageIcon } from "lucide-react";
import React, { useRef, useState } from "react";

const HandleImageChange: React.FC<{
  fieldChange: (file: File | null) => void;
  fieldValue?: string | undefined;
}> = ({ fieldChange, fieldValue }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setImage(file);
      fieldChange(file || null);
    }
  };

  return (
    <div
      onClick={handleButtonClick}
      className="w-full p-4 h-80 border border-black/15 relative rounded-md flex items-center justify-center hover:opacity-75 transition-all cursor-pointer"
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
      {image ? (
        <img
          src={URL.createObjectURL(image)}
          alt={image.name}
          className="max-w-full max-h-full object-contain rounded-sm"
        />
      ) : fieldValue ? (
        <img
          src={fieldValue}
          alt={"image"}
          className="max-w-full max-h-full object-contain rounded-sm"
        />
      ) : (
        <div className="flex flex-col items-center gap-y-4">
          <ImageIcon size={105} className="text-gray-950" />
          <p className="text-sm font-semibold text-gray-950">
            Upload your display image
          </p>
        </div>
      )}
    </div>
  );
};

export default HandleImageChange;
