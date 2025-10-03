const ReviewPublishForm = ({ watch, imagePreviews }) => {
  const data = watch();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Review Event Details</h2>

      <div>
        <p><strong>Title:</strong> {data.title}</p>
        <p><strong>Description:</strong> {data.description}</p>
        <p><strong>Date:</strong> {data.date}</p>
        <p><strong>Time:</strong> {data.time}</p>
        <p><strong>Location:</strong> {data.location}</p>
        <p><strong>Privacy:</strong> {data.privacy}</p>
      </div>

      <div>
        <h3 className="font-semibold">Tickets</h3>
        <p>General: ₹{data.generalPrice || 0} (Qty: {data.generalQuantity || 0})</p>
        <p>VIP: ₹{data.vipPrice || 0} (Qty: {data.vipQuantity || 0})</p>
      </div>

      <div>
        <h3 className="font-semibold">Images</h3>
        <div className="flex gap-3 flex-wrap">
          {imagePreviews.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`review-${idx}`}
              className="w-24 h-24 object-cover rounded shadow"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPublishForm;
