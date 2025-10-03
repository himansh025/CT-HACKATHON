// Event-App/frontend/src/data/mockEvent.js

export const mockEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "The biggest tech conference of the year featuring industry leaders and cutting-edge innovations.",
    category: "Technology",
    date: "2024-03-15",
    time: "09:00",
    venue: "Convention Center, San Francisco",
    images: ["https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg"], // CHANGED: renamed to 'images' array
    price: 299,
    organizer: {
      name: "TechEvents Inc",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
    },
    tickets: [
      { type: "General", price: 299, available: 150 },
      { type: "VIP", price: 599, available: 50 },
    ],
    rating: 4.8,
    attendees: 1250,
    featured: true
  },
  {
    id: 2,
    title: "Summer Music Festival",
    description: "Three days of amazing music with top artists from around the world.",
    category: "Music",
    date: "2024-07-20",
    time: "18:00",
    venue: "Central Park, New York",
    images: ["https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"], // CHANGED
    price: 125,
    organizer: {
      name: "Music Events Co",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
    },
    tickets: [
      { type: "General", price: 125, available: 500 },
      { type: "VIP", price: 350, available: 100 }
    ],
    rating: 4.9,
    attendees: 2500,
    featured: true
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to investors and industry experts.",
    category: "Business",
    date: "2024-02-28",
    time: "19:00",
    venue: "Innovation Hub, Austin",
    images: ["https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"], // CHANGED
    price: 45,
    organizer: {
      name: "Startup Network",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg"
    },
    tickets: [
      { type: "General", price: 45, available: 200 }
    ],
    rating: 4.6,
    attendees: 180,
    featured: false
  },
  // --- New Dummy Events Start Here ---
  {
    id: 4,
    title: "Future Forward: Leadership Summit",
    description: "A one-day summit focusing on next-generation leadership and strategic innovation in the digital age.",
    category: "Business",
    date: "2024-11-05",
    time: "09:30",
    venue: "The Grand Hall, Chicago",
    images: ["https://images.pexels.com/photos/4500355/pexels-photo-4500355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"], // CHANGED
    price: 450,
    organizer: {
      name: "Global Leaders Forum",
      avatar: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    tickets: [
      { type: "Standard", price: 450, available: 80 },
      { type: "Executive", price: 900, available: 20 }
    ],
    rating: 4.7,
    attendees: 450,
    featured: true
  },
  {
    id: 5,
    title: "Acoustic Night: City Stars",
    description: "An intimate evening of live acoustic performances by emerging local talent under the stars.",
    category: "Music",
    date: "2024-10-12",
    time: "20:00",
    venue: "The Rooftop Lounge, Downtown",
    images: ["https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"], // CHANGED
    price: 75,
    organizer: {
      name: "Local Sounds",
      avatar: "https://images.pexels.com/photos/1036620/pexels-photo-1036620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    tickets: [
      { type: "General Admission", price: 75, available: 100 }
    ],
    rating: 4.5,
    attendees: 90,
    featured: false
  },
  {
    id: 6,
    title: "Local Food & Wine Festival",
    description: "Taste the best local wines and culinary creations from top city chefs and vendors.",
    category: "Food",
    date: "2024-09-28",
    time: "11:00",
    venue: "Riverside Park Grounds",
    images: ["https://images.pexels.com/photos/2088200/pexels-photo-2088200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"], // CHANGED
    price: 50,
    organizer: {
      name: "City Gastronomy",
      avatar: "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    tickets: [
      { type: "General Entry", price: 50, available: 1000 },
      { type: "Tasting Pass", price: 150, available: 300 }
    ],
    rating: 4.9,
    attendees: 950,
    featured: true
  },
  {
    id: 7,
    title: "Marathon of the Golden Gate",
    description: "Join the annual city marathon, featuring a scenic route over the iconic bridge.",
    category: "Sports",
    date: "2025-04-10",
    time: "06:00",
    venue: "Golden Gate Bridge Start Line",
    images: ["https://images.pexels.com/photos/1010373/pexels-photo-1010373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"], // CHANGED
    price: 80,
    organizer: {
      name: "Running Club City",
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    tickets: [
      { type: "Full Marathon", price: 80, available: 2000 },
      { type: "Half Marathon", price: 50, available: 3000 }
    ],
    rating: 4.8,
    attendees: 4800,
    featured: false
  },
  {
    id: 8,
    title: "Digital Art Workshop: NFTs",
    description: "Learn how to create, mint, and sell your digital artwork as non-fungible tokens.",
    category: "Arts",
    date: "2024-11-20",
    time: "14:00",
    venue: "Creative Studios Virtual",
    images: ["https://images.pexels.com/photos/4099419/pexels-photo-4099419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"], // CHANGED
    price: 199,
    organizer: {
      name: "Art & Blockchain Hub",
      avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    tickets: [
      { type: "Virtual Pass", price: 199, available: 500 }
    ],
    rating: 4.4,
    attendees: 320,
    featured: true
  }
];