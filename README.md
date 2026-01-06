# PlayStation Digital System - Frontend

A modern React + TypeScript frontend for the PlayStation Digital System, built with Material UI and Radix UI.

**Location:** This frontend is located at the bench root level (`/frappe-bench/playstation_digital_system_frontend/`) and is separate from the backend apps.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material UI (MUI)** - Component library
- **Radix UI** - Accessible component primitives
- **React Router** - Routing
- **Axios** - HTTP client
- **date-fns** - Date utilities

## Getting Started

### Installation

```bash
cd playstation_digital_system_frontend
npm install
```

**Note:** The frontend is located at the bench root level (`/frappe-bench/playstation_digital_system_frontend/`), separate from the backend apps.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Login/       # Login page component
│   └── ProtectedRoute.tsx
├── contexts/        # React contexts
│   └── AuthContext.tsx
├── pages/           # Page components
│   └── Dashboard.tsx
├── services/        # API services
│   └── api.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## API Integration

The frontend communicates with the Frappe backend through the API service layer (`src/services/api.ts`). All backend endpoints are abstracted into service methods.

### Available API Methods

- `login(usr, pwd)` - User authentication
- `logout()` - User logout
- `createGameSession(game_space_id, game_name)` - Create a new game session
- `terminateGameSession(game_space_id)` - Terminate a game session
- `createCashPayment(data)` - Create cash payment entry
- `createMpesaPayment(data)` - Create M-Pesa payment entry
- `createBankPayment(data)` - Create bank payment entry
- `logCaffeAction(caffe_name, message)` - Log actions
- `getList(doctype, filters, fields)` - Get list of documents
- `getDoc(doctype, name)` - Get a single document

## Features

- ✅ Modern login page with Material UI styling
- ✅ Authentication context and protected routes
- ✅ TypeScript type definitions for all backend models
- ✅ API service layer for Frappe backend integration
- ✅ Responsive design
- ✅ Error handling

## Next Steps

Based on your backend implementation, you can now add:

1. **Game Space Management** - View and manage game spaces
2. **Game Session Management** - Start/stop game sessions
3. **Payment Processing** - Cash, M-Pesa, and Bank payments
4. **Sales Invoice Viewing** - View generated invoices
5. **Dashboard Analytics** - Statistics and reports
6. **Real-time Updates** - WebSocket integration for live updates

## Styling

The app uses Material UI's theming system. The theme is configured in `App.tsx` with a purple gradient color scheme. You can customize colors, typography, and other theme properties there.

## Backend Sync

The frontend is designed to work with the Frappe backend running on `http://localhost:8000` by default. Make sure your Frappe bench is running and accessible.
