// Event-App/frontend/src/components/NotificationPopup.jsx

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowLoginNotification } from '../store/slices/uiSlice';
import { X, Bell, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationPopup = () => {
    const dispatch = useDispatch();
    const { showLoginNotification, notificationData } = useSelector(state => state.ui);
    const { newEvents, upcomingAlerts } = notificationData;

    const handleClose = () => {
        dispatch(setShowLoginNotification(false));
    };

    if (!showLoginNotification || (newEvents.length === 0 && upcomingAlerts.length === 0)) {
        return null;
    }

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const hasNewEvents = newEvents.length > 0;
    const hasUpcomingAlerts = upcomingAlerts.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform transition-all animate-slide-up">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className='flex items-center space-x-3'>
                        <Bell className="w-6 h-6 text-primary-600" />
                        <h3 className="text-xl font-bold text-gray-900">Welcome Back! Notifications</h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close notifications"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-8">
                    
                    {hasUpcomingAlerts && (
                        <div className="space-y-4 border border-red-200 bg-red-50 p-4 rounded-xl">
                            <h4 className="flex items-center space-x-2 text-lg font-semibold text-red-700">
                                <Calendar className="w-5 h-5" />
                                <span>Upcoming Event Alerts ({upcomingAlerts.length})</span>
                            </h4>
                            <p className='text-sm text-red-600'>Hurry up! These events you booked are happening in the next 1-2 days.</p>
                            <div className='space-y-3'>
                                {upcomingAlerts.map((alert, index) => (
                                    <div key={index} className='p-3 bg-white rounded-lg shadow-sm border border-red-100 flex justify-between items-center'>
                                        <div>
                                            <Link to={`/event/${alert.eventId}`} className="font-medium text-gray-900 hover:text-red-600 transition-colors">
                                                {alert.eventTitle}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-0.5">on {formatDate(alert.eventDate)} at {alert.time}</p>
                                        </div>
                                        <ArrowRight className='w-4 h-4 text-red-600' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasNewEvents && (
                        <div className="space-y-4 border border-green-200 bg-green-50 p-4 rounded-xl">
                            <h4 className="flex items-center space-x-2 text-lg font-semibold text-green-700">
                                <TrendingUp className="w-5 h-5" />
                                <span>Fresh Events Added ({newEvents.length})</span>
                            </h4>
                            <p className='text-sm text-green-600'>Check out the latest events added to the platform this week.</p>
                            <div className='space-y-3'>
                                {newEvents.map((event, index) => (
                                    <div key={index} className='p-3 bg-white rounded-lg shadow-sm border border-green-100 flex justify-between items-center'>
                                        <div>
                                            <Link to={`/event/${event._id}`} className="font-medium text-gray-900 hover:text-green-600 transition-colors">
                                                {event.title}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-0.5">Category: {event.category}</p>
                                        </div>
                                        <ArrowRight className='w-4 h-4 text-green-600' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn-primary"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPopup;