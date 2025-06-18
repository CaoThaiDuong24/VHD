export const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const getImageSize = (dataUrl: string): number => {
  // Calculate approximate size in bytes
  const base64 = dataUrl.split(',')[1]
  return base64 ? (base64.length * 3) / 4 : 0
}

export const isImageTooBig = (dataUrl: string, maxSizeKB = 500): boolean => {
  const sizeBytes = getImageSize(dataUrl)
  return sizeBytes > maxSizeKB * 1024
} 