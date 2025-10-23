const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const userRoutes = require ( './routes/userRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')
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


app.get("/health-check", (req, res) => {
  res.send("travel app server is running...");
});

// Mount user routes
app.use('/api', userRoutes, );
app.use('/api', vehicleRoutes)

connectToDatabase();

app.listen(port, (error) => {
  if (error) {
    console.log("Error: " + error);
  } else {
    console.log("Server is running on port " + port);
  }
});
