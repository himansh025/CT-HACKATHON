import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Laptop, 
  Trophy, 
  Briefcase, 
  Palette, 
  Utensils, 
  Heart, 
  Camera,
  Gamepad2,
  GraduationCap
} from 'lucide-react';

const CategoryGrid = () => {
  const categories = [
    { name: 'Music', icon: Music, color: 'from-pink-500 to-rose-500', count: 234 },
    { name: 'Technology', icon: Laptop, color: 'from-blue-500 to-indigo-500', count: 189 },
    { name: 'Sports', icon: Trophy, color: 'from-green-500 to-emerald-500', count: 156 },
    { name: 'Business', icon: Briefcase, color: 'from-gray-600 to-slate-600', count: 267 },
    { name: 'Arts', icon: Palette, color: 'from-purple-500 to-violet-500', count: 98 },
    { name: 'Food', icon: Utensils, color: 'from-orange-500 to-amber-500', count: 145 },
    { name: 'Health', icon: Heart, color: 'from-red-500 to-pink-500', count: 87 },
    { name: 'Photography', icon: Camera, color: 'from-cyan-500 to-blue-500', count: 64 },
    { name: 'Gaming', icon: Gamepad2, color: 'from-indigo-500 to-purple-500', count: 112 },
    { name: 'Education', icon: GraduationCap, color: 'from-teal-500 to-cyan-500', count: 203 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {categories.map((category) => (
        <Link
          key={category.name}
          to={`/events?category=${category.name}`}
          className="group"
        >
          <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <category.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500">{category.count} events</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;