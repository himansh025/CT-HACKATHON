import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Share2,
  Heart,
  Clock,
  Tag,
  Plus,
  Minus,
  User,
  IndianRupee
} from 'lucide-react';
import { addTicket, removeTicket } from '../store/slices/bookingSlice';
import { format } from 'date-fns';
import { setCurrentEvent } from '../store/slices/eventsSlice';

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setLoading] = useState(false)

  const { currentEvent } = useSelector(state => state.events);
  console.log(currentEvent, "sc");
  const { selectedTickets, totalAmount } = useSelector(state => state.booking);

  useEffect(() => {
    if (id) {
      dispatch(setCurrentEvent(id));
    }
  }, [dispatch, id]);

  if (isLoading || !currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="bg-gray-200 h-64 lg:h-96 rounded-2xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
              <div className="bg-gray-200 h-64 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const event = currentEvent;
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getSelectedQuantity = (ticketType) => {
    const selected = selectedTickets.find(t => t.type === ticketType);
    return selected ? selected.quantity : 0;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Event Banner */}
        <div className="relative overflow-hidden rounded-2xl mb-8">
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-64 lg:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>
              <div className="flex items-center space-x-1 text-white">
                <Star className="w-4 h-4 fill-current text-accent-400" />
                <span className="font-medium">{event.rating}</span>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex space-x-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full transition-all duration-200 ${isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h3>
                      <p className="text-gray-700 leading-relaxed">{event.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-primary-600" />
                          <div>
                            <div className="font-medium text-gray-900">{event.attendees} Attendees</div>
                            <div className="text-sm text-gray-500">People going</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Tag className="w-5 h-5 text-primary-600" />
                          <div>
                            <div className="font-medium text-gray-900">{event.category}</div>
                            <div className="text-sm text-gray-500">Event category</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Organizer</h4>
                          <div className="flex items-center space-x-3">
                            {event.organizer?.avatar && (

                              <img
                                src={event.organizer.avatar}
                                alt={event.organizer.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <User className="w-6 h-6 text-primary-600" />

                            <div>
                              <div className="font-medium text-gray-900">{event.organizer.name}</div>
                              <div className="text-sm text-gray-500">Event Organizer</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tickets' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Available Tickets</h3>
                    {event.tickets.map((ticket, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{ticket.type}</h4>

                            <div className='flex items-center'>
                            <IndianRupee className='h-4 '/>
                            <p className="text-gray-600">
                            {ticket.price}</p>
                            </div>
                            <p className="text-sm text-gray-500">{ticket.quantity} available</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => dispatch(removeTicket(ticket))}
                              disabled={getSelectedQuantity(ticket.type) === 0}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {getSelectedQuantity(ticket.type)}
                            </span>
                            <button
                              onClick={() => dispatch(addTicket(ticket))}
                              disabled={getSelectedQuantity(ticket.type) >= ticket.available}
                              className="p-1 rounded-full bg-primary-100 hover:bg-primary-200 text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Reviews & Ratings</h3>
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No reviews yet. Be the first to review this event!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Book Your Tickets</h3>

              {selectedTickets.length > 0 ? (
                <div className="space-y-4">
                  {selectedTickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.type}</div>
                        <div className="text-sm text-gray-500">x{ticket.quantity}</div>
                      </div>
                      <div className="text-right">
                          <div className='flex items-center'>
                            <IndianRupee className='h-3 '/>
                        <div className="font-medium text-gray-900">{ticket.price * ticket.quantity}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      
                            <div className='flex  text-primary-600 items-center'>
                            <IndianRupee className='h-5 '/>
                      <span className="text-2xl font-bold text-primary-600">{totalAmount}</span>
                      </div>
                    </div>

                    <Link
                      to={`/checkout/${event._id}`}
                      className="w-full btn-primary text-center block"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Select tickets from the Tickets tab to get started</p>
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className="btn-primary"
                  >
                    Select Tickets
                  </button>
                </div>
              )}

              {/* Event Info Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <span>{formatDate(event.date)} at {event.time}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Users className="w-5 h-5 text-primary-600" />
                  <span>{event.attendees} people attending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
  } catch {
    return dateString;
  }
};

export default EventDetail;