# AEGIS — AI Emergency Command & Response System

> **“Seconds Matter. Information Should Move Faster.”**

### 🌐 Live Web Demo (GitHub Pages):
**[https://saras5786.github.io/AEGIS/](https://saras5786.github.io/AEGIS/)**

---

### ⚠️ IMPORTANT SIMULATION DISCLAIMER
**AEGIS is an educational and college project simulation.**
It does **NOT** contact police, ambulance, fire departments, hospitals, or any real-world emergency dispatch service. It is designed to demonstrate how AI triage, real browser geolocation, interactive mapping, and coordinated response dispatch can function together in a modern web system.

---

## 🌟 Key Features

1. **Slow & Smooth Cinematic AEGIS Entrance**
   - Elegant fade-in and soft glowing scale animation on page load.
2. **Real Browser Geolocation & Interactive Map**
   - Reads actual latitude, longitude, and accuracy via `navigator.geolocation.getCurrentPosition()`.
   - Real Leaflet map with OpenStreetMap dark tiles, custom pulse markers, and routes.
3. **Multi-Step Citizen Emergency Report**
   - **Step 1: Real Location Confirmation** (GPS with accuracy meters or manual pin adjustment).
   - **Step 2: Emergency Details** (Road accident, fire, medical, police, hazard).
   - **Step 3: Photo / Live Camera Capture** (Uses device webcam with live viewfinder snapshot or file upload).
   - **Step 4: AI Analysis** (Urgency scoring, hazard detection, recommended response team).
4. **Two-Step Verification Protocol**
   - Incident remains pending until confirmed by both **AI Analysis** and **Human Executive Verification**.
   - Executive can click **📞 CALL CITIZEN** to simulate an audio call check with realistic ringtone, live timer, and verification notes.
5. **Real-Time Simulated Responder Movement**
   - Dispatched ambulances, police, and fire trucks physically move on the map towards the incident along waypoints with live ETA countdown!
6. **Hospital Network Integration**
   - 5 simulated hospitals with emergency bed occupancy, trauma readiness, and "Alert Hospital" status updates.
7. **Simulated False / Prank Report Protection**
   - Simulated ₹1,000 warning penalties and user reputation status (Normal, Warning, Under Review, Restricted).
8. **Simulation Control Lab**
   - One-click demo triggers:
     - *Road Accident — East Gate Road* (Prebuilt Presentation Scenario)
     - *Electrical Fire Incident*
     - *Medical Emergency at Terminal*
     - *False / Prank Report*
     - *Reset Simulation*
9. **Sound Effects (Web Audio API)**
   - Emergency alert pings, radio dispatch chirps, incoming call ringers, and verification chimes without needing external audio files.

---

## 🔑 Login Credentials

| Role | Access Method | Credentials |
| :--- | :--- | :--- |
| **Citizen** | Phone Number + OTP | Any Phone Number • Demo OTP: `123456` |
| **Executive** | Operator Login | **ID:** `123` • **Password:** `123` |

---

## 🚀 Running the Project

The application is already built and running locally at:
**[http://localhost:5173/](http://localhost:5173/)**

To start the development server manually at any time:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```
