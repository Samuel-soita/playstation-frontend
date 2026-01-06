# Dashboard Requirements Based on Backend

## Overview
The dashboard needs to manage PlayStation gaming sessions, game spaces, payments, and provide real-time monitoring capabilities.

## Core Features Required

### 1. **Game Space Management**
   - **Display all game spaces** in a grid/card layout
   - **Show status** (Occupied/Not Occupied) with visual indicators
   - **Display details:**
     - Game Space ID
     - PlayStation Type (PS3/PS4/PS5) with icons
     - TV Type
     - Current occupancy status
   - **Color coding:**
     - Green = Available (Not Occupied)
     - Red = Occupied
   - **Action buttons:**
     - "Start Session" (only if Not Occupied)
     - "End Session" (only if Occupied)

### 2. **Game Selection**
   - **Display available games** in a grid/card layout
   - **Show game information:**
     - Game name
     - Game image/banner
     - Pricing information:
       - Pricing model (Pay Per Hour, Pay Per 15 Minutes, Pay Per Game Minutes, Custom Pricing)
       - Rate display (game_pricing or rate_per_hour)
       - Custom duration (if applicable)
   - **Filter/Search** games by name
   - **Select game** to start a session

### 3. **Session Management**
   - **Start Session:**
     - Select Game Space
     - Select Game
     - Call `create_game_session(game_space_id, game_name)`
     - Update Game Space status to "Occupied"
     - Display session started confirmation
   
   - **End Session:**
     - Select Game Space with active session
     - Call `terminate_game_session(game_space_id)`
     - Automatically creates Sales Invoice
     - Updates Game Space status to "Not Occupied"
     - Display invoice details

### 4. **Active Sessions Monitor**
   - **Real-time display** of all active sessions
   - **Show session details:**
     - Game Space ID
     - Game Name
     - Started At (timestamp)
     - Duration (live timer showing elapsed time)
     - Created By (user)
   - **Auto-refresh** every few seconds
   - **Quick actions:**
     - End Session button
     - View Details

### 5. **Sales Invoice Management**
   - **Display invoices** generated from terminated sessions
   - **Show invoice details:**
     - Invoice Number
     - Customer (Walkin)
     - Date
     - Amount
     - Status (Paid/Unpaid)
     - Outstanding Amount
   - **Filter by:**
     - Date (today, this week, this month)
     - Status
   - **Actions:**
     - View Invoice Details
     - Process Payment
     - Print/Download

### 6. **Payment Processing**
   - **M-Pesa Integration** (TinyPesa)
   - **Payment flow:**
     - Select invoice
     - Enter phone number
     - Enter amount
     - Initiate STK push via `pay_via_tinypesa(phone, amount, invoice_id)`
     - Show payment status
     - Auto-check transaction status
   - **Payment status tracking:**
     - Pending
     - Processing
     - Completed
     - Failed

### 7. **Analytics & Reports**
   - **Today's Summary:**
     - Total Revenue
     - Total Paid
     - Total Unpaid
     - Number of Sessions
     - Average Session Duration
   - **Charts/Graphs:**
     - Revenue over time
     - Most played games
     - Game space utilization
     - Peak hours
   - **Call API:** `get_todays_invoices_summary(date)`

### 8. **Real-time Updates**
   - **Polling/WebSocket** for:
     - Game Space status changes
     - New sessions started
     - Sessions ended
     - New invoices created
   - **Auto-refresh intervals:**
     - Active sessions: 5-10 seconds
     - Game spaces: 10-15 seconds
     - Invoices: 30 seconds

## API Endpoints to Integrate

### Game Session APIs
```typescript
// Create a new game session
POST /api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.game_session.game_session.create_game_session
Body: { game_space_id: string, game_name: string }
Returns: { game_session_name, game_space, game_played, session_started_at }

// Terminate a game session
POST /api/method/playstation_digital_system.frappe_playstation_digital_system.doctype.game_session.game_session.terminate_game_session
Body: { game_space_id: string }
Returns: sales_invoice_name
```

### Data Retrieval APIs (to be created or use Frappe standard)
```typescript
// Get all game spaces
GET /api/resource/Game Space

// Get all games
GET /api/resource/Games

// Get active game sessions
GET /api/resource/Game Session?filters=[["docstatus","=",0]]

// Get today's invoices
GET /api/method/playstation_digital_system.apis.reports_api.get_todays_invoices_summary
```

### Payment API
```typescript
// Initiate M-Pesa payment
POST /api/method/playstation_digital_system.apis.mpesa_payments.pay_via_tinypesa
Body: { phone: string, amount: number, invoice_id: string }
```

## UI Components Needed

1. **Game Space Grid** - Card-based layout showing all spaces
2. **Game Selection Modal/Dialog** - Grid of games with images
3. **Active Sessions List** - Table/cards with live timers
4. **Invoice List/Table** - Data table with filters
5. **Payment Dialog** - Form for M-Pesa payment
6. **Analytics Dashboard** - Cards with metrics and charts
7. **Session Timer Component** - Real-time duration display
8. **Status Badge Component** - Occupied/Available indicators

## State Management

- **Game Spaces** - List with status
- **Games** - List with pricing info
- **Active Sessions** - List with timers
- **Invoices** - List with filters
- **Selected Game Space** - Current selection
- **Selected Game** - Current selection
- **Payment Status** - Current payment state

## Key User Flows

### Flow 1: Start a Session
1. User clicks on an available Game Space
2. Game selection dialog opens
3. User selects a game
4. Session starts, Game Space status updates
5. Active session appears in monitor

### Flow 2: End a Session
1. User clicks "End Session" on active session or game space
2. Confirmation dialog
3. Session terminates, invoice created
4. Game Space status updates to "Not Occupied"
5. Invoice appears in invoice list

### Flow 3: Process Payment
1. User views invoice list
2. Clicks "Pay" on unpaid invoice
3. Payment dialog opens
4. Enters phone number
5. Initiates M-Pesa STK push
6. Payment status updates

## Technical Considerations

- **Real-time Updates:** Use polling (setInterval) or WebSockets if available
- **Session Timers:** Calculate elapsed time client-side based on `session_started_at`
- **Error Handling:** Handle API errors gracefully
- **Loading States:** Show loading indicators during API calls
- **Optimistic Updates:** Update UI immediately, sync with backend
- **Responsive Design:** Mobile-friendly layout
- **Theme Support:** Dark/Light mode (already implemented)
