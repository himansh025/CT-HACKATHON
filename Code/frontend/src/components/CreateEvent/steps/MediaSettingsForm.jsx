const MediaSettingsForm = ({
  register,
  imageFiles,
  setImageFiles,
  imagePreviews,
  setImagePreviews,
}) => {
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-1 font-medium">Upload Event Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border p-2 rounded"
        />
        <div className="flex gap-3 mt-3 flex-wrap">
          {imagePreviews.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              className="w-24 h-24 object-cover rounded shadow"
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Privacy</label>
        <select {...register("privacy")} className="w-full border p-2 rounded">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>
    </div>
  );
};

export default MediaSettingsForm;
