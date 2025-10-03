const BasicDetailsForm = ({ register, errors }) => (
  <div className="space-y-4">
    <div>
      <label className="block mb-1 font-medium">Event Title *</label>
      <input
        {...register("title", { required: "Title is required" })}
        className="w-full border p-2 rounded"
        placeholder="Enter event title"
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Description *</label>
      <textarea
        {...register("description", { required: "Description is required" })}
        className="w-full border p-2 rounded"
        placeholder="Enter event description"
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-1 font-medium">Date *</label>
        <input
          type="date"
          {...register("date", { required: "Date is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Time *</label>
        <input
          type="time"
          {...register("time", { required: "Time is required" })}
          className="w-full border p-2 rounded"
        />
        {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
      </div>
    </div>

    <div>
      <label className="block mb-1 font-medium">Location *</label>
      <input
        {...register("location", { required: "Location is required" })}
        className="w-full border p-2 rounded"
        placeholder="Event location"
      />
      {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
    </div>

    <div>
      <label className="block mb-1 font-medium">Category *</label>
      <select
        {...register("category", { required: "Category is required" })}
        className="w-full border p-2 rounded"
      >
        <option value="">Select a category</option>
        <option value="Technology">Technology</option>
        <option value="Music">Music</option>
        <option value="Business">Business</option>
        <option value="Sports">Sports</option>
        <option value="Arts">Arts</option>
        <option value="Food">Food</option>
        <option value="Health">Health</option>
      </select>
      {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
    </div>
  </div>
);

export default BasicDetailsForm;
