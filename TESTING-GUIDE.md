# 🧪 Testing the Booking Flow

## Quick Test Steps

### Test 1: Unauthenticated Booking Flow
```
1. Open browser to http://localhost:5173
2. Navigate to Facilities page
3. Click "Book Now" on any facility
4. You should be redirected to /login
5. Check browser console - should see returnUrl saved
6. Login with test credentials
7. You should be redirected back to the booking page
8. Verify facility details are loaded
9. Fill the form and submit
10. Should see success message and redirect to bookings
```

### Test 2: Signup Flow
```
1. Clear localStorage in browser console: localStorage.clear()
2. Navigate to Facilities page
3. Click "Book Now" on any facility
4. Redirected to /login
5. Click "Sign up now"
6. Fill signup form and submit
7. After success, redirected to /login
8. Login with new credentials
9. Should return to booking page
10. Complete the booking
```

### Test 3: Authenticated Booking
```
1. Already logged in
2. Navigate to Facilities
3. Click "Book Now"
4. Should directly open booking form (no redirect)
5. Fill and submit
6. Success!
```

## Browser Console Commands for Testing

### Check if logged in:
```javascript
localStorage.getItem('token')
localStorage.getItem('user')
```

### Check return URL:
```javascript
localStorage.getItem('returnUrl')
```

### Manually set return URL (for testing):
```javascript
localStorage.setItem('returnUrl', '/book-facility/1')
```

### Clear all auth data:
```javascript
localStorage.removeItem('token')
localStorage.removeItem('user')
localStorage.removeItem('returnUrl')
// OR
localStorage.clear()
```

### Check current auth state (in React):
```javascript
// In browser console when on the page
// This won't work directly, but you can add console.log in useAuth()
```

## Expected Console Logs

### When clicking "Book Now" (not authenticated):
```
🔍 Fetching facilities from backend...
✅ Facilities received: [...]
📊 Number of facilities: 7
// Redirect happens
```

### When loading booking page:
```
Loading facility details...
Facility loaded: { facilityId: 1, name: "Luxury Spa", ... }
```

### When submitting booking:
```
Submitting booking: {
  customerId: 1,
  facilityId: 1,
  bookingDate: "2025-12-15",
  startTime: "10:00",
  endTime: "12:00",
  quantity: 1
}
Booking confirmed successfully!
```

## Common Issues & Solutions

### Issue: "Not redirecting after login"
**Solution:**
1. Open browser DevTools → Application → Local Storage
2. Check if `returnUrl` exists
3. If not, the save didn't happen - check console for errors
4. Try manually: `localStorage.setItem('returnUrl', '/book-facility/1')`

### Issue: "Token not found"
**Solution:**
1. Login again
2. Check backend response has `token` field
3. Verify AuthContext is saving token correctly

### Issue: "403 Forbidden on booking"
**Solution:**
1. Check token is in localStorage
2. Verify axios interceptor is adding Authorization header
3. Check backend CORS and security config

### Issue: "Infinite redirect loop"
**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Login again

## Backend Requirements

Make sure your backend is:
- Running on http://localhost:9193
- Has CORS enabled for http://localhost:5173
- Has these endpoints working:
  - POST /api/users/login
  - POST /api/users (signup)
  - GET /facilities/all
  - GET /facilities/:id
  - POST /facility-bookings
  - GET /facility-bookings/customer/:id

## Test Credentials

Create test users in your database:
```sql
-- Customer (roleId = 1)
INSERT INTO users (role_id, name, email, password_hash, password_salt, phone, status)
VALUES (1, 'Test Customer', 'customer@test.com', 'hashed_password', 'salt123', '1234567890', 'active');

-- Staff (roleId = 2)
INSERT INTO users (role_id, name, email, password_hash, password_salt, phone, status)
VALUES (2, 'Test Staff', 'staff@test.com', 'hashed_password', 'salt123', '1234567891', 'active');
```

## Success Criteria

✅ Unauthenticated user can browse facilities
✅ Clicking "Book Now" saves path and redirects to login
✅ After login, user returns to booking page
✅ Booking form loads with facility details
✅ Booking submission works and redirects to bookings list
✅ New users can signup, login, and complete booking
✅ Authenticated users can book directly without redirect
✅ Role-based navigation works (customers vs staff vs admin)

## Video Test Recording

Record your screen and test each flow:
1. Record unauthenticated booking flow (3 min)
2. Record signup and booking flow (4 min)
3. Record authenticated booking flow (2 min)

This will help debug any issues!

---

**Happy Testing! 🎉**

