const TicketPricingForm = ({ register }) => (
  <div className="space-y-6">
    <div className="border rounded p-4">
      <h2 className="font-semibold mb-3">General Admission</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("generalPrice")}
            className="w-full border p-2 rounded"
            placeholder="e.g. 20"
          />
        </div>
        <div>
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            {...register("generalQuantity")}
            className="w-full border p-2 rounded"
            placeholder="e.g. 100"
          />
        </div>
      </div>
    </div>

    <div className="border rounded p-4">
      <h2 className="font-semibold mb-3">VIP</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("vipPrice")}
            className="w-full border p-2 rounded"
            placeholder="e.g. 50"
          />
        </div>
        <div>
          <label className="block mb-1">Quantity</label>
          <input
            type="number"
            {...register("vipQuantity")}
            className="w-full border p-2 rounded"
            placeholder="e.g. 50"
          />
        </div>
      </div>
    </div>
  </div>
);

export default TicketPricingForm;
