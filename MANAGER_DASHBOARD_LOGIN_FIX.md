# 🔧 Manager Dashboard - Login Connection Fix

## ❌ Problem Identified

Your login is failing because:
1. ❌ Frontend is running on **localhost:3000** (wrong port)
2. ✅ Backend is running on **localhost:9193** (correct)
3. ❌ Ports don't match what's configured in CORS

**Error:** `ERR_CONNECTION_REFUSED` when trying to login

---

## ✅ Solution: Use Correct Port

### **Step 1: Stop Current Dev Server**

```bash
# Press Ctrl+C in your terminal to stop the current server
```

---

### **Step 2: Clear Any Running Processes**

**Option A: Windows (PowerShell)**
```powershell
# Check what's running on port 3000
netstat -ano | findstr :3000

# If something is running, kill it (replace PID with actual process ID)
taskkill /PID <PID> /F

# Check what's running on port 5173
netstat -ano | findstr :5173

# If something is running, kill it
taskkill /PID <PID> /F
```

**Option B: Close all terminal windows and restart**

---

### **Step 3: Start Vite Dev Server (Correct Port)**

```bash
# Navigate to your project
cd C:\Users\anany\WebstormProjects\hotelfrontend

# Start Vite (will run on port 5173)
npm run dev
```

**You should see:**
```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

### **Step 4: Access Dashboard on Correct Port**

**❌ Wrong (Don't use this):**
```
http://localhost:3000/manager/dashboard
```

**✅ Correct (Use this):**
```
http://localhost:5173/manager/dashboard
```

---

### **Step 5: Login as Manager**

1. Go to: `http://localhost:5173/login`
2. Enter manager credentials
3. Should login successfully now!

---

## 🔍 Why This Happened

You might have accidentally started a Create React App server (port 3000) instead of Vite (port 5173).

**Create React App command (Wrong):**
```bash
npm start  # ❌ Starts on port 3000
```

**Vite command (Correct):**
```bash
npm run dev  # ✅ Starts on port 5173
```

---

## ✅ Verify Fix Worked

### **Check 1: Correct Port**
```
http://localhost:5173/
# Should see your hotel homepage
```

### **Check 2: Backend Connection**
```javascript
// Open Console (F12)
// Look for:
"🔍 Axios Request: { url: '/api/users/login', fullURL: 'http://localhost:9193/api/users/login' }"
```

### **Check 3: Login Success**
```javascript
// After login, check localStorage:
localStorage.getItem('token')
// Should return a JWT token, not null
```

---

## 🛠️ If Still Not Working

### **Issue 1: Backend Not Running**

**Check:**
```bash
# Try accessing backend directly:
curl http://localhost:9193/api/users/login
# Or open in browser
```

**Fix:**
1. Start your Spring Boot backend
2. Wait for "Started Application on port 9193"
3. Try login again

---

### **Issue 2: CORS Error**

**Symptom:**
```
Access to XMLHttpRequest at 'http://localhost:9193/api/users/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Fix - Update Backend CORS Configuration:**

**File:** `SecurityConfig.java` (in your Spring Boot backend)

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    
    // ✅ Add Vite port
    config.setAllowedOrigins(Arrays.asList(
        "http://localhost:3000",  // CRA (if you use it)
        "http://localhost:5173"   // Vite ← ADD THIS!
    ));
    
    config.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
    ));
    
    config.setAllowedHeaders(Arrays.asList("*"));
    config.setAllowCredentials(true);
    config.setMaxAge(3600L);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

**After updating:**
1. Restart Spring Boot backend
2. Try login again

---

### **Issue 3: Wrong Login Endpoint**

**Check your backend has this endpoint:**

```java
@PostMapping("/api/users/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    // Login logic
}
```

**If endpoint is different, update frontend:**

**File:** `src/context/AuthContext.jsx`

```javascript
// Change this line (around line 50):
const response = await axios.post('/api/users/login', { email, password });

// To match your backend endpoint, for example:
const response = await axios.post('/api/auth/login', { email, password });
```

---

## 🎯 Quick Test Checklist

Before testing login:

- [ ] Backend running on port 9193
- [ ] Frontend running on port 5173 (Vite)
- [ ] No other processes on these ports
- [ ] CORS configured for port 5173
- [ ] Browser cache cleared (Ctrl+Shift+Del)
- [ ] Console open to see logs (F12)

**Then try:**
1. Go to `http://localhost:5173/login`
2. Enter manager email/password
3. Click Login
4. Should redirect to dashboard

---

## 📊 Expected Console Output (Success)

```javascript
🔍 Axios Request: {
  method: 'post',
  url: '/api/users/login',
  fullURL: 'http://localhost:9193/api/users/login',
  skipAuth: undefined,
  hasToken: false
}

✅ Public endpoint - no auth required

✅ Response received: 200 /api/users/login
```

---

## 🚨 Common Mistakes

### **Mistake 1: Using npm start**
```bash
npm start  # ❌ Wrong (CRA, port 3000)
npm run dev  # ✅ Correct (Vite, port 5173)
```

### **Mistake 2: Wrong URL in Browser**
```
http://localhost:3000/login  # ❌ Wrong
http://localhost:5173/login  # ✅ Correct
```

### **Mistake 3: Backend Not Running**
```
# Check backend logs:
# Should see: "Started Application on port 9193"
```

---

## 🔧 Complete Fresh Start

If nothing works, do a complete reset:

### **Step 1: Stop Everything**
```bash
# Close all terminals
# Close browser
# Kill all Node processes
```

### **Step 2: Start Backend**
```bash
# In backend terminal:
./mvnw spring-boot:run
# or
java -jar target/your-app.jar

# Wait for: "Started Application on port 9193"
```

### **Step 3: Start Frontend (Vite)**
```bash
# In frontend terminal:
cd C:\Users\anany\WebstormProjects\hotelfrontend
npm run dev

# Wait for: "Local: http://localhost:5173/"
```

### **Step 4: Open Browser**
```
1. Open new incognito window (Ctrl+Shift+N)
2. Go to: http://localhost:5173/login
3. Try login
```

---

## ✅ Success Indicators

**You know it's working when:**

1. ✅ Frontend opens at `localhost:5173`
2. ✅ Login page loads without errors
3. ✅ Console shows axios requests to `localhost:9193`
4. ✅ Login succeeds and redirects
5. ✅ Token saved in localStorage
6. ✅ Dashboard loads successfully

---

## 📞 Still Having Issues?

**Gather this information:**

1. **Frontend port:** (check browser URL bar)
2. **Backend port:** (check Spring Boot logs)
3. **Console errors:** (F12 → Console tab)
4. **Network errors:** (F12 → Network tab)
5. **Backend logs:** (any errors in Spring Boot console)

**Check these files:**
- `package.json` - scripts section
- `vite.config.js` - port configuration
- Backend `SecurityConfig.java` - CORS settings
- Backend `application.properties` - server port

---

## 🎉 After Fixing

Once login works:

1. ✅ Complete the Quick Check guide
2. ✅ Test manager dashboard features
3. ✅ Verify all 8 stat cards load
4. ✅ Test task assignment
5. ✅ Confirm auto-refresh works

**Then you're ready to use the full dashboard! 🚀**

---

## 📚 Related Documentation

- **Full Testing Guide:** `MANAGER_DASHBOARD_TESTING_GUIDE.md`
- **Quick Check:** `MANAGER_DASHBOARD_QUICK_CHECK.md`
- **Troubleshooting:** `MANAGER_DASHBOARD_TROUBLESHOOTING.md`

---

**Good luck! Your dashboard is waiting at `http://localhost:5173/manager/dashboard` 🎉**

