import React, { useState, useRef, useCallback } from 'react';
import { AppIcon } from '../../components/AppIcon';

const ImageUpload = ({ 
  onImageSelect, 
  onImageUpload, 
  currentImage, 
  className = "",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  width = 200,
  height = 200
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Molimo odaberite sliku');
      return false;
    }
    
    if (file.size > maxSize) {
      setError(`Slika je prevelika. Maksimalna veličina je ${Math.round(maxSize / 1024 / 1024)}MB`);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleFileUpload = useCallback((file) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const imageData = e.target.result;
      setUploadedImage(imageData);
      onImageSelect?.(file);
      onImageUpload?.(file, imageData);
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      setError('Greška pri učitavanju slike');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  }, [onImageSelect, onImageUpload, maxSize]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    onImageSelect?.(null);
    onImageUpload?.(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
          }
          ${uploadedImage ? 'bg-muted/30' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ width, height }}
      >
        {uploadedImage ? (
          <div className="relative w-full h-full">
            <img
              src={uploadedImage}
              alt="Uploaded preview"
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity space-y-2">
                <button
                  onClick={openFileDialog}
                  className="bg-white/90 text-black px-3 py-1 rounded text-sm font-medium hover:bg-white transition-colors"
                >
                  Promeni
                </button>
                <button
                  onClick={handleRemoveImage}
                  className="bg-red-500/90 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-500 transition-colors"
                >
                  Ukloni
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            {isUploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            ) : (
              <>
                <AppIcon name="Upload" size={48} className="text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Prevucite sliku ovde ili kliknite da odaberete
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF do {Math.round(maxSize / 1024 / 1024)}MB
                  </p>
                </div>
                <button
                  onClick={openFileDialog}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Odaberi Sliku
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

// Export both as default and named export for compatibility
export default ImageUpload;
export { ImageUpload };
