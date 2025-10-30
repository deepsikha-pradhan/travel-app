const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const passport = require("passport");
const userRoutes = require ( './routes/userRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')
const googleRoutes = require('./routes/googleRoutes')
const passengerTripRoutes = require('./routes/tripRoutes/passengerTripRoutes')
const bookingRoutes = require ('./routes/bookingRoutes/passengerBookingRoute')
const {connectToDatabase} = require ('./config/db')

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   console.log("Incoming request body:", req.body);
//   next();
// });

require("./config/passport")(passport);
app.use(passport.initialize())


app.get("/health-check", (req, res) => {
  res.send("travel app server is running...");
});

// Mount user routes
app.use('/api', userRoutes, );
app.use('/api', vehicleRoutes);
app.use('/api/trips/passenger', passengerTripRoutes);
app.use('/api/travel',bookingRoutes);
app.use("/api/auth", googleRoutes);

connectToDatabase();

app.listen(port, (error) => {
  if (error) {
    console.log("Error: " + error);
  } else {
    console.log("Server is running on port " + port);
  }
});
