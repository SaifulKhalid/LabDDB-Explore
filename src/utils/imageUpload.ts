/**
 * Cloudinary Image Upload Utility
 * Handles image compression and upload to Cloudinary using unsigned preset.
 */

export async function uploadToCloudinary(
  file: File,
  uid: string,
  districtCode: string
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing');
  }

  // 1. Prepare Canvas for compression and resizing
  const img = new Image();
  const reader = new FileReader();

  const imageData: string = await new Promise((resolve, reject) => {
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageData;
  });

  const canvas = document.createElement('canvas');
  let width = img.width;
  let height = img.height;

  // Max width 800px
  if (width > 800) {
    height = (800 / width) * height;
    width = 800;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0, width, height);

  // Convert to WebP with 0.8 quality for compression
  const blob: Blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), 'image/webp', 0.8);
  });

  // 2. Upload to Cloudinary
  const formData = new FormData();
  formData.append('file', blob);
  formData.append('upload_preset', uploadPreset);
  // public_id = labddb-explore/{uid}/{districtCode}
  formData.append('public_id', `${districtCode}`);
  formData.append('folder', `labddb-explore/${uid}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}
