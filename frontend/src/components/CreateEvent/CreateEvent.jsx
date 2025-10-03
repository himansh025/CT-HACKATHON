import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import axiosinstance from "../../config/apiconfig";
import Loader from "../../components/Loader";

import ProgressSteps from "./ProgressSteps";
import BasicDetailsForm from "./steps/BasicDetailsForm";
import TicketPricingForm from "./steps/TicketPricingForm";
import MediaSettingsForm from "./steps/MediaSettingsForm";
import ReviewPublishForm from "./steps/ReviewPublishForm";

const CreateEvent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { user } = useSelector((state) => state.auth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const steps = [
    { id: 1, title: "Basic Details" },
    { id: 2, title: "Tickets & Pricing" },
    { id: 3, title: "Media & Settings" },
    { id: 4, title: "Review & Publish" },
  ];

  const nextStep = () => currentStep < steps.length && setCurrentStep((s) => s + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);

 const onSubmit = async (data) => {
  // Merge previous eventData with current form step data
  let completeEventData = { ...eventData, ...data };

  // Build tickets array from scratch
  const tickets = [];

  if (data.generalPrice && parseFloat(data.generalPrice) > 0) {
    tickets.push({
      type: "General Admission",
      price: parseFloat(data.generalPrice),
        available: parseInt(data.generalQuantity) || 100
    });
  }

  if (data.vipPrice && parseFloat(data.vipPrice) > 0) {
    tickets.push({
      type: "VIP",
      price: parseFloat(data.vipPrice),
      quantity: parseInt(data.vipQuantity) || 50,
      available: parseInt(data.generalQuantity) || 100
    });
  }

  completeEventData.tickets = tickets; // overwrite tickets instead of pushing
  completeEventData.price = data.generalPrice ? parseFloat(data.generalPrice) : 0;
  completeEventData.user = user?._id;

  // FormData
  const formData = new FormData();
  imageFiles.forEach((file) => formData.append("images", file));
  formData.append("eventData", JSON.stringify(completeEventData));

  try {
    if (currentStep < steps.length) {
      setEventData(completeEventData);
      nextStep();
    } else {
      setLoading(true);
      const res = await axiosinstance.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Event created successfully!");
      console.log("Backend response:", res.data);
    }
  } catch (err) {
    console.error("Error creating event:", err);
    alert("Failed to create event.");
  } finally {
    setLoading(false);
  }
};


  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Create New Event</h1>

        <ProgressSteps steps={steps} currentStep={currentStep} />

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow">
          {currentStep === 1 && <BasicDetailsForm register={register} errors={errors} />}
          {currentStep === 2 && <TicketPricingForm register={register} />}
          {currentStep === 3 && (
            <MediaSettingsForm
              register={register}
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              imagePreviews={imagePreviews}
              setImagePreviews={setImagePreviews}
            />
          )}
          {currentStep === 4 && <ReviewPublishForm watch={watch} imagePreviews={imagePreviews} />}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 border rounded"
            >
              Previous
            </button>
            <button type="submit" className="btn-primary">
              {currentStep === steps.length ? "Publish Event" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
