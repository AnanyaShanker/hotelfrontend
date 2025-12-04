# 🏨 COMPLETE FRONTEND DEVELOPMENT PROMPT - HOTEL MANAGEMENT SYSTEM

## 📋 PROJECT OVERVIEW

Build a **comprehensive, production-ready React frontend** for a Hotel Management System with role-based access control, real-time activity tracking, payment processing, booking management, and advanced reporting capabilities.

---

## 🎯 SYSTEM REQUIREMENTS

### Tech Stack
- **Frontend Framework**: React 18+ with functional components and hooks
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API + useState/useReducer
- **Styling**: Tailwind CSS with custom components
- **Forms**: React Hook Form with validation
- **Date Handling**: date-fns or dayjs
- **Notifications**: React Toastify
- **Icons**: React Icons or Lucide React
- **PDF Generation**: jspdf or react-pdf (for viewing receipts)
- **Charts**: Recharts or Chart.js (for reports/analytics)

### Backend API Base URL
```javascript
http://localhost:9193
```

### Authentication
- **JWT Token-based** authentication
- Token stored in `localStorage`
- Auto-refresh on 401 errors
- Role-based access control (Super Admin, Manager, Staff, Customer)

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### 1. Auth Endpoints

#### Login
```
POST /api/auth/login
Request Body: { email, password }
Response: { token, userId, roleId }
```

#### Signup/Register
```
POST /api/users
Content-Type: multipart/form-data
Fields:
  - name (string, required)
  - email (string, required)
  - password (string, required)
  - phone (string, required)
  - securityQuestion (string, required)
  - securityAnswer (string, required)
  - profileImage (file, optional)
  - idDocument (file, optional)
  - roleId (number, default: 2 for customer)
Response: ApiResponseDTO<UserDTO>
```

#### Forgot Password - Step 1
```
POST /api/auth/forgot-password
Request Body: { email }
Response: { securityQuestion }
```

#### Reset Password - Step 2
```
POST /api/auth/reset-password
Request Body: { email, securityAnswer, newPassword }
Response: Success/Error message
```

### 2. Auth Pages to Build

1. **Login Page** (`/login`)
   - Email and password fields
   - "Forgot Password?" link
   - "Sign Up" link
   - Remember me checkbox (optional)
   - Show loading state during authentication
   - Display error messages for invalid credentials
   - Redirect to dashboard based on role after login

2. **Signup Page** (`/signup`)
   - Multi-step form or single page with validation
   - Fields: name, email, password, phone, security question, security answer
   - File upload for profile image and ID document
   - Role selector (if admin is creating user)
   - Password strength indicator
   - Duplicate email error handling
   - Redirect to login after successful signup

3. **Forgot Password Flow** (`/forgot-password` and `/reset-password`)
   - Step 1: Enter email → fetch security question
   - Step 2: Answer security question + enter new password
   - Validation and error handling
   - Success message and redirect to login

### 3. Protected Routes & Role-Based Access

```javascript
// Route Protection Example
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();
  
  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.roleId)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

// Role IDs (based on your database)
const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 1,
  MANAGER: 2, // or different based on your setup
  STAFF: 3,
  CUSTOMER: 2 // default for regular users
};
```

---

## 👤 USER MANAGEMENT MODULE

### Endpoints

```
GET    /api/users                    - Get all users (admin)
GET    /api/users/{id}               - Get user by ID
POST   /api/users                    - Create user (multipart/form-data)
PUT    /api/users/{id}               - Update user (multipart/form-data)
PATCH  /api/users/{id}/toggle-status - Activate/Deactivate user
DELETE /api/users/{id}               - Delete user
```

### Pages to Build

1. **User List Page** (`/admin/users`)
   - Table with columns: ID, Name, Email, Phone, Role, Status, Actions
   - Search and filter by name, email, role, status
   - Pagination
   - Actions: View, Edit, Toggle Status, Delete
   - "Add New User" button

2. **User Details Page** (`/admin/users/{id}`)
   - Display all user information
   - Show profile image and ID document
   - Display activity history
   - Show bookings made by this user

3. **Create/Edit User Page** (`/admin/users/create` and `/admin/users/{id}/edit`)
   - Form with all user fields
   - File upload for profile image and ID document
   - Role assignment
   - Validation
   - Success/error notifications

4. **User Profile Page** (`/profile`)
   - Current user can view/edit their own profile
   - Change password option
   - View booking history
   - Update profile image

---

## 🏨 BRANCH MANAGEMENT MODULE

### Endpoints

```
GET    /api/branches           - Get all branches
GET    /api/branches/{id}      - Get branch by ID
GET    /api/branches/search?location={location} - Search by location
POST   /api/branches           - Create branch
PUT    /api/branches/{id}      - Update branch
PATCH  /api/branches/{id}/toggle-status - Toggle branch status
```

### Branch DTO Structure
```javascript
{
  branchId: number,
  branchName: string,
  location: string,
  contactNumber: string,
  email: string,
  address: string,
  status: 'active' | 'inactive',
  createdAt: string,
  updatedAt: string
}
```

### Pages to Build

1. **Branch List Page** (`/admin/branches`)
   - Display all branches in cards or table
   - Filter by location and status
   - Actions: View, Edit, Toggle Status

2. **Branch Details Page** (`/admin/branches/{id}`)
   - Branch information
   - List of rooms in this branch
   - Bookings for this branch

3. **Create/Edit Branch Page** (`/admin/branches/create` and `/admin/branches/{id}/edit`)
   - Form for branch details
   - Validation

---

## 🛏️ ROOM MANAGEMENT MODULE

### Endpoints

```
GET    /api/rooms                         - Get all rooms
GET    /api/rooms/{roomId}                - Get room by ID
GET    /api/rooms/branch/{branchId}       - Get rooms by branch
GET    /api/rooms/type/{typeId}           - Get rooms by type
GET    /api/rooms/available?branchId={}&typeId={} - Get available rooms
GET    /api/rooms/available/all           - Get all available rooms
POST   /api/rooms                         - Create room
PUT    /api/rooms/{roomId}                - Update room
DELETE /api/rooms/{roomId}                - Soft delete room
PATCH  /api/rooms/{roomId}/status         - Update room status
```

### Room DTO Structure
```javascript
{
  roomId: number,
  branchId: number,
  typeId: number,
  roomNumber: string,
  pricePerNight: number,
  capacity: number,
  status: 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'MAINTENANCE',
  roomPrimaryImage: string,
  description: string,
  floorNumber: number,
  lastCleaned: string,
  createdAt: string,
  updatedAt: string
}
```

### Room Type Endpoints

```
GET    /api/roomtypes     - Get all room types
GET    /api/roomtypes/{id} - Get room type by ID
POST   /api/roomtypes     - Create room type
PUT    /api/roomtypes/{id} - Update room type
```

### Pages to Build

1. **Room List Page** (`/admin/rooms`)
   - Grid/Table view of all rooms
   - Filter by branch, type, status, price range
   - Room status badges (Available, Reserved, Occupied, Maintenance)
   - Actions: View, Edit, Delete, Change Status

2. **Room Details Page** (`/rooms/{id}`)
   - Room images (primary + gallery if applicable)
   - Room type, capacity, price per night
   - Amenities/facilities
   - Availability calendar
   - "Book Now" button (for customers)

3. **Create/Edit Room Page** (`/admin/rooms/create` and `/admin/rooms/{id}/edit`)
   - Form with room details
   - Branch and room type selection
   - Image upload
   - Price and capacity inputs
   - Room number assignment

4. **Customer Room Search & Booking Page** (`/rooms` or `/book-room`)
   - Search filters: Branch, Room Type, Check-in/out dates, Price range, Capacity
   - Display available rooms in cards
   - "Book Now" button on each room
   - Redirect to booking form

---

## 📅 BOOKING MANAGEMENT MODULE

### Booking Endpoints

```
POST   /api/bookings?branchId={}&typeId={} - Create booking
GET    /api/bookings                       - Get all bookings (admin)
GET    /api/bookings/{bookingId}           - Get booking by ID
GET    /api/bookings/{bookingId}/details   - Get booking details with joins
GET    /api/bookings/branch/{branchId}     - Get bookings by branch
GET    /api/bookings/customer/{customerId} - Get bookings by customer
PATCH  /api/bookings/{bookingId}/cancel    - Cancel booking
PATCH  /api/bookings/{bookingId}/complete  - Complete booking
PATCH  /api/bookings/{bookingId}/payment-status - Update payment status
```

### Booking DTO Structure
```javascript
{
  bookingId: number,
  customerId: number,
  roomId: number,
  branchId: number,
  checkInDate: string, // ISO datetime
  checkOutDate: string, // ISO datetime
  totalPrice: number,
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED',
  bookingStatus: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  notes: string,
  createdAt: string,
  updatedAt: string
}
```

### BookingDetailsDTO (with joins)
```javascript
{
  bookingId: number,
  customerId: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  roomId: number,
  roomNumber: string,
  roomType: string,
  branchId: number,
  branchName: string,
  checkInDate: string,
  checkOutDate: string,
  totalPrice: number,
  paymentStatus: string,
  bookingStatus: string,
  notes: string,
  createdAt: string,
  updatedAt: string
}
```

### Pages to Build

1. **Customer Booking Form** (`/book-room` or `/rooms/{roomId}/book`)
   - Room details display
   - Date range picker (check-in, check-out)
   - Guest details form (if not logged in, require login)
   - Calculate total price dynamically
   - Special requests/notes textarea
   - "Proceed to Payment" button
   - Validation: Check-out must be after check-in

2. **My Bookings Page** (`/my-bookings` - Customer view)
   - List all bookings for logged-in customer
   - Filter by status (All, Confirmed, Cancelled, Completed)
   - Display booking details
   - Actions: View Details, Cancel (if not already cancelled/completed), Pay Now (if pending)

3. **Bookings Management** (`/admin/bookings` - Admin/Manager view)
   - Table of all bookings
   - Filter by customer, room, branch, status, payment status, date range
   - Actions: View Details, Cancel, Complete, Update Payment Status

4. **Booking Details Page** (`/bookings/{id}`)
   - Full booking information with customer and room details
   - Payment information
   - Activity log for this booking
   - Actions based on role and status

---

## 🏊 FACILITY MANAGEMENT MODULE

### Facility Endpoints

```
GET    /facilities/all              - Get all facilities (with media)
GET    /facilities/{id}             - Get facility by ID (with media)
POST   /facilities                  - Create facility
PUT    /facilities/{id}             - Update facility
DELETE /facilities/{id}             - Delete facility
POST   /facilities/{id}/primary-image    - Upload primary image
POST   /facilities/{id}/brochure         - Upload brochure
POST   /facilities/{id}/gallery          - Upload single gallery image
POST   /facilities/{id}/gallery/multiple - Upload multiple gallery images
GET    /facilities/{id}/gallery          - Get facility gallery
```

### Facility DTO Structure
```javascript
{
  facilityId: number,
  facilityName: string,
  description: string,
  location: string,
  capacity: number,
  pricePerHour: number,
  operatingHours: string,
  status: 'AVAILABLE' | 'MAINTENANCE' | 'BOOKED',
  primaryImage: string,
  brochure: string,
  galleryImages: Array<{mediaId, filePath, fileType, uploadedAt}>
}
```

### Facility Booking Endpoints

```
POST   /facility-bookings                      - Create facility booking
GET    /facility-bookings/{id}                 - Get booking by ID
GET    /facility-bookings/{id}/details         - Get full booking details (with joins)
GET    /facility-bookings/facility/{facilityId}?date={date} - Get bookings for facility on date
GET    /facility-bookings/customer/{customerId} - Get bookings by customer
POST   /facility-bookings/{id}/cancel          - Cancel booking
PATCH  /facility-bookings/{id}/payment-status  - Update payment status
```

### Facility Booking DTO Structure
```javascript
{
  bookingId: number,
  facilityId: number,
  customerId: number,
  bookingDate: string, // date
  startTime: string, // time
  endTime: string, // time
  totalHours: number,
  totalPrice: number,
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED',
  bookingStatus: 'CONFIRMED' | 'CANCELLED',
  notes: string,
  createdAt: string,
  updatedAt: string
}
```

### Pages to Build

1. **Facility List Page** (`/facilities`)
   - Grid view of facilities with images
   - Filter by capacity, price, status
   - "Book Now" button for customers
   - Admin can add/edit/delete

2. **Facility Details Page** (`/facilities/{id}`)
   - Image gallery slider
   - Facility information
   - Availability calendar/time slots
   - "Book Now" button
   - Download brochure option

3. **Facility Booking Form** (`/facilities/{id}/book`)
   - Date picker
   - Time slot selection (based on operating hours)
   - Calculate total price (hours × pricePerHour)
   - Guest details
   - "Proceed to Payment" button

4. **My Facility Bookings** (`/my-facility-bookings`)
   - List customer's facility bookings
   - Filter by status
   - Actions: View Details, Cancel, Pay

5. **Facility Management** (`/admin/facilities`)
   - CRUD operations for facilities
   - Upload images and brochures
   - View all facility bookings

---

## 💳 PAYMENT MODULE

### Payment Endpoints

```
POST   /api/payments/process                    - Process payment
GET    /api/payments/customer/{customerId}      - Get payments by customer
GET    /api/payments/all                        - Get all payments (admin)
GET    /api/payments/booking/{bookingId}        - Get payment by booking ID
GET    /api/payments/facility-booking/{facilityBookingId} - Get payment by facility booking ID
GET    /api/payments/{paymentId}                - Get payment by ID
PUT    /api/payments/{paymentId}/status?status={status} - Update payment status
```

### Payment Request DTO
```javascript
{
  bookingId: number | null,         // For room bookings
  facilityBookingId: number | null, // For facility bookings
  customerId: number,
  amountPaid: number,
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'PAYPAL' | 'STRIPE' | 'BANK_TRANSFER' | 'CASH' | 'OTHER',
  notes: string
}
```

### Payment Response DTO
```javascript
{
  paymentId: number,
  bookingId: number,
  facilityBookingId: number,
  customerId: number,
  paymentMethod: string,
  amountPaid: number,
  paymentDate: string,
  transactionId: string,
  status: 'SUCCESS' | 'PENDING' | 'FAILED',
  paymentReceipt: string, // PDF path
  notes: string
}
```

### Pages to Build

1. **Payment Processing Page** (`/payment`)
   - Triggered after clicking "Pay Now" from booking
   - Display booking summary (room/facility, dates, price)
   - Payment method selection
   - Card/UPI/Other payment form (can be mock for now, or integrate real gateway)
   - "Process Payment" button
   - Loading state during processing
   - On success: Display transaction ID, download receipt, redirect to success page
   - On failure: Show error, allow retry

2. **Payment Success Page** (`/payment/success`)
   - Success message
   - Transaction details
   - Download receipt (PDF)
   - Email confirmation sent message
   - "Go to My Bookings" button

3. **Payment History** (`/my-payments`)
   - List all payments for logged-in customer
   - Filter by date, status, type (room/facility)
   - Download receipts

4. **Admin Payment Management** (`/admin/payments`)
   - View all payments
   - Filter by customer, booking, status, date range
   - Update payment status manually if needed

### Payment Flow Integration

**Important**: When a booking is created, payment status is `PENDING`. After payment is processed:

1. **Room Booking Payment Flow**:
   ```
   User fills booking form → POST /api/bookings (creates booking with PENDING payment)
   → User redirected to payment page
   → User processes payment → POST /api/payments/process
   → Backend updates booking payment_status to PAID
   → Backend sends email notification with booking confirmation + payment receipt
   → Room status changes to RESERVED
   → User sees success page
   ```

2. **Facility Booking Payment Flow**:
   ```
   User fills facility booking form → POST /facility-bookings (creates booking with PENDING payment)
   → User redirected to payment page
   → User processes payment → POST /api/payments/process
   → Backend updates facility booking payment_status to PAID
   → Backend sends email notification with booking confirmation + payment receipt
   → User sees success page
   ```

---

## 📧 NOTIFICATION MODULE

### Endpoints

```
POST   /api/notifications/event  - Create event notification
DELETE /api/notifications/{id}   - Soft delete notification
```

### How Notifications Work

**Backend automatically sends email notifications for:**
- Booking confirmation (when booking created)
- Payment confirmation (when payment successful) - includes PDF receipt
- Booking cancellation
- Facility booking confirmation
- Facility payment confirmation

**Frontend Responsibilities:**
- Display success messages after actions
- Show notification toasts
- (Optional) Build an in-app notification center to view past notifications

### Pages to Build (Optional but Recommended)

1. **Notification Center** (`/notifications`)
   - List all notifications for user
   - Mark as read
   - Delete notifications

---

## 🎫 FEEDBACK MODULE

### Endpoints

```
GET    /api/feedback                          - Get all feedback (admin)
GET    /api/feedback/{id}                     - Get feedback by ID
GET    /api/feedback/customer/{customerId}    - Get feedback by customer
GET    /api/feedback/booking/{bookingId}      - Get feedback by booking
GET    /api/feedback/facility/{facilityBookingId} - Get feedback by facility booking
POST   /api/feedback                          - Create feedback
PUT    /api/feedback/{id}                     - Update feedback
DELETE /api/feedback/{id}                     - Delete feedback
```

### Feedback DTO Structure
```javascript
{
  feedbackId: number,
  customerId: number,
  bookingId: number | null,
  facilityBookingId: number | null,
  rating: number, // 1-5
  comments: string,
  submissionDate: string,
  createdAt: string,
  updatedAt: string
}
```

### Pages to Build

1. **Submit Feedback Page** (`/bookings/{id}/feedback` or `/facility-bookings/{id}/feedback`)
   - Display booking details
   - Rating (1-5 stars)
   - Comments textarea
   - Submit button
   - Only available after booking is COMPLETED

2. **My Feedback** (`/my-feedback`)
   - List all feedback submitted by customer
   - Edit/Delete options

3. **Admin Feedback Management** (`/admin/feedback`)
   - View all feedback
   - Filter by rating, customer, date
   - Analytics: Average rating, sentiment analysis

---

## 📊 REPORTS & ANALYTICS MODULE

### Endpoints

```
GET /api/reports/occupancy?startDate={}&endDate={}&branchId={} - Room occupancy report
GET /api/reports/revenue-by-type?startDate={}&endDate={}&branchId={} - Revenue by room type
GET /api/reports/booking-sources?startDate={}&endDate={} - Booking sources
GET /api/reports/feedback-summary?startDate={}&endDate={}&branchId={} - Feedback summary
GET /api/reports/housekeeping-efficiency?startDate={}&endDate={}&branchId={} - Housekeeping report
GET /api/reports/revenue?startDate={}&endDate={}&branchId={} - Overall revenue
GET /api/reports/booking-trends?startDate={}&endDate={} - Booking trends
```

### Report DTO Structures

**OccupancyReportDTO**:
```javascript
{
  totalRooms: number,
  occupiedRooms: number,
  availableRooms: number,
  occupancyRate: number, // percentage
  totalRevenue: number,
  averageRevenuePerRoom: number
}
```

**RevenueByTypeDTO**:
```javascript
{
  roomType: string,
  totalBookings: number,
  totalRevenue: number,
  averagePrice: number
}
```

**FeedbackSummaryDTO**:
```javascript
{
  totalFeedback: number,
  averageRating: number,
  ratingDistribution: { 1: count, 2: count, 3: count, 4: count, 5: count }
}
```

### Pages to Build

1. **Reports Dashboard** (`/admin/reports`)
   - Date range selector
   - Branch filter
   - Cards displaying key metrics: Total Revenue, Occupancy Rate, Total Bookings, Average Rating
   - Charts:
     - Revenue trend line chart
     - Occupancy rate bar chart
     - Room type revenue pie chart
     - Booking trends over time
   - Quick links to detailed reports

2. **Occupancy Report** (`/admin/reports/occupancy`)
   - Detailed occupancy statistics
   - Filter by branch and date range
   - Export to PDF/Excel

3. **Revenue Report** (`/admin/reports/revenue`)
   - Revenue breakdown by room type, branch, date
   - Charts and graphs
   - Export functionality

4. **Feedback Report** (`/admin/reports/feedback`)
   - Average rating
   - Rating distribution chart
   - Recent feedback list
   - Filter options

---

## 📝 ACTIVITY LOG MODULE (CCTV-like System Tracking)

### Endpoints

```
GET /api/activity-logs            - Get all activity logs (admin)
GET /api/activity-logs/all        - Alias for all logs
GET /api/activity-logs/recent?limit={} - Get recent logs
GET /api/activity-logs/user/{userId} - Get logs by user
GET /api/activity-logs/my-activity - Get logs for current user
GET /api/activity-logs/entity?entityType={}&entityId={} - Get logs by entity
GET /api/activity-logs/date-range?startDate={}&endDate={} - Get logs by date range
```

### Activity Log DTO Structure (with user join)
```javascript
{
  logId: number,
  userId: number,
  userName: string,
  userEmail: string,
  action: string, // e.g., "USER_LOGIN", "BOOKING_CREATED", "PAYMENT_MADE"
  entityType: string, // e.g., "booking", "user", "payment", "facility_booking"
  entityId: number,
  description: string, // e.g., "User John Doe logged in"
  ipAddress: string,
  deviceInfo: string,
  createdAt: string
}
```

### What Gets Logged (Backend automatically logs these):
- User login/logout
- User registration
- Booking creation/cancellation/completion
- Facility booking creation/cancellation
- Payment processing (success/failure)
- Room status changes
- User profile updates
- Admin actions (user status toggle, deletions, etc.)

### Pages to Build

1. **Activity Log Viewer** (`/admin/activity-logs`)
   - **For Admins Only**
   - Table with columns: Timestamp, User, Action, Entity Type, Entity ID, Description, IP Address, Device Info
   - Real-time or auto-refresh (optional)
   - Advanced filters:
     - User
     - Action type
     - Entity type
     - Date range
     - IP address
   - Search functionality
   - Pagination
   - Export to CSV/Excel
   - Color-coded actions (e.g., red for deletions, green for creations, blue for updates)

2. **My Activity Page** (`/my-activity` - Customer view)
   - Shows only current user's activity
   - Simplified view

3. **Entity Activity Timeline** (Integrated in detail pages)
   - When viewing a booking detail, show activity log related to that booking
   - When viewing a user detail, show activity log for that user

---

## 🏨 ADDITIONAL MODULES

### 1. STAFF MANAGEMENT

```
GET    /api/staff                  - Get all staff
GET    /api/staff/{staffId}        - Get staff by ID
GET    /api/staff/user/{userId}    - Get staff by user ID
POST   /api/staff                  - Create staff
POST   /api/staff/{userId}/assign  - Assign staff to hotel
PUT    /api/staff/{staffId}/hotel  - Update staff hotel assignment
PATCH  /api/staff/{staffId}/status - Update staff status
```

**Pages**: Staff list, create/edit staff, assign to branches

### 2. STAFF TASKS (Housekeeping)

```
GET    /api/tasks                     - Get all tasks
GET    /api/tasks/{taskId}            - Get task by ID
GET    /api/tasks/room/{roomId}       - Get tasks by room
GET    /api/tasks/staff/{staffId}     - Get tasks assigned to staff
POST   /api/tasks                     - Create task
PUT    /api/tasks/{taskId}            - Update task
PATCH  /api/tasks/{taskId}/status     - Update task status
DELETE /api/tasks/{taskId}            - Delete task
```

**Pages**: Task management for housekeeping, assign cleaning tasks, track completion

### 3. SUPPORT TICKETS

```
GET    /api/support/tickets              - Get all tickets
GET    /api/support/tickets/{id}         - Get ticket by ID
GET    /api/support/tickets/customer/{customerId} - Get tickets by customer
POST   /api/support/tickets              - Create ticket
PUT    /api/support/tickets/{id}         - Update ticket
PATCH  /api/support/tickets/{id}/status  - Update ticket status
DELETE /api/support/tickets/{id}         - Delete ticket
```

**Pages**: Customer support system, submit tickets, track ticket status

### 4. ROLES & PERMISSIONS

```
GET    /api/roles     - Get all roles
GET    /api/roles/{id} - Get role by ID
POST   /api/roles     - Create role
PUT    /api/roles/{id} - Update role
DELETE /api/roles/{id} - Delete role

GET    /api/permissions     - Get all permissions
GET    /api/permissions/{id} - Get permission by ID
POST   /api/permissions     - Create permission
PUT    /api/permissions/{id} - Update permission
DELETE /api/permissions/{id} - Delete permission
```

**Pages**: Admin role management, permission assignment

---

## 🎨 UI/UX REQUIREMENTS

### Design Guidelines

1. **Responsive Design**: Mobile-first approach, works on all screen sizes
2. **Color Scheme**: Professional hotel theme (blues, golds, whites)
3. **Typography**: Clean, readable fonts (e.g., Inter, Poppins)
4. **Navigation**: 
   - Top navbar with logo, menu items, user profile dropdown
   - Sidebar for admin/manager dashboards
   - Breadcrumbs for navigation tracking
5. **Loading States**: Spinners, skeletons for better UX
6. **Error Handling**: Toast notifications, inline error messages
7. **Form Validation**: Real-time validation with clear error messages
8. **Accessibility**: ARIA labels, keyboard navigation, color contrast

### Components to Build

#### Reusable Components
1. **Navbar**: Logo, menu items, user dropdown (logout, profile)
2. **Sidebar**: Admin/Manager navigation menu
3. **Card**: Generic card component for displaying data
4. **Table**: Data table with sorting, filtering, pagination
5. **Modal**: Reusable modal for confirmations, forms
6. **Button**: Primary, secondary, danger, disabled states
7. **Input**: Text, email, password, number, file upload
8. **Select**: Dropdown with search
9. **DatePicker**: Date and date range picker
10. **Loading**: Spinner, skeleton loader
11. **Badge**: Status badges (available, pending, success, failed, etc.)
12. **Toast**: Notification toasts
13. **Breadcrumb**: Navigation breadcrumb
14. **Tabs**: Tab component for switching views
15. **Pagination**: Page navigation component
16. **ImageUpload**: Drag-and-drop or click to upload images
17. **Rating**: Star rating component

#### Page Layouts
1. **AuthLayout**: For login, signup, forgot password pages
2. **DashboardLayout**: With sidebar and navbar for admin/manager
3. **CustomerLayout**: With top navbar for customers
4. **PublicLayout**: For homepage, facilities, rooms (guest view)

---

## 🔗 ROUTING STRUCTURE

```
/                           - Homepage (welcome, search rooms/facilities)
/login                      - Login page
/signup                     - Signup page
/forgot-password            - Forgot password
/reset-password             - Reset password

/profile                    - User profile
/my-bookings                - Customer's room bookings
/my-facility-bookings       - Customer's facility bookings
/my-payments                - Customer's payment history
/my-feedback                - Customer's feedback
/my-activity                - Customer's activity log
/notifications              - User notifications

/rooms                      - Browse rooms (public/customer)
/rooms/{id}                 - Room details
/book-room                  - Book room form
/bookings/{id}              - Booking details

/facilities                 - Browse facilities
/facilities/{id}            - Facility details
/facilities/{id}/book       - Book facility
/facility-bookings/{id}     - Facility booking details

/payment                    - Payment processing page
/payment/success            - Payment success page
/payment/failed             - Payment failed page

/admin/dashboard            - Admin dashboard
/admin/users                - User management
/admin/users/create         - Create user
/admin/users/{id}           - User details
/admin/users/{id}/edit      - Edit user

/admin/branches             - Branch management
/admin/branches/create      - Create branch
/admin/branches/{id}        - Branch details
/admin/branches/{id}/edit   - Edit branch

/admin/rooms                - Room management
/admin/rooms/create         - Create room
/admin/rooms/{id}/edit      - Edit room

/admin/roomtypes            - Room type management
/admin/facilities           - Facility management
/admin/facilities/create    - Create facility
/admin/facilities/{id}/edit - Edit facility

/admin/bookings             - All bookings (admin view)
/admin/facility-bookings    - All facility bookings
/admin/payments             - All payments
/admin/feedback             - All feedback

/admin/staff                - Staff management
/admin/tasks                - Task/housekeeping management
/admin/support              - Support tickets
/admin/roles                - Role management

/admin/reports              - Reports dashboard
/admin/reports/occupancy    - Occupancy report
/admin/reports/revenue      - Revenue report
/admin/reports/feedback     - Feedback report

/admin/activity-logs        - Activity log viewer (CCTV)

/unauthorized               - Unauthorized access page
/404                        - Not found page
```

---

## 🛠️ AXIOS CONFIGURATION

### Setup Axios Instance with Interceptors

```javascript
// src/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9193',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle 401 errors (token expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 📦 API SERVICE LAYER

Create a service layer for each module to handle API calls.

### Example: UserService.js

```javascript
// src/services/UserService.js
import axios from '../api/axiosConfig';

export const UserService = {
  getAllUsers: () => axios.get('/api/users'),
  getUserById: (id) => axios.get(`/api/users/${id}`),
  createUser: (formData) => axios.post('/api/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateUser: (id, formData) => axios.put(`/api/users/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  toggleUserStatus: (id) => axios.patch(`/api/users/${id}/toggle-status`),
  deleteUser: (id) => axios.delete(`/api/users/${id}`),
};
```

### Create Similar Services For:
- AuthService (login, signup, forgot password, reset password)
- BookingService (create, get, cancel, complete bookings)
- RoomService (get rooms, create, update, delete, change status)
- FacilityService (CRUD operations, upload images)
- FacilityBookingService (create, get, cancel facility bookings)
- PaymentService (process payment, get payments)
- FeedbackService (submit, get feedback)
- ReportService (get all reports)
- ActivityLogService (get activity logs)
- BranchService, StaffService, TaskService, etc.

---

## 🔒 AUTHENTICATION CONTEXT

### Create Auth Context for managing authentication state

```javascript
// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (token, userId, roleId) => {
    localStorage.setItem('token', token);
    const userData = { userId, roleId };
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = () => user && user.roleId === 1;
  const isCustomer = () => user && user.roleId === 2;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isCustomer, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
```

---

## 🎯 KEY FEATURES TO IMPLEMENT

### 1. Real-time Updates (Optional but Recommended)
- Use WebSockets or polling to show real-time booking updates
- Live room availability updates

### 2. Search & Filters
- Advanced search with multiple filters (price, capacity, date, location)
- Autocomplete for search inputs
- Save search preferences

### 3. Image Management
- Image preview before upload
- Drag-and-drop upload
- Image gallery sliders
- Lazy loading for images

### 4. Date Handling
- Disable past dates in date pickers
- Validate check-out is after check-in
- Display dates in user-friendly format
- Support for different timezones

### 5. Payment Integration
- Mock payment flow for now
- Structure code to easily integrate real payment gateways (Stripe, PayPal, Razorpay)
- Display payment confirmations
- Download PDF receipts

### 6. PDF Generation
- Receipt generation after payment
- Booking confirmation PDFs
- Export reports to PDF

### 7. Email Notifications
- Backend handles email sending
- Frontend shows "Email sent" confirmation messages

### 8. Error Handling
- Global error boundary
- API error handling with user-friendly messages
- Retry logic for failed requests
- Validation errors on forms

### 9. Loading & Empty States
- Skeleton loaders for content
- Spinners for actions
- Empty state illustrations and messages

### 10. Accessibility
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

---

## 📱 DASHBOARD VIEWS

### Customer Dashboard (`/dashboard` or `/`)
- Welcome message with user name
- Quick links: Book Room, Book Facility, My Bookings, My Payments
- Upcoming bookings widget
- Recent activity
- Notifications

### Admin Dashboard (`/admin/dashboard`)
- Key metrics cards: Total Bookings, Total Revenue, Occupancy Rate, Active Users
- Charts: Revenue trend, Bookings over time, Room type distribution
- Recent bookings table
- Quick actions: Add Room, Add Facility, View Reports
- Activity log summary

### Manager Dashboard (if different from admin)
- Branch-specific metrics
- Manage staff and tasks
- View bookings for their branch

---

## 🧪 TESTING REQUIREMENTS

1. **Unit Tests**: Test individual components with Jest and React Testing Library
2. **Integration Tests**: Test API calls with mocked responses
3. **E2E Tests**: Use Cypress or Playwright for end-to-end testing (optional)
4. **Manual Testing**: Test all user flows thoroughly

---

## 📦 PROJECT STRUCTURE

```
hotel-management-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── api/
│   │   └── axiosConfig.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   └── Rating.jsx
│   │   ├── layout/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── CustomerLayout.jsx
│   │   │   └── PublicLayout.jsx
│   │   └── [feature-specific components]
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── customer/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── MyFacilityBookings.jsx
│   │   │   ├── MyPayments.jsx
│   │   │   ├── MyFeedback.jsx
│   │   │   └── MyActivity.jsx
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── users/
│   │   │   ├── branches/
│   │   │   ├── rooms/
│   │   │   ├── facilities/
│   │   │   ├── bookings/
│   │   │   ├── payments/
│   │   │   ├── feedback/
│   │   │   ├── staff/
│   │   │   ├── tasks/
│   │   │   ├── reports/
│   │   │   └── activityLogs/
│   │   ├── rooms/
│   │   │   ├── RoomList.jsx
│   │   │   ├── RoomDetails.jsx
│   │   │   └── BookRoom.jsx
│   │   ├── facilities/
│   │   │   ├── FacilityList.jsx
│   │   │   ├── FacilityDetails.jsx
│   │   │   └── BookFacility.jsx
│   │   ├── bookings/
│   │   │   └── BookingDetails.jsx
│   │   ├── payment/
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   └── PaymentFailed.jsx
│   │   ├── Home.jsx
│   │   ├── Unauthorized.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── UserService.js
│   │   ├── BookingService.js
│   │   ├── RoomService.js
│   │   ├── FacilityService.js
│   │   ├── FacilityBookingService.js
│   │   ├── PaymentService.js
│   │   ├── FeedbackService.js
│   │   ├── ReportService.js
│   │   ├── ActivityLogService.js
│   │   ├── BranchService.js
│   │   ├── StaffService.js
│   │   └── [other services]
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   │   └── useDebounce.js
│   ├── App.js
│   ├── index.js
│   └── App.css
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🚀 IMPLEMENTATION STEPS

### Phase 1: Setup & Authentication (Week 1)
1. Initialize React project with Vite or Create React App
2. Install dependencies (axios, react-router-dom, tailwindcss, react-toastify, etc.)
3. Setup Tailwind CSS
4. Create folder structure
5. Setup Axios configuration with interceptors
6. Create AuthContext
7. Build authentication pages (Login, Signup, Forgot Password, Reset Password)
8. Implement protected routes

### Phase 2: Core Modules (Week 2-3)
1. Build reusable components (Navbar, Sidebar, Card, Table, Modal, etc.)
2. Create layout components (AuthLayout, DashboardLayout, CustomerLayout)
3. Implement User Management module (admin side)
4. Implement Profile page (customer side)
5. Create Branch Management
6. Create Room Management (CRUD, search, filters)
7. Create Facility Management (CRUD, image upload)

### Phase 3: Booking & Payment (Week 4)
1. Build Room Booking flow (search, select, book)
2. Build Facility Booking flow
3. Implement Payment processing page
4. Payment success/failed pages
5. My Bookings pages (customer)
6. Admin Bookings management
7. Payment history and management

### Phase 4: Additional Features (Week 5)
1. Feedback module (submit, view, admin management)
2. Notifications (display, mark as read)
3. Activity Log viewer (admin CCTV-like system)
4. Support tickets
5. Staff and task management

### Phase 5: Reports & Analytics (Week 6)
1. Build Reports Dashboard
2. Implement all report pages (occupancy, revenue, feedback, etc.)
3. Add charts and visualizations
4. Export functionality

### Phase 6: Testing & Polish (Week 7)
1. Test all user flows
2. Fix bugs
3. Improve UI/UX
4. Add loading and error states
5. Optimize performance
6. Write documentation
7. Deploy

---

## 🎨 STYLING GUIDELINES

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF', // blue-800
        secondary: '#F59E0B', // amber-500
        success: '#10B981', // green-500
        danger: '#EF4444', // red-500
        warning: '#F59E0B', // amber-500
        info: '#3B82F6', // blue-500
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

### Color Scheme
- **Primary**: Blue shades (#1E40AF, #3B82F6)
- **Accent**: Gold/Amber (#F59E0B)
- **Success**: Green (#10B981)
- **Danger**: Red (#EF4444)
- **Neutral**: Grays (#F3F4F6, #E5E7EB, #9CA3AF)

---

## ⚠️ IMPORTANT NOTES

### Security Considerations
1. **Never store sensitive data in localStorage** (only token and user ID/role)
2. **Validate all user inputs** on frontend (backend also validates)
3. **Sanitize user-generated content** to prevent XSS attacks
4. **Use HTTPS** in production
5. **Implement CSRF protection** if using cookies

### Performance Optimization
1. **Lazy load components** using React.lazy()
2. **Optimize images** (compress, use appropriate formats)
3. **Implement pagination** for large data sets
4. **Debounce search inputs** to reduce API calls
5. **Cache API responses** where appropriate
6. **Code splitting** for better load times

### Accessibility
1. **Use semantic HTML** (header, nav, main, footer, etc.)
2. **Add ARIA labels** for screen readers
3. **Ensure keyboard navigation** works
4. **Color contrast** meets WCAG AA standards
5. **Focus indicators** are visible

### Browser Compatibility
- Support latest 2 versions of Chrome, Firefox, Safari, Edge
- Graceful degradation for older browsers
- Test on mobile devices (responsive design)

---

## 📚 DOCUMENTATION TO CREATE

1. **README.md**: Project overview, setup instructions, available scripts
2. **API_DOCUMENTATION.md**: All API endpoints with request/response examples
3. **USER_GUIDE.md**: How to use the application (for end-users)
4. **DEVELOPER_GUIDE.md**: Code structure, how to add new features
5. **DEPLOYMENT.md**: How to deploy the application

---

## 🔗 BACKEND INTEGRATION CHECKLIST

### Make sure your frontend correctly:
- [ ] Sends JWT token in `Authorization: Bearer <token>` header for protected endpoints
- [ ] Handles `multipart/form-data` for file uploads (user profile, ID document, facility images)
- [ ] Sends correct date formats (ISO 8601: `YYYY-MM-DDTHH:mm:ss`)
- [ ] Handles API response structure: `{ status, message, data }`
- [ ] Implements retry logic for failed requests
- [ ] Displays backend error messages to users
- [ ] Validates data before sending to backend
- [ ] Handles 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

### Query Parameters
- Branch and Type IDs are sent as query params for room availability
- Date ranges for reports are query params
- Pagination params (page, size) if implemented

### File Uploads
- Use `FormData` object
- Set `Content-Type: multipart/form-data`
- Include file field names as expected by backend (e.g., `profileImage`, `idDocument`, `file`, `files`)

---

## 🎉 FINAL DELIVERABLES

1. **Fully functional React frontend** with all modules implemented
2. **Responsive design** that works on desktop, tablet, and mobile
3. **Clean, maintainable code** with proper folder structure
4. **Comprehensive documentation**
5. **User-friendly UI/UX** with smooth navigation
6. **Error handling** and validation throughout
7. **Loading states** and empty states
8. **Integration with backend API** tested and working
9. **Role-based access control** implemented correctly
10. **Activity logging** displayed for admin (CCTV-like monitoring)

---

## 💡 BONUS FEATURES (Optional)

1. **Dark Mode**: Toggle between light and dark themes
2. **Multi-language Support**: i18n for internationalization
3. **PWA**: Progressive Web App with offline support
4. **Push Notifications**: Browser push notifications
5. **Chat Support**: Real-time chat for customer support
6. **Google Maps Integration**: Show branch locations on map
7. **Calendar View**: Show bookings in calendar format
8. **Export Data**: CSV/Excel export for all tables
9. **Email Templates**: Customize email notification templates (backend)
10. **Loyalty Program**: Points/rewards system for frequent customers

---

## 🛡️ ERROR HANDLING STRATEGY

### Common Errors and How to Handle:

| Error | HTTP Status | Frontend Action |
|-------|-------------|-----------------|
| Unauthorized | 401 | Redirect to login, clear token |
| Forbidden | 403 | Show "Access Denied" message |
| Not Found | 404 | Show "Resource not found" |
| Validation Error | 400 | Display field-specific errors |
| Server Error | 500 | Show generic error, retry option |
| Network Error | - | Show "Check internet connection" |

---

## ✅ PRE-LAUNCH CHECKLIST

- [ ] All authentication flows work (login, signup, forgot password, logout)
- [ ] Protected routes redirect to login if not authenticated
- [ ] Role-based access control prevents unauthorized access
- [ ] All CRUD operations work for users, rooms, facilities, bookings, etc.
- [ ] Room booking flow works end-to-end (search → book → pay → confirm)
- [ ] Facility booking flow works end-to-end
- [ ] Payment processing works and sends confirmation
- [ ] Feedback can be submitted after booking completion
- [ ] Activity logs display correctly for admin
- [ ] Reports generate with correct data and charts
- [ ] File uploads work (profile images, ID documents, facility images)
- [ ] All forms have validation and error messages
- [ ] Loading states show during API calls
- [ ] Error handling works (401, 403, 404, 500)
- [ ] Responsive design works on mobile, tablet, desktop
- [ ] No console errors or warnings
- [ ] All images load correctly
- [ ] Navigation works smoothly
- [ ] Logout clears all user data
- [ ] Performance is acceptable (fast load times)
- [ ] Tested on multiple browsers

---

## 🚀 DEPLOYMENT

### Frontend Deployment Options:
1. **Vercel**: Best for React apps, zero-config deployment
2. **Netlify**: Easy deployment with CI/CD
3. **AWS S3 + CloudFront**: Scalable, production-ready
4. **GitHub Pages**: Free hosting for static sites
5. **Firebase Hosting**: Google's hosting solution

### Environment Variables
Create `.env` file:
```
REACT_APP_API_BASE_URL=http://localhost:9193
REACT_APP_ENV=development
```

For production:
```
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

---

## 📞 SUPPORT & MAINTENANCE

### Post-Launch Tasks:
1. Monitor error logs
2. Collect user feedback
3. Fix bugs promptly
4. Add new features based on user requests
5. Regular security updates
6. Performance monitoring and optimization
7. Keep dependencies up to date

---

## 🎓 LEARNING RESOURCES

- React Documentation: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/docs
- React Router: https://reactrouter.com/
- Axios: https://axios-http.com/docs/intro
- React Hook Form: https://react-hook-form.com/
- Chart.js: https://www.chartjs.org/
- date-fns: https://date-fns.org/

---

## 🏁 CONCLUSION

This comprehensive prompt covers **every aspect** of your hotel management system frontend:

✅ Complete authentication system with JWT
✅ User, Branch, Room, Facility management
✅ Room & Facility booking flows
✅ Payment processing with notifications
✅ Feedback system
✅ Activity logging (CCTV-like monitoring)
✅ Comprehensive reports and analytics
✅ Staff, tasks, support tickets
✅ Role-based access control
✅ Responsive design with Tailwind CSS
✅ Proper error handling and validation
✅ File uploads and image management
✅ Real-time updates (optional)

**Follow this prompt step-by-step**, and you will have a **fully functional, production-ready** frontend that perfectly integrates with your backend!

---

## 📄 APPENDIX: SAMPLE CODE SNIPPETS

### Sample Login Component

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthService } from '../../services/AuthService';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthService.login({ email, password });
      const { token, userId, roleId } = response.data;
      login(token, userId, roleId);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (roleId === 1) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="mt-2 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

---

**END OF PROMPT**

---

*This prompt is designed to be complete, detailed, and actionable. Use it as your single source of truth for building the entire frontend of your Hotel Management System. Good luck with your development! 🚀*

