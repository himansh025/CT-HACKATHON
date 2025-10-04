import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Menu, X, User, Calendar, Settings, LogOut } from 'lucide-react';
import { toggleMobileMenu, closeMobileMenu, setSearchQuery } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isMobileMenuOpen, searchQuery } = useSelector(state => state.ui);
  const { user } = useSelector(state => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      dispatch(closeMobileMenu());
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">EventHive</span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events, venues, or categories..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Browse Events
            </Link>
            {user?.role === "organizer" && (
              <>
                <Link to="/create-event" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Create Event
                </Link>

              </>
            )
            }

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.name || 'User'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {user?.role === "user" && (
                    <Link to="/dashboard" className="flex px-4 py-2 text-gray-700 hover:bg-gray-50  items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>My Dashboard</span>
                    </Link>)}
                  {user?.role === "organizer" && (
                    <Link to="/organizer-dashboard" className=" flex px-4 py-2 text-gray-700 hover:bg-gray-50  items-center space-x-2">

                      <Settings className="w-4 h-4" />
                      <span>Organizer Panel</span>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
            <div className="space-y-2">
              <Link to="/events" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
                Browse Events
              </Link>
              {user ? (
                <>
                  {user?.role === "user" && (
                    <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
                      My Dashboard
                    </Link>
                  )
                  }
                  {user?.role === "organizer" && (
                    <>
                      <Link to="/organizer-dashboard" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
                        Organizer Panel
                      </Link>
                      <Link to="/create-event" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
                        Create Event
                      </Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left py-2 text-gray-700 hover:text-primary-600 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="block py-2 text-primary-600 font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;