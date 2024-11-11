'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image'; // Import Next.js Image component

export default function Home() {
  const [imageSrc, setImageSrc] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [progress, setProgress] = useState(0);  // Add progress state
  const [imageURL, setImageURL] = useState(''); // State for storing the image URL

  function handleOnChange(changeEvent) {
    const file = changeEvent.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;  // Ensure file is an image

    const reader = new FileReader();
    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(null);
      setProgress(0);  // Reset progress when a new file is selected
    };
    reader.readAsDataURL(file);
  }

  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');

    const formData = new FormData();
    for (const file of fileInput.files) {
      formData.append('file', file);
    }
    formData.append('upload_preset', 'my-uploads');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dtvsl05hw/image/upload');

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      const response = JSON.parse(xhr.responseText);
      setImageSrc(response.secure_url);
      setUploadData(response);
      setImageURL(response.secure_url); // Set image URL to state
      setProgress(100);  // Set progress to 100 on completion
    };

    xhr.send(formData);
  }

  return (
    <div className="max-w-screen-xl mx-auto p-8 min-h-screen grid grid-rows-[1fr_auto]">
      <Head>
        <title>Image Uploader</title>
        <meta name="description" content="Upload your image to Cloudinary!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center py-8 text-center">
        <form className="space-y-8" method="post" onChange={handleOnChange} onSubmit={handleOnSubmit}>
          <p>
            <input
              type="file"
              name="file"
              className="px-6 py-4 text-base border border-gray-300 rounded-lg"
            /> 
          </p>

          {imageSrc && (
            <Image
              src={imageSrc}
              alt="Uploaded Image"
              width={100} // Adjust width as needed
              height={90} // Adjust height as needed
              className="mt-4"
            />
          )}

          {progress > 0 && (
            <p className="text-gray-500">{progress}% Uploaded</p>  // Show upload percentage
          )}

          <p>
            <button
              type="submit"
              className="px-4 py-2 text-base text-white transition-transform duration-200 bg-blue-500 rounded-md hover:bg-blue-600 hover:scale-105"
            >
              Upload Files
            </button>
          </p>
        </form>

        {/* Always show Image URL field */}
        <div className="mt-4">
          <p>Image URL: 
            <a href={imageURL || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {imageURL || 'No image uploaded'}
            </a>
          </p>
          
          {/* Input field for Image URL */}
          <p>
            <input
              type="text"
              value={imageURL || ''}
              readOnly
              className="w-full px-6 py-4 mt-2 text-base border border-gray-300 rounded-lg"
            />
          </p>
        </div>
      </main>
    </div>
  );
}
