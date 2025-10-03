import  { useState, useEffect } from 'react';
import { Edit, X, User, Mail, Phone } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '../config/apiconfig';

const EditProfile = () => {
    const [userData, setuserData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useSelector(state => state.auth)
    console.log(user);
    useEffect(() => {
        if (user) {
            console.log(user);
            setuserData(user)
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formPayload = new FormData();
            formPayload.append("name", formData.name);
            formPayload.append("phone", formData.phone);
            if (formData.avatarFile) formPayload.append("avatar", formData.avatarFile);

            const { data } = await axiosInstance.put("/users/update-profile", formPayload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log(data);
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

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

                            {/* userData Info */}
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
                                    <userData className="w-6 h-6 text-blue-600" />
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900">Edit Profile</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        disabled
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 text-gray-500 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div >
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Avatar URL
                                    </label>
                                    <div className='md:flex justify-center items-center'>

                                        {formData.avatarPreview && (
                                            <img
                                                src={formData.avatarPreview}
                                                alt="Avatar Preview"
                                                className="w-20 h-20 rounded-full mt-2 object-cover"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setFormData({ ...formData, avatarFile: file });

                                                // Optional: show preview
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    setFormData((prev) => ({ ...prev, avatarPreview: reader.result }));
                                                };
                                                if (file) reader.readAsDataURL(file);
                                            }}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                </div>
                            </div>
                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="btn-secondary"
                                    disabled={isLoading}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary min-w-[100px] flex items-center justify-center"
                                    disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Save Changes'
                                    )}
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