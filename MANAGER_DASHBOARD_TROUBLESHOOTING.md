# 🔧 Manager Dashboard - Troubleshooting Guide

## 🚨 Common Problems & Solutions

---

## Problem 1: Dashboard Won't Load / Blank Page

### **Symptoms:**
- Page is completely blank
- Stuck on loading spinner forever
- Shows "Loading..." and nothing happens

### **Diagnosis:**
```javascript
// Open Console (F12) and check for:
1. Red error messages
2. Failed network requests (401, 404, 500)
3. "No branch assigned" message
```

### **Solutions:**

#### **Solution A: Manager Has No Branch Assigned**
```sql
-- Check if manager has branch_id
SELECT user_id, name, email, branch_id FROM users WHERE role_id = 3;

-- If branch_id is NULL, assign one:
UPDATE users SET branch_id = 1 WHERE user_id = YOUR_MANAGER_ID;
```

#### **Solution B: Not Logged In / Token Expired**
```javascript
// Check localStorage
localStorage.getItem('token')

// If null or expired:
// 1. Go to login page
// 2. Login again
// 3. Try dashboard again
```

#### **Solution C: Backend Not Running**
```bash
# Check if backend is running on port 9193
curl http://localhost:9193/api/manager/dashboard/1

# If error:
# 1. Start your Spring Boot backend
# 2. Wait for "Started Application" message
# 3. Refresh dashboard
```

#### **Solution D: Wrong Role**
```sql
-- Verify user is manager (role_id = 3)
SELECT user_id, name, role_id FROM users WHERE email = 'your.email@example.com';

-- If role_id is not 3, update:
UPDATE users SET role_id = 3 WHERE user_id = YOUR_USER_ID;
```

---

## Problem 2: All Stats Show Zero

### **Symptoms:**
- 8 cards appear
- All numbers are 0
- Percentages missing

### **Diagnosis:**
```javascript
// Network tab (F12):
// Check response for:
GET /api/manager/dashboard/{branchId}
GET /api/manager/today-stats/{branchId}

// Response should have real data, not all zeros
```

### **Solutions:**

#### **Solution A: No Data in Database**
```sql
-- Check if bookings exist for this branch
SELECT COUNT(*) FROM bookings WHERE branch_id = 1;

-- If 0, add test bookings:
INSERT INTO bookings (customer_id, room_id, branch_id, check_in_date, check_out_date, total_price, payment_status, booking_status)
VALUES (1, 1, 1, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), 5000.00, 'PAID', 'CONFIRMED');

-- Check if rooms exist for this branch
SELECT COUNT(*) FROM rooms WHERE branch_id = 1;

-- If 0, add test rooms:
INSERT INTO rooms (branch_id, type_id, room_number, price_per_night, capacity, status)
VALUES (1, 1, '101', 2500.00, 2, 'AVAILABLE');
```

#### **Solution B: Wrong Branch ID**
```javascript
// In console:
// Check which branch_id is being used
// Look for: /api/manager/dashboard/{branchId}

// If using wrong branch (no data), update user's branch_id
```

#### **Solution C: Backend Calculation Issue**
```java
// Check backend logs for errors in:
// - ManagerDashboardService.java
// - getTodayStats() method
// - getDashboardSummary() method
```

---

## Problem 3: Staff List is Empty

### **Symptoms:**
- Says "No staff members found"
- Or shows spinning loader forever

### **Diagnosis:**
```javascript
// Network tab:
GET /api/manager/staff/{branchId}

// Check response:
// 1. If 200 but empty array → No staff in database
// 2. If 404 → Endpoint doesn't exist
// 3. If 500 → Backend error
```

### **Solutions:**

#### **Solution A: No Staff in Database**
```sql
-- Check for staff users
SELECT user_id, name, email, branch_id FROM users WHERE role_id = 2;

-- If empty, add test staff:
INSERT INTO users (role_id, name, email, password_hash, password_salt, phone, branch_id, status)
VALUES (
  2, -- STAFF role
  'John Doe',
  'john.doe@hotel.com',
  'test_hash_1234567890123456789012345678901234567890123456789012',
  'testsalt12',
  '+91-9999999999',
  1, -- Same branch as manager
  'active'
);

-- Add more staff:
INSERT INTO users (role_id, name, email, password_hash, password_salt, phone, branch_id, status)
VALUES (
  2,
  'Jane Smith',
  'jane.smith@hotel.com',
  'test_hash_9876543210987654321098765432109876543210987654321098',
  'testsalt34',
  '+91-8888888888',
  1,
  'active'
);
```

#### **Solution B: Staff in Different Branch**
```sql
-- Check staff branch assignments
SELECT user_id, name, branch_id FROM users WHERE role_id = 2;

-- Update to match manager's branch:
UPDATE users SET branch_id = 1 WHERE role_id = 2;
```

#### **Solution C: Backend Endpoint Missing**
```java
// Verify this endpoint exists in backend:
@GetMapping("/api/manager/staff/{branchId}")
public List<User> getStaffByBranch(@PathVariable int branchId) {
    return staffService.getStaffByBranch(branchId);
}
```

---

## Problem 4: Can't Assign Tasks

### **Symptoms:**
- "Assign Task" button doesn't work
- Modal doesn't open
- Or modal opens but submit fails

### **Diagnosis:**
```javascript
// When clicking "Assign Task":
// 1. Check console for errors
// 2. Check if modal appears
// 3. Check if dropdowns populate

// When submitting:
// Check Network tab for:
POST /api/stafftasks
```

### **Solutions:**

#### **Solution A: Modal Component Missing**
```bash
# Check if file exists:
ls src/components/dashboard/AssignTaskModal.jsx

# If not found, the component wasn't created
# Re-check installation steps
```

#### **Solution B: No Rooms Available**
```sql
-- Check if rooms exist
SELECT room_id, room_number, branch_id FROM rooms WHERE branch_id = 1;

-- If empty, add test room:
INSERT INTO rooms (branch_id, type_id, room_number, price_per_night, capacity, status)
VALUES (1, 1, '101', 2500.00, 2, 'AVAILABLE');
```

#### **Solution C: Backend Validation Error**
```javascript
// Check error response:
// Common issues:
// 1. Missing required fields
// 2. Invalid room_id
// 3. Invalid staff_id
// 4. Invalid task_type

// Verify request body:
{
  "staffId": 2,        // Must exist in users table
  "roomId": 1,         // Must exist in rooms table
  "taskType": "CLEANING", // Must be valid enum
  "status": "PENDING",
  "remarks": "Clean room"
}
```

#### **Solution D: CORS Error**
```java
// Backend SecurityConfig should have:
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000",
        "http://localhost:5173"  // ← Must include Vite port
    ));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setAllowCredentials(true);
    return source;
}
```

---

## Problem 5: Can't Update Task Status

### **Symptoms:**
- "Update Status" button doesn't work
- Dropdown appears but selection doesn't save
- Error message on update

### **Diagnosis:**
```javascript
// Network tab:
PATCH /api/stafftasks/{taskId}

// Check:
// 1. Status code (should be 200)
// 2. Request body (should have "status" field)
// 3. Response (should confirm update)
```

### **Solutions:**

#### **Solution A: Backend Endpoint Missing**
```java
// Verify this exists in StaffTaskController:
@PatchMapping("/{taskId}")
public ResponseEntity<?> updateTask(
    @PathVariable int taskId,
    @RequestBody Map<String, String> updates
) {
    // Implementation
}
```

#### **Solution B: Invalid Status Value**
```javascript
// Status must be one of:
// - "PENDING"
// - "IN_PROGRESS"
// - "COMPLETED"

// Check request body:
{
  "status": "IN_PROGRESS" // ← Must match exactly (case-sensitive)
}
```

#### **Solution C: Task Doesn't Exist**
```sql
-- Verify task exists:
SELECT task_id, status FROM staff_tasks WHERE task_id = YOUR_TASK_ID;

-- If not found, task was deleted or never created
```

---

## Problem 6: Toast Notifications Don't Appear

### **Symptoms:**
- Actions succeed but no success message
- No error notifications
- Silent failures

### **Diagnosis:**
```javascript
// Check if ToastContainer is in main.jsx:
import { ToastContainer } from 'react-toastify';

// In JSX:
<ToastContainer />
```

### **Solutions:**

#### **Solution A: Missing ToastContainer**
```javascript
// In src/main.jsx, add:
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// In JSX:
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  </React.StrictMode>
);
```

#### **Solution B: CSS Not Imported**
```javascript
// Add to main.jsx:
import 'react-toastify/dist/ReactToastify.css';
```

#### **Solution C: Package Not Installed**
```bash
npm install react-toastify
# or
npm list react-toastify
# Should show version 10.x.x
```

---

## Problem 7: Auto-Refresh Not Working

### **Symptoms:**
- Dashboard doesn't update every 30 seconds
- Manual refresh button works but auto doesn't
- No "Dashboard refreshed" toast

### **Diagnosis:**
```javascript
// Check console for:
// "🔄 Auto-refreshing dashboard..."
// Should appear every 30 seconds

// Check ManagerDashboard.jsx:
// useEffect with 30000ms interval should exist
```

### **Solutions:**

#### **Solution A: Interval Not Set**
```javascript
// In ManagerDashboard.jsx, verify this exists:
useEffect(() => {
  const interval = setInterval(() => {
    console.log('🔄 Auto-refreshing dashboard...');
    handleRefresh();
  }, 30000); // 30 seconds

  return () => clearInterval(interval);
}, []);
```

#### **Solution B: Tab Not Active**
```javascript
// Browser pauses intervals in background tabs
// Solution: Keep tab active or check when tab becomes active

useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      handleRefresh();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

---

## Problem 8: Activity Feed is Empty

### **Symptoms:**
- Says "No recent activity"
- Or shows old/irrelevant activities

### **Diagnosis:**
```javascript
// Check dashboard API response:
// recentActivity array should have items

// Example:
{
  "recentActivity": [
    {
      "type": "BOOKING_CREATED",
      "description": "New booking created",
      "timestamp": "2025-12-05T10:30:00"
    }
  ]
}
```

### **Solutions:**

#### **Solution A: No Activity Logged**
```sql
-- Check activity_log table:
SELECT * FROM activity_log 
WHERE DATE(created_at) = CURDATE() 
ORDER BY created_at DESC 
LIMIT 10;

-- If empty, activities aren't being logged
-- Check backend ActivityLogService
```

#### **Solution B: Backend Doesn't Return Activity**
```java
// Verify dashboard API includes activity:
@GetMapping("/api/manager/dashboard/{branchId}")
public ManagerDashboardDTO getDashboard(@PathVariable int branchId) {
    ManagerDashboardDTO dto = new ManagerDashboardDTO();
    // ...
    dto.setRecentActivity(activityService.getRecentActivity(branchId));
    return dto;
}
```

---

## Problem 9: Top Rooms Chart Not Showing

### **Symptoms:**
- Chart section is empty
- Or shows "No data available"

### **Diagnosis:**
```javascript
// Check dashboard API response:
// topRooms array should have items

// Example:
{
  "topRooms": [
    {
      "roomNumber": "101",
      "bookingCount": 12
    },
    {
      "roomNumber": "102",
      "bookingCount": 8
    }
  ]
}
```

### **Solutions:**

#### **Solution A: No Bookings**
```sql
-- Check bookings count per room:
SELECT r.room_number, COUNT(b.booking_id) as bookings
FROM rooms r
LEFT JOIN bookings b ON r.room_id = b.room_id
WHERE r.branch_id = 1
GROUP BY r.room_id
ORDER BY bookings DESC
LIMIT 5;

-- If all zero, add test bookings
```

#### **Solution B: Chart Library Issue**
```bash
# Chart.js might not be installed
npm list chart.js react-chartjs-2

# If not found:
npm install chart.js react-chartjs-2
```

---

## Problem 10: Responsive Design Broken

### **Symptoms:**
- Mobile view looks wrong
- Elements overlap
- Cards too wide
- Can't scroll

### **Diagnosis:**
```javascript
// Press F12 → Toggle device toolbar
// Try different screen sizes:
// - iPhone SE (375px)
// - iPad (768px)
// - Desktop (1920px)
```

### **Solutions:**

#### **Solution A: Tailwind Not Compiling**
```bash
# Check if Tailwind is working:
# Classes like 'md:grid-cols-2' should apply

# Rebuild:
npm run dev

# Check tailwind.config.js exists
```

#### **Solution B: Meta Viewport Missing**
```html
<!-- In index.html, verify this exists: -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 🔍 General Debugging Steps

### **Step 1: Check Console (F12)**
```javascript
// Look for:
// ❌ Red errors → Fix these first
// ⚠️ Yellow warnings → Usually okay
// 🔵 Blue logs → Good, shows things working
```

### **Step 2: Check Network Tab (F12)**
```javascript
// Look for:
// ✅ Status 200 → Success
// ❌ Status 401 → Not authenticated (re-login)
// ❌ Status 403 → No permission
// ❌ Status 404 → Endpoint doesn't exist
// ❌ Status 500 → Backend error (check backend logs)
```

### **Step 3: Check Backend Logs**
```bash
# Look in your Spring Boot console for:
# - Stack traces (red error messages)
# - SQL errors
# - Validation errors
```

### **Step 4: Check Database**
```sql
-- Verify data exists:
SELECT * FROM users WHERE role_id = 3; -- Manager
SELECT * FROM users WHERE role_id = 2; -- Staff
SELECT * FROM rooms WHERE branch_id = 1; -- Rooms
SELECT * FROM bookings WHERE branch_id = 1; -- Bookings
SELECT * FROM staff_tasks ORDER BY assigned_at DESC LIMIT 5; -- Tasks
```

---

## 🆘 Emergency Fixes

### **Nuclear Option: Complete Reset**

```bash
# 1. Clear browser data
localStorage.clear();
sessionStorage.clear();

# 2. Restart frontend
npm run dev

# 3. Restart backend
# Stop Spring Boot
# Start Spring Boot again

# 4. Re-login
# Go to /login
# Login as manager
# Navigate to /manager/dashboard
```

---

## 📞 Still Stuck?

### **Checklist Before Asking for Help:**

1. ✅ Backend is running on port 9193
2. ✅ Frontend is running on port 5173
3. ✅ Logged in as manager (role_id = 3)
4. ✅ Manager has branch_id assigned
5. ✅ Staff users exist in database
6. ✅ Rooms exist for that branch
7. ✅ No red errors in console
8. ✅ No failed network requests (all 200 OK)
9. ✅ Tried clearing cache and re-login
10. ✅ Checked all files exist

### **Information to Provide:**

```
1. Error message (exact text)
2. Console errors (screenshot)
3. Network tab (failed requests)
4. Backend logs (if any errors)
5. Steps to reproduce
6. Expected vs actual behavior
```

---

**Good luck with your Manager Dashboard! 🚀**

