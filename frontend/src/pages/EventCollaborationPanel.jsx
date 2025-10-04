import React, { useState, useEffect } from 'react';
import axiosInstance from "../config/apiconfig";

const EventCollaborationPanel = ({ eventId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMatches();
  }, [eventId]);

  const fetchMatches = async () => {
    try {
      const response = await axiosInstance.get(`/collab/${eventId}/match`);
      console.log('Matches response:', response.data); // Debug log
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };
  const  Collab = async (eventId, invitedUserId, token) => {
  try {
    const res = await axiosInstance.post(
      "/api/collab/",
      { eventId, invitedUserId }
    );
    console.log(res.data.message);
  } catch (err) {
    console.error("Error sending collaboration request:", err);
  }
};

  const handleInvite = async (invitedUserId, userName) => {
    try {
      const token = localStorage.getItem('token');
      await Collab(eventId, invitedUserId, token);
      
      // Update UI
      setMatches(prev => prev.map(match => 
        match.id === invitedUserId 
          ? { ...match, status: 'pending' }
          : match
      ));
      
      // Show success message
      alert(`Invitation sent to ${userName}`);
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation');
    }
  };

  // Filter matches based on search and filter criteria
  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.interests.some(interest => 
        interest.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesFilter = filter === 'all' || 
      (filter === 'high' && match.compatibilityScore >= 70) ||
      (filter === 'medium' && match.compatibilityScore >= 30 && match.compatibilityScore < 70);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
        Finding your matches...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Find Collaboration Partners
        </h2>
        <p className="text-gray-600">
          Top matches based on common interests and event history
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or interest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Compatibility</option>
          <option value="high">High Compatibility (70%+)</option>
          <option value="medium">Medium Compatibility (30-70%)</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredMatches.length} of {matches.length} matches
      </div>

      {/* Match Cards Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {filteredMatches.map(match => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onInvite={handleInvite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No matches found. Try adjusting your search or filters.
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
          View All Collaborators
        </button>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
          Auto-Suggest Best Match
        </button>
      </div>
    </div>
  );
};

// Match Card Component
const MatchCard = ({ match, onInvite }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get compatibility color based on score
  const getCompatibilityColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div 
      className={`bg-white border w-full  border-gray-200 rounded-xl p-5 transition-all duration-300 ${
        isHovered ? 'shadow-lg scale-105' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0">
          {match.avatar ? (
            <img 
              src={match.avatar} 
              alt={match.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-lg">
                {match.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {match.name}
          </h3>
          
          {/* Compatibility Score */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getCompatibilityColor(match.compatibilityScore)}`}
                style={{ width: `${match.compatibilityScore}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
              {match.compatibilityScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Common Interests */}
      <div className="mb-3  w-full" >
        <h4 className="text-xs font-semibold text-gray-500 mb-2">COMMON INTERESTS</h4>
        <div className="flex flex-wrap  gap-1">
          {match.interests.slice(0, 4).map(interest => (
            <span 
              key={interest}
              className="px-2 py-1  w-full overflow-auto flex flex-col bg-indigo-100 text-indigo-700 text-xs rounded-md font-small"
            >
                <p>

              {interest}
                </p>
            </span>
          ))}
          {match.interests.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{match.interests.length - 4}
            </span>
          )}
          {match.interests.length === 0 && (
            <span className="text-xs text-gray-400">No interests listed</span>
          )}
        </div>
      </div>

      {/* Event Categories */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 mb-2">EVENT CATEGORIES</h4>
        <div className="flex flex-wrap gap-1">
          {match.categories?.slice(0, 3).map(category => (
            <span 
              key={category}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium"
            >
              {category}
            </span>
          ))}
          {match.categories?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{match.categories.length - 3}
            </span>
          )}
          {(!match.categories || match.categories.length === 0) && (
            <span className="text-xs text-gray-400">No categories</span>
          )}
        </div>
      </div>

      {/* Invite Button */}
      <button
        onClick={() => onInvite(match.id, match.name)}
        disabled={match.status === 'pending'}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors ${
          match.status === 'pending'
            ? 'bg-amber-500 text-white cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {match.status === 'pending' ? 'Pending' : 'Invite to Collaborate'}
      </button>
    </div>
  );
};

export default EventCollaborationPanel;