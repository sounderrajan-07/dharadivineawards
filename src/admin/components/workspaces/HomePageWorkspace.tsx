import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Plus, Trash2, X, Upload, CheckCircle2, Link as LinkIcon, Loader2, Cloud, ArrowUpDown, Eye } from 'lucide-react';

export const HomePageWorkspace: React.FC = () => {
  const { gallery, addGalleryImage, updateGalleryImage, deleteGalleryImage, globalSearchQuery } = useApp();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  // Form states
  const [caption, setCaption] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [priority, setPriority] = useState<number>(10);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadProvider, setUploadProvider] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);

  // Filter only home page images (where featured is true)
  const homeImages = gallery
    .filter(img => img.featured)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  const filteredHomeImages = homeImages.filter(img => {
    const searchStr = (globalSearchQuery || '').toLowerCase();
    return !searchStr || (img.caption || '').toLowerCase().includes(searchStr);
  });

  const getImageUrl = (src: string) => {
    if (!src) return 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80';
    if (src.startsWith('http') || src.startsWith('/uploads') || src.startsWith('data:')) {
      return src;
    }
    const url = src.startsWith('/images/') ? src : `/images/Devine Awards images/${src}`;
    return encodeURI(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            base64,
            name: file.name
          })
        });
        const data = await res.json();
        if (data.success && data.url) {
          setImageUrl(data.url);
          setUploadProvider(data.provider || 'cloudinary');
        } else {
          alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        console.error(err);
        alert('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setCaption('');
    setImageUrl('');
    setPriority(10);
    setEditingId(null);
    setUploadProvider('');
    setShowUrlInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please upload an image or provide an image URL.');
      return;
    }

    const payload = {
      src: imageUrl,
      category: 'Home Page Highlight',
      caption: caption || 'Home Page Feature',
      priority,
      featured: true
    };

    const currentEditingId = editingId;

    setShowAddModal(false);
    resetForm();

    if (currentEditingId) {
      updateGalleryImage(currentEditingId, payload);
    } else {
      addGalleryImage(payload);
    }
  };

  const handleEditClick = (img: any) => {
    setEditingId(img.id);
    setImageUrl(img.src);
    setCaption(img.caption || '');
    setPriority(img.priority || 10);
    setUploadProvider(img.src?.includes('cloudinary') ? 'cloudinary' : '');
    setShowAddModal(true);
  };

  const handleDelete = async (id: string, captionStr: string) => {
    if (window.confirm(`Are you sure you want to remove this image from the Home Page: "${captionStr}"?`)) {
      await deleteGalleryImage(id);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-[#1B1C19] dark:text-[#F3F4F6]">
      {/* Header Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#1B1C19] dark:text-[#F3F4F6] flex items-center gap-2">
            <Sparkles className="text-[#D9762E]" /> Home Page Showcase Images
          </h2>
          <p className="text-xs text-[#867463] dark:text-[#9CA3AF] mt-1">
            Manage, reorder, and upload images displayed exclusively on the Home Page banner & gallery section with Cloudinary integration.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-[#401C0C] hover:bg-[#5C2913] dark:bg-[#5C2913] text-white rounded-xl text-xs font-semibold px-5 py-2.5 flex items-center gap-2 cursor-pointer transition-all self-start sm:self-center shadow-sm"
        >
          <Plus size={16} /> Add Home Page Image
        </button>
      </div>

      {/* Info Stats Banner */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#242622] border border-[#EAE8E3] dark:border-[#30312E] flex items-center justify-between text-xs text-[#867463] dark:text-[#9CA3AF]">
        <span className="flex items-center gap-1.5 font-semibold text-[#401C0C] dark:text-[#FFD27F]">
          <Eye size={15} /> Total Active Home Page Images: <b className="font-mono text-sm">{filteredHomeImages.length}</b>
        </span>
        <span className="text-[11px] hidden sm:inline">
          Lower priority numbers display first on the Home Page carousel
        </span>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredHomeImages.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-[#1B1C19] rounded-3xl border border-dashed border-[#E4E2DD] dark:border-[#30312E] text-xs text-[#867463] italic">
            No images configured for the Home Page. Click "Add Home Page Image" to upload one with Cloudinary.
          </div>
        ) : (
          filteredHomeImages.map(img => (
            <div
              key={img.id}
              className="bg-white dark:bg-[#1B1C19] rounded-3xl border border-[#EAE8E3] dark:border-[#30312E] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group relative"
            >
              {/* Image Preview Container */}
              <div className="h-48 relative overflow-hidden bg-[#F5F3EE] dark:bg-[#242622] shrink-0">
                <img
                  src={getImageUrl(img.src)}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80';
                  }}
                />

                <span className="absolute top-3 left-3 bg-[#401C0C] text-[#FFD27F] text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <ArrowUpDown size={10} /> Priority: {img.priority || 0}
                </span>

                {(img.src?.includes('cloudinary') || img.src?.startsWith('http')) && (
                  <span className="absolute top-3 right-3 bg-sky-600/90 backdrop-blur-sm text-white text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Cloud size={10} /> Cloudinary
                  </span>
                )}

                {/* Delete overlay button */}
                <button
                  onClick={() => handleDelete(img.id, img.caption)}
                  className="absolute bottom-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Delete image"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Caption & Controls */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs font-semibold text-[#1B1C19] dark:text-[#F3F4F6] line-clamp-2 leading-relaxed">
                  {img.caption || 'Home Page Showcase'}
                </p>

                <button
                  onClick={() => handleEditClick(img)}
                  className="w-full py-2 text-xs text-center border border-[#EAE8E3] dark:border-[#30312E] rounded-xl hover:bg-neutral-50 dark:hover:bg-[#242622] transition-colors font-medium text-[#401C0C] dark:text-[#FFD27F]"
                >
                  Edit Details / Change Image
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Home Page Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1B1C19] border border-[#EAE8E3] dark:border-[#30312E] rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-[#867463] hover:text-[#1B1C19] dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#1B1C19] dark:text-[#F3F4F6] mb-6 flex items-center gap-2">
              <Sparkles className="text-[#D9762E]" size={20} /> {editingId ? 'Edit Home Page Image' : 'Add Home Page Image'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#867463] dark:text-[#9CA3AF] mb-1.5">
                  Caption / Title
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Grand Assembly of Chief Guests & Dignitaries"
                  className="w-full bg-[#F5F3EE] dark:bg-[#242622] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-3 text-xs focus:outline-none focus:border-[#401C0C] dark:focus:border-[#FFD27F] transition-all"
                />
              </div>

              {/* Upload Image Section (Cloudinary) */}
              <div>
                <label className="block text-xs font-semibold text-[#867463] dark:text-[#9CA3AF] mb-1.5">
                  Choose Image File (Stored on Cloudinary) *
                </label>

                {imageUrl ? (
                  /* Uploaded Image Preview Box */
                  <div className="relative rounded-2xl border border-[#E4E2DD] dark:border-[#30312E] p-3 bg-[#F9F8F6] dark:bg-[#242622] flex items-center gap-3">
                    <img 
                      src={getImageUrl(imageUrl)} 
                      alt="Uploaded preview" 
                      className="w-20 h-16 rounded-xl object-cover border border-[#EAE8E3] dark:border-[#30312E] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 size={14} /> Image Selected
                        {uploadProvider === 'cloudinary' || imageUrl.includes('cloudinary') ? (
                          <span className="bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                            <Cloud size={10} /> Cloudinary
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-[#867463] dark:text-[#9CA3AF] truncate mt-1 font-mono">
                        {imageUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setUploadProvider('');
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  /* File Upload Dropzone */
                  <label className={`block border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    uploading 
                      ? 'border-[#D9762E] bg-[#FFF8F2] dark:bg-[#2A231C]' 
                      : 'border-[#E4E2DD] dark:border-[#30312E] hover:border-[#401C0C] dark:hover:border-[#FFD27F] bg-[#F5F3EE]/60 dark:bg-[#242622]/60 hover:bg-[#F5F3EE]'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    {uploading ? (
                      <div className="flex flex-col items-center justify-center py-2 text-[#D9762E]">
                        <Loader2 className="animate-spin mb-2" size={28} />
                        <span className="text-xs font-bold">Uploading image to Cloudinary...</span>
                        <span className="text-[10px] text-[#867463] dark:text-[#9CA3AF] mt-1">Processing file</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#867463] dark:text-[#9CA3AF]">
                        <div className="w-10 h-10 rounded-full bg-[#401C0C]/10 dark:bg-[#FFD27F]/10 text-[#401C0C] dark:text-[#FFD27F] flex items-center justify-center mb-2">
                          <Upload size={20} />
                        </div>
                        <span className="text-xs font-bold text-[#1B1C19] dark:text-[#F3F4F6]">
                          Choose Image File
                        </span>
                        <span className="text-[11px] text-[#867463] dark:text-[#9CA3AF] mt-0.5">
                          Stores automatically in Cloudinary
                        </span>
                      </div>
                    )}
                  </label>
                )}

                {/* Secondary Option: Manual URL input toggle */}
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#401C0C] dark:text-[#FFD27F] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon size={12} /> {showUrlInput ? 'Hide URL field' : 'Or enter external image URL'}
                  </button>
                </div>

                {showUrlInput && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setUploadProvider('manual');
                      }}
                      placeholder="https://... or /images/..."
                      className="w-full bg-[#F5F3EE] dark:bg-[#242622] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#401C0C] dark:focus:border-[#FFD27F] transition-all"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#867463] dark:text-[#9CA3AF] mb-1.5">
                  Display Priority (Lower is first)
                </label>
                <input
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#F5F3EE] dark:bg-[#242622] text-[#1B1C19] dark:text-[#F3F4F6] border border-[#E4E2DD] dark:border-[#30312E] rounded-xl p-3 text-xs focus:outline-none focus:border-[#401C0C] transition-all font-mono"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F5F3EE] dark:border-[#2E302A]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-[#F5F3EE] hover:bg-[#EAE8E3] dark:bg-[#242622] dark:hover:bg-[#2E302A] text-[#534436] dark:text-[#D1D5DB] rounded-xl text-xs font-semibold px-4 py-2.5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-[#401C0C] hover:bg-[#5C2913] dark:bg-[#5C2913] text-white rounded-xl text-xs font-semibold px-5 py-2.5 cursor-pointer flex items-center gap-1 shadow-sm disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> Uploading...
                    </>
                  ) : (
                    'Save Home Image'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
