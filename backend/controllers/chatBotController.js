const { GoogleGenerativeAI } = require('@google/generative-ai');
const Event = require('../models/eventModel');
const Booking = require('../models/bookingModel'); // You'll need to create this

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const INTENTS = {
  user: {
    ticket_inquiry: ['ticket', 'booking', 'confirmation', 'seat', 'qr', 'purchase'],
    event_schedule: ['schedule', 'time', 'when', 'date', 'program', 'timing'],
    payment_status: ['payment', 'paid', 'refund', 'transaction', 'receipt', 'money'],
    event_search: ['events', 'find', 'search', 'available', 'upcoming', 'category'],
    venue_info: ['venue', 'location', 'address', 'directions', 'parking', 'where']
  },
  organizer: {
    event_management: ['create', 'event', 'manage', 'edit', 'delete', 'setup'],
    attendee_analytics: ['attendees', 'registered', 'participants', 'sold', 'analytics'],
    ticket_management: ['tickets', 'pricing', 'types', 'quantity', 'discount'],
    platform_help: ['how', 'tutorial', 'guide', 'help', 'instructions']
  }
};

// Intent Classification Function
const classifyIntent = (query, userRole) => {
  console.log(userRole);
  const queryLower = query.toLowerCase();
  const roleIntents = INTENTS[userRole] || INTENTS.user;

  for (const [intent, keywords] of Object.entries(roleIntents)) {
    console.log("intent", intent, "keywords", keywords);

    if (keywords.some(keyword => queryLower.includes(keyword))) {
      return intent;
    }
  }
  return 'general';
};

// Database Query Functions
const getDatabaseContext = async (intent, userId, userRole, query) => {
  let context = {};
  console.log(intent, userId, userRole, query);
  try {
    switch (intent) {
      case 'ticket_inquiry':
        // Get user's bookings
        const bookings = await Booking.find({ userId }).populate('eventId');
        context.bookings = bookings.map(booking => ({
          bookingId: booking._id,
          eventTitle: booking.eventId?.title,
          ticketType: booking.tickets.map(t => t.type),
          quantity: booking.tickets.reduce((sum, q) => sum + q.quantity, 0),
          totalPrice: booking.tickets.reduce((sum, t) => sum + t.price, 0),
          status: booking.status,
          bookingDate: booking.createdAt
        }));
        break;

      case 'event_search':
        // Get upcoming events
        const upcomingEvents = await Event.find({
          date: { $gte: new Date() }
        }).limit(10);
        context.events = upcomingEvents.map(event => ({
          title: event.title,
          date: event.date,
          venue: event.venue,
          price: event.price,
          category: event.category
        }));
        break;

      case 'event_management':
        if (userRole === 'organizer') {
          const userEvents = await Event.find({ 'organizer.organizer_Id': userId });
          context.userEvents = userEvents.map(event => ({
            title: event.title,
            date: event.date,
            attendees: event.attendees,
            ticketsSold: event.tickets.reduce((sum, ticket) => sum + ticket.sold, 0)
          }));
        }
        break;

      case 'attendee_analytics':
        if (userRole === 'organizer') {
          const events = await Event.find({ 'organizer.organizer_Id': userId });
          const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);
          const totalEvents = events.length;
          context.analytics = {
            totalEvents,
            totalAttendees,
            upcomingEvents: events.filter(e => e.date > new Date()).length
          };
        }
        break;
    }
  } catch (error) {
    console.error('Database query error:', error);
    context.error = 'Unable to fetch data at the moment';
  }

  return context;
};

// AI Response Generation
const generateAIResponse = async (query, context, userRole) => {
  const systemPrompts = {
    user: `You are EventX Assistant helping an event attendee. Be friendly and helpful.

ONLY answer questions about:
- Event bookings and tickets
- Event schedules and information
- Payment status and receipts
- Venue locations and directions
- Finding upcoming events

If asked about anything else (weather, politics, general knowledge), respond: 
"I can only help with EventX events and bookings. Ask me about your tickets, upcoming events, or venue information!"

Current user context: ${JSON.stringify(context)}
`,

    organizer: `You are EventX Assistant helping an event organizer. Be professional and informative.

ONLY answer questions about:
- Creating and managing events
- Attendee analytics and management
- Ticket pricing and types
- Platform features and tutorials
- Event promotion tips

If asked about anything else, respond:
"I can only help with EventX event management. Ask me about creating events, managing attendees, or platform features!"

Current organizer context: ${JSON.stringify(context)}
`
  };

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const promptText = `
${systemPrompts[userRole] || systemPrompts.user}
User query: "${query}"
Provide a concise, helpful response based on the context data.
`;

    // Correct structure for Gemini 2.5 Pro
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: promptText
            }
          ]
        }
      ]
    });

    // Access generated text safely
        console.log("result",result?.response?.text());

    const responseText = result?.response?.text() || '';
    console.log(responseText);
    return responseText.trim();

  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm having trouble processing your request right now. Please try again in a moment.";
  }
};



exports.chatBotHandler = async (req, res) => {
  try {
    const { message } = req.body;
    const { user } = req;
    console.log(message, user);

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Classify user intent
    const intent = classifyIntent(message, user.role);
    // console.log("175", intent);

    // Get relevant database context
    const context = await getDatabaseContext(intent, user._id, user.role, message);
    // console.log("181", context);

    // Generate AI response
    const aiResponse = await generateAIResponse(message, context, user.role, intent);

    res.json({
      response: aiResponse,
      intent: intent,
      userRole: user.role
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// Health check
exports.healthCheck = async (req, res) => {
  res.json({ status: 'OK', message: 'EventX Chatbot API is running' });
}

