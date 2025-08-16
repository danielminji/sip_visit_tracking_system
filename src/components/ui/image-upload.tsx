import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent } from './card';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  visitId?: string;
  sectionCode?: string;
  onImageUploaded?: (imageData: any) => void;
  onImageRemoved?: (imageId: string) => void;
  existingImages?: Array<{
    id: string;
    filename: string;
    original_name: string;
    description?: string;
    section_code?: string;
    uploaded_at: string;
  }>;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  visitId,
  sectionCode,
  onImageUploaded,
  onImageRemoved,
  existingImages = []
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !visitId) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('visit-images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        // Try to create bucket if it doesn't exist
        if (uploadError.message.includes('bucket') || uploadError.message.includes('not found')) {
          throw new Error('Storage bucket not configured. Please run the database migration first.');
        }
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('visit-images')
        .getPublicUrl(fileName);

              // Save metadata to database
        const { data: imageData, error: dbError } = await supabase
          .from('visit_images')
          .insert({
            visit_id: visitId,
            filename: fileName,
            original_name: selectedFile.name,
            mime_type: selectedFile.type,
            size: selectedFile.size,
            description: description.trim() || null,
            section_code: null // General images for the visit
          })
          .select()
          .single();

      if (dbError) throw dbError;

      // Call callback
      if (onImageUploaded) {
        onImageUploaded({
          ...imageData,
          public_url: urlData.publicUrl
        });
      }

      // Reset form
      setSelectedFile(null);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      // Get filename from existing images
      const image = existingImages.find(img => img.id === imageId);
      if (!image) return;

      // Delete from storage
      await supabase.storage
        .from('visit-images')
        .remove([image.filename]);

      // Delete from database
      await supabase
        .from('visit_images')
        .delete()
        .eq('id', imageId);

      // Call callback
      if (onImageRemoved) {
        onImageRemoved(imageId);
      }

    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Delete failed: ${error.message}`);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Uploaded Images</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {existingImages.map((image) => (
              <Card key={image.id} className="relative group">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{image.original_name}</p>
                      {image.description && (
                        <p className="text-xs text-muted-foreground truncate">{image.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(image.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(image.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Upload Proof Image</Label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            selectedFile ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {selectedFile ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" />
                <span className="font-medium">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Drop image here or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, GIF up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {selectedFile && (
          <div className="space-y-3">
            <Input
              placeholder="Image description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <Button
              onClick={handleUpload}
              disabled={isUploading || !visitId}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>

            {isUploading && (
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {!selectedFile && (
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Image
          </Button>
        )}
      </div>
    </div>
  );
};
