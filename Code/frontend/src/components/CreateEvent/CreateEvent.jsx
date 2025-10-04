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
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const { user } = useSelector((state) => state.auth);

  const { register, handleSubmit, watch, formState: { errors }, setValue, trigger, getValues } = useForm({
    defaultValues: {
      ticketType: "paid",
      privacy: "public",
      featured: false
    }
  });

  const steps = [
    { id: 1, title: "Basic Details" },
    { id: 2, title: "Tickets & Pricing" },
    { id: 3, title: "Media & Settings" },
    { id: 4, title: "Review & Publish" },
  ];

  const nextStep = async () => {
    if (currentStep < steps.length) {
      const isValid = await trigger();
      if (isValid) {
        const currentData = getValues();
        setEventData(prev => ({ ...prev, ...currentData }));
        setCurrentStep((s) => s + 1);
      }
    }
  };

  const prevStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);

  const handleCoordinatesChange = (coords) => {
    setCoordinates(coords);
    setValue("latitude", coords.lat, { shouldValidate: true });
    setValue("longitude", coords.lng, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const completeEventData = { 
      ...eventData, 
      ...data,
      user: user?._id
    };

    // Build tickets array according to schema
    const tickets = [];
    
    if (data.generalPrice && parseFloat(data.generalPrice) > 0) {
      tickets.push({
        type: "General Admission",
        price: parseFloat(data.generalPrice),
        quantity: parseInt(data.generalQuantity) || 100,
        sold: 0
      });
    }
    
    if (data.vipPrice && parseFloat(data.vipPrice) > 0) {
      tickets.push({
        type: "VIP",
        price: parseFloat(data.vipPrice),
        quantity: parseInt(data.vipQuantity) || 50,
        sold: 0
      });
    }

    completeEventData.tickets = tickets;
    completeEventData.price = data.generalPrice ? parseFloat(data.generalPrice) : 0;
    
    // Add coordinates and venue details
    completeEventData.coordinates = coordinates;
    completeEventData.venueName = data.venueName;
    completeEventData.venueAddress = data.location;
    completeEventData.venueCapacity = parseInt(data.venueCapacity) || 100;

    // FormData for file upload
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
        window.location.href = "/events";
      }
    } catch (err) {
      console.error("Error creating event:", err);
      alert(err.response?.data?.message || "Failed to create event.");
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
          {currentStep === 1 && (
            <BasicDetailsForm 
              register={register} 
              errors={errors} 
              coordinates={coordinates}
              onCoordinatesChange={handleCoordinatesChange}
              setValue={setValue}
            />
          )}
          {currentStep === 2 && (
            <TicketPricingForm 
              register={register} 
              errors={errors}
              watch={watch}
            />
          )}
          {currentStep === 3 && (
            <MediaSettingsForm
              register={register}
              errors={errors}
              imageFiles={imageFiles}
              setImageFiles={setImageFiles}
              imagePreviews={imagePreviews}
              setImagePreviews={setImagePreviews}
            />
          )}
          {currentStep === 4 && (
            <ReviewPublishForm 
              eventData={{...eventData, ...getValues()}}
              imagePreviews={imagePreviews} 
              coordinates={coordinates}
            />
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {currentStep === steps.length ? "Publish Event" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;