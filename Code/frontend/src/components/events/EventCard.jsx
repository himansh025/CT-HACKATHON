import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, IndianRupee, User } from 'lucide-react';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  console.log(event);
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
    } catch {
      return timeString;
    }
  };

  // Safely get event properties with fallbacks
  const getEventData = () => {
    return {
      id: event?._id,
      title: event?.title || 'Untitled Event',
      description: event?.description || 'No description available',
      category: event?.category || 'General',
      date: event?.date,
      startTime: event?.startTime || event?.time,
      endTime: event?.endTime,
      images: event?.images || [],
      price: event?.price || 0,
      venue: event?.venue?.name || event?.venue?.address || event?.venue || 'Location TBA',
      attendees: event?.attendees || 0,
      rating: event?.rating || 0,
      featured: event?.featured || false,
      organizer: {
        name: event?.organizer?.name || 'Unknown Organizer',
        avatar: event?.organizer?.avatar,
        organizer_Id: event?.organizer?.organizer_Id
      },
      tickets: event?.tickets || []
    };
  };

  const eventData = getEventData();
  const displayImage = eventData.images[0] || '/default-event-image.jpg';
  const displayTime = eventData.endTime 
    ? `${formatTime(eventData.startTime)} - ${formatTime(eventData.endTime)}`
    : formatTime(eventData.startTime);

  return (
    <Link to={`/event/${eventData.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-200">
          <img
            src={displayImage}
            alt={eventData.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/default-event-image.jpg';
            }}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
              {eventData.category.toLowerCase()}
            </span>
          </div>
          {eventData.featured && (
            <div className="absolute top-4 right-4">
              <div className="bg-accent-500 text-white p-2 rounded-full shadow-lg">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          )}
          {/* Price Badge */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
              <div className="flex items-center text-primary-600 font-semibold">
                <IndianRupee className="h-3 w-3 mr-1" />
                <span className="text-sm">{eventData.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
              {eventData.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
              {eventData.description}
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            {/* Date and Time */}
            {eventData.date && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span className="flex-1">
                  {formatDate(eventData.date)}
                  {displayTime && ` • ${displayTime}`}
                </span>
              </div>
            )}
            
            {/* Location */}
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <span className="flex-1 line-clamp-2">{eventData.venue}</span>
            </div>
            
            {/* Attendees and Rating */}
            <div className="flex items-center space-x-4 pt-1">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-primary-500" />
                <span>{eventData.attendees.toLocaleString()} attending</span>
              </div>
              {eventData.rating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-accent-500 fill-current" />
                  <span>{eventData.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Organizer and Price */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center space-x-3 min-w-0">
              {eventData.organizer.avatar ? (
                <img
                  src={eventData.organizer.avatar}
                  alt={eventData.organizer.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <div className={`${!eventData.organizer.avatar ? 'flex items-center space-x-2' : ''}`}>
                {!eventData.organizer.avatar && (
                  <User className="w-6 h-6 text-primary-500 flex-shrink-0" />
                )}
                <span className="text-sm text-gray-600 truncate">
                  {eventData.organizer.name}
                </span>
              </div>
            </div>
            
            {/* Price - Only show if not already shown in badge */}
            <div className="text-right flex-shrink-0 ml-2">
              <div className="text-lg font-bold text-primary-600 lg:hidden">
                <div className="flex items-center justify-end">
                  <IndianRupee className="h-4" />
                  <span>{eventData.price}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 lg:hidden">per ticket</div>
            </div>
          </div>

          {/* Ticket Types Preview */}
          {eventData.tickets && eventData.tickets.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {eventData.tickets.slice(0, 3).map((ticket, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded capitalize"
                  >
                    {ticket.type.toLowerCase()}
                  </span>
                ))}
                {eventData.tickets.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
                    +{eventData.tickets.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;