// frontend/src/components/InterestSelectionModal.jsx
import React, { useState } from "react";
import axios from "../config/apiconfig"; // Assuming axios setup is in apiconfig.js/axiosConfig.js
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "../store/slices/authSlice"; // To update user state

// Mock list based on common event categories (adjust to your app's actual categories)
const EVENT_CATEGORIES = [
  "Music",
  "Technology",
  "Business",
  "Sports",
  "Arts",
  "Health & Wellness",
  "Food & Drink",
  "Education",
  "Family",
];

const InterestSelectionModal = ({ show, onClose }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Conditionally render the modal
  if (!show) return null;

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      alert("Please select at least one interest.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/users/interests", {
        interests: selectedInterests,
      });

      // Update the user state in Redux to mark interests as set
      // Assuming your backend returns the updated user or just success message
      // We will update the local Redux state to include the interests
      dispatch(
        setUserDetails({
          // Keep existing user details and add interests
          ...useSelector((state) => state.auth.user),
          interests: selectedInterests,
        })
      );

      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Failed to save interests:", error);
      alert("Failed to save interests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">👋 Tell Us Your Interests</h2>
        <p className="text-gray-600 mb-6">
          Help us personalize your event recommendations. Select all that apply!
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {EVENT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleInterestToggle(category)}
              className={`px-4 py-2 rounded-full border transition-colors duration-200 
                ${
                  selectedInterests.includes(category)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-50"
                }`}
              disabled={loading}
            >
              {category}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-200 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Get Recommendations"}
        </button>
      </div>
    </div>
  );
};

export default InterestSelectionModal;
