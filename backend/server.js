const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("dns");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");



dotenv.config();

// Fix: System DNS (hyddns.actcorp.in) refuses Node's c-ares queries (ECONNREFUSED).
// Use public DNS servers to resolve MongoDB Atlas SRV records reliably.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);


app.get("/", (req, res)=>{
    res.json({
        message:"Task tracker is working..."
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Tracker running on the ${PORT}`);
}
);