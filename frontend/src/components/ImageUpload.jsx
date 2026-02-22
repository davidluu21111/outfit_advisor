import { useRef } from 'react'

export default function ImageUpload({ preview, onFileChange }) {
  const inputRef = useRef()

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        Outfit Photo <span className="text-brand-600">*</span>
      </label>

      <div
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed border-neutral-200 hover:border-brand-400 rounded-xl p-6 text-center cursor-pointer transition-colors"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="mx-auto max-h-64 rounded-lg object-contain"
          />
        ) : (
          <div className="space-y-2 py-4">
            <div className="text-4xl text-neutral-300">📷</div>
            <p className="text-neutral-400 text-sm">Click to upload or drag an image here</p>
            <p className="text-neutral-300 text-xs">JPG, PNG, WEBP</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => onFileChange(e.target.files[0] ?? null)}
      />
    </div>
  )
}
