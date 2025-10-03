import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Link to={`/event/${event._id}`} className="block group">
      <div className="card overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={event?.images?.[0]}
            alt={event?.title || 'Event Image'}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {event.category}
            </span>
          </div>
          {event.featured && (
            <div className="absolute top-4 right-4">
              <div className="bg-accent-500 text-white p-2 rounded-full">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
              {event.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {event.description}
            </p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              <span>{formatDate(event.date)} at {event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-primary-500" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-primary-500" />
                <span>{event.attendees} attending</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-accent-500 fill-current" />
                <span>{event.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={event.organizer?.avatar || ""}
                alt={event.organizer?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600">{event.organizer.name}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-600">
                <div className='flex  text-primary-600 items-center'>
                  <IndianRupee className='h-4 ' />
                  <p>
                    {event.price}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">per ticket</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;