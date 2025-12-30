import React, { useState } from "react";

const ImageUpload: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission and image upload here
    if (selectedImage) {
      // Perform API call or desired action here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="imageUpload">Upload Image:</label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ImageUpload;
