import { useState, useEffect } from 'react';
import { Edit, X, User, Mail, Phone, Tag } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '../config/apiconfig';

const EditProfile = () => {
    const [userData, setUserData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector(state => state.auth);
    
    // Available interests for users
    const availableInterests = [
        'Music',
        'Sports',
        'Technology',
        'Art',
        'Food & Drink',
        'Business',
        'Education',
        'Health & Wellness',
        'Travel',
        'Fashion',
        'Gaming',
        'Film',
        'Theater',
        'Dance',
        'Comedy',
        'Networking',
        'Charity',
        'Outdoor',
        'Family',
        'Photography'
    ];

    useEffect(() => {
        if (user) {
            console.log(user);
            setUserData(user);
            // Initialize form data with user data
            setFormData({
                name: user.name || '',
                phone: user.phoneNo || '',
                interests: user.interests || []
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInterestToggle = (interest) => {
        setFormData(prev => {
            const currentInterests = prev.interests || [];
            const updatedInterests = currentInterests.includes(interest)
                ? currentInterests.filter(i => i !== interest)
                : [...currentInterests, interest];
            
            return { ...prev, interests: updatedInterests };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formPayload = new FormData();
            formPayload.append("name", formData.name);
            formPayload.append("phone", formData.phone);
            
            // Only add interests for regular users (not organizers)
            if (userData.role === 'user' && formData.interests) {
                formPayload.append("interests", JSON.stringify(formData.interests));
            }
            
            if (formData.avatarFile) formPayload.append("avatar", formData.avatarFile);

            const { data } = await axiosInstance.put("/users/update-profile", formPayload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(data);
            
            // Update local user data
            setUserData(prev => ({
                ...prev,
                ...formData,
                avatar: data?.avatar || prev.avatar
            }));
            
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const isUserRole = userData.role === 'user';
    const isOrganizerRole = userData.role === 'organizer';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-4 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-2">
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Manage your personal information and account preferences
                    </p>
                </div>

                {/* Profile Card */}
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-8 py-6 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">Personal Details</h2>
                                <p className="text-gray-600">Keep your information up to date</p>
                                {userData.role && (
                                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-2">
                                        Role: {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary flex items-center space-x-2 text-sm"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                                    {userData.avatar ? (
                                        <img
                                            src={userData.avatar}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                                            <User className="w-10 h-10 text-primary-600" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{userData.name || 'Loading...'}</h3>
                                <p className="text-gray-600 mb-1">Member since 2024</p>
                                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                    ✓ Verified Account
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid gap-6">
                            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</p>
                                    <p className="text-lg font-semibold text-gray-900">{userData.name || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                                    <Mail className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email Address</p>
                                    <p className="text-lg font-semibold text-gray-900">{userData.email || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
                                    <Phone className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone Number</p>
                                    <p className="text-lg font-semibold text-gray-900">{userData.phoneNo || 'Not provided'}</p>
                                </div>
                            </div>

                            {/* Interests Section - Only for Users */}
                            {isUserRole && (
                                <div className="flex items-start p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mr-4">
                                        <Tag className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Interests</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {userData.interests && userData.interests.length > 0 ? (
                                                userData.interests.map((interest, index) => (
                                                    <span 
                                                        key={index}
                                                        className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No interests selected</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Organizer Badge */}
                            {isOrganizerRole && (
                                <div className="flex items-center p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mr-4">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-indigo-700 uppercase tracking-wide">Organizer Account</p>
                                        <p className="text-lg font-semibold text-indigo-900">Event Management Access</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Modal */}
           {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
    <div className={`bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all ${isUserRole ? 'max-w-2xl' : 'max-w-md'}`}>
      
      {/* Modal Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
        <button
          onClick={() => setIsModalOpen(false)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Modal Body */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 text-sm">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={userData.email || ''}
            disabled
            className="w-full px-3 py-2 border border-gray-200 text-gray-500 rounded focus:ring-1 focus:ring-primary-300 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Interests Section */}
        {isUserRole && (
          <div>
            <label className="block font-medium mb-2">
              Interests <span className="text-xs font-normal text-gray-500">(Select your event preferences)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
              {availableInterests.map((interest, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-2 rounded border text-xs font-medium transition-all ${
                    formData.interests?.includes(interest)
                      ? 'bg-orange-100 border-orange-500 text-orange-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-600">Selected: {formData.interests?.length || 0} interests</p>
          </div>
        )}

        {/* Profile Picture */}
        <div>
          <label className="block font-medium mb-1">Profile Picture</label>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
            {formData.avatarPreview && (
              <img
                src={formData.avatarPreview}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData(prev => ({ ...prev, avatarFile: file }));
                const reader = new FileReader();
                reader.onload = () => setFormData(prev => ({ ...prev, avatarPreview: reader.result }));
                if (file) reader.readAsDataURL(file);
              }}
              className="flex-1 px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="btn-secondary text-sm"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary text-sm min-w-[80px] flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : 'Save'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        </div>
    );
};

export default EditProfile;