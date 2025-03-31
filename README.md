# Travel_Planner

A modern web application that helps users plan their travel experiences, explore destinations, and create detailed trip itineraries.

## Features

- **Destination Exploration**: Browse and search through various travel destinations.
- **Advanced Filtering & Sorting**: Filter destinations by type and sort by popularity, price, or rating.
- **Interactive Itinerary Builder**: Create custom travel itineraries with an intuitive drag-and-drop interface.
- **Trip Management**: Save, view, edit, and delete planned trips.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.

## Technical Stack

### Frontend
- React with TypeScript
- TanStack Query (React Query) for data fetching
- Wouter for routing
- React Beautiful DND for drag-and-drop functionality
- Shadcn UI components
- Tailwind CSS for styling

### Backend
- Node.js with Express
- PostgreSQL database with Drizzle ORM

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage implementation
│   └── vite.ts             # Vite server configuration
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # Database schema and type definitions
```

## Installation

1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your PostgreSQL database configuration if needed.

## Running the Project

Start both the frontend and backend servers:

```
npm run dev
```

This will launch:
- The frontend development server at http://localhost:5000
- The backend API at http://localhost:5000/api

## Future Enhancements

- Weather forecast integration for destinations
- Hotel and flight booking recommendations
- User reviews and ratings for destinations
- Authentication system for personalized experiences
- Social sharing functionality for trips

## License

MIT
