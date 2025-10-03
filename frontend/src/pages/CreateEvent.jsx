import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Calendar,
  MapPin,
  DollarSign,
  Image,
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Upload,
  X,
  ImageIcon,
  Plus
} from 'lucide-react';
import axiosinstance from '../config/apiconfig'
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';

const CreateEvent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();

  const steps = [
    { id: 1, title: 'Basic Details', icon: Calendar },
    { id: 2, title: 'Tickets & Pricing', icon: DollarSign },
    { id: 3, title: 'Media & Settings', icon: Image },
    { id: 4, title: 'Review & Publish', icon: Eye },
  ];

  // Handle multiple image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Validate each file
    const validFiles = [];
    const validPreviews = [];

    files.forEach((file) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image file (JPEG, PNG, or GIF)`);
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB. Please select a smaller image.`);
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        validPreviews.push({
          file: file,
          preview: reader.result,
          name: file.name
        });

        // Update state when all previews are loaded
        if (validPreviews.length === validFiles.length) {
          setImageFiles(prev => [...prev, ...validFiles]);
          setImagePreviews(prev => [...prev, ...validPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    e.target.value = '';
  };

  // Remove specific image
  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all images
  const clearAllImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    console.log(imageFiles);
    console.log(user);

    if (!completeEventData.tickets) {
      completeEventData.tickets = [];
    }
    if (data.generalPrice && parseFloat(data.generalPrice) > 0) {
      completeEventData.tickets.push({
        type: 'General Admission',
        price: parseFloat(data.generalPrice),
        quantity: parseInt(data.generalQuantity) || 100,
        sold: 0
      });
    }

    if (data.vipPrice && parseFloat(data.vipPrice) > 0) {
      completeEventData.tickets.push({
        type: 'VIP',
        price: parseFloat(data.vipPrice),
        quantity: parseInt(data.vipQuantity) || 50,
        sold: 0
      });
    }

    completeEventData.price = data.generalPrice ? parseFloat(data.generalPrice) : 0;
    completeEventData.user = user?._id;

    const formData = new FormData();

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file); // key must match backend field
      });
    }

    formData.append("eventData", JSON.stringify(completeEventData));
    try{
    if (currentStep < steps.length) {
      // Store data for next steps
      setEventData(completeEventData);
      nextStep();
    } else {
     
      // Final submission - send complete data to backend
      console.log('Complete event data being sent:', completeEventData);

      const response = await axiosinstance.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log('Backend response:', response.data);

      if (response.data) {
        alert('Event created successfully!');
        // You might want to redirect to the events list or event details page
        console.log('Success message:', response.data.message);
      }
    }
  } catch (error) {
    console.error('Error creating event:', error);
    alert('Failed to create event. Please try again.');
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return <Loader />;
}

return (
  <div className="min-h-screen bg-gray-50 pt-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-600">Fill in the details to create your amazing event</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${currentStep >= step.id
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'bg-white border-gray-200 text-gray-400'
                }`}>
                <step.icon className="w-6 h-6" />
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 transition-colors duration-200 ${currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                  }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="text-center flex-1">
              <div className={`text-sm font-medium transition-colors duration-200 ${currentStep >= step.id ? 'text-primary-600' : 'text-gray-400'
                }`}>
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Event Details</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  {...register('title', { required: 'Event title is required' })}
                  className="input-field"
                  placeholder="Enter your event title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe your event in detail"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    {...register('date', { required: 'Date is required' })}
                    type="date"
                    className="input-field"
                  />
                  {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    {...register('time', { required: 'Time is required' })}
                    type="time"
                    className="input-field"
                  />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('venue', { required: 'Venue is required' })}
                    className="input-field pl-10"
                    placeholder="Enter venue address"
                  />
                </div>
                {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field"
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
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tickets & Pricing</h2>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">General Admission</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <input
                        {...register('generalPrice')}
                        type="number"
                        className="input-field"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity Available
                      </label>
                      <input
                        {...register('generalQuantity')}
                        type="number"
                        className="input-field"
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">VIP (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <input
                        {...register('vipPrice')}
                        type="number"
                        className="input-field"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity Available
                      </label>
                      <input
                        {...register('vipQuantity')}
                        type="number"
                        className="input-field"
                        placeholder="50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Media & Settings</h2>

              {/* Multiple Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Images
                </label>

                {/* Upload Button */}
                <div className="mb-4">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Upload multiple high-quality images (JPEG, PNG, GIF). Max 5MB each.
                  </p>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Selected Images ({imagePreviews.length})
                      </span>
                      <button
                        type="button"
                        onClick={clearAllImages}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imagePreviews.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 truncate">{image.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>


              <div className="flex items-center space-x-3">
                <input
                  {...register('isDraft')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  Save as draft (you can publish later)
                </label>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review & Publish</h2>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Event Preview</h3>
                <div className="space-y-3 text-sm">
                  <div><strong>Title:</strong> {watch('title') || 'Not specified'}</div>
                  <div><strong>Date:</strong> {watch('date') || 'Not specified'}</div>
                  <div><strong>Time:</strong> {watch('time') || 'Not specified'}</div>
                  <div><strong>Venue:</strong> {watch('venue') || 'Not specified'}</div>
                  <div><strong>Category:</strong> {watch('category') || 'Not specified'}</div>
                  <div><strong>General Price:</strong> ${watch('generalPrice') || '0'}</div>
                  <div><strong>Images:</strong> {imagePreviews.length} selected</div>
                </div>

                {/* Preview Images */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Images:</h4>
                    <div className="flex flex-wrap gap-2">
                      {imagePreviews.slice(0, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                      {imagePreviews.length > 4 && (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-500">+{imagePreviews.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  <strong>Ready to publish?</strong> Once published, your event will be visible to all users and they can start booking tickets.
                  {imagePreviews.length > 0 && (
                    <span className="block mt-2">
                      📷 {imagePreviews.length} image(s) will be uploaded to Cloudinary.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                className="flex items-center space-x-2 px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Save className="w-5 h-5" />
                <span>Save Draft</span>
              </button>

              <button
                type="submit"
                disabled={uploadingImages}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>
                  {uploadingImages
                    ? 'Uploading Images...'
                    : currentStep === steps.length
                      ? 'Publish Event'
                      : 'Next'
                  }
                </span>
                {/* {currentStep < steps.length && !uploadingImages && <ArrowRight className="w-5 h-5" />} */}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
);
};

export default CreateEvent;