const express = require("express");
//const fs = require('fs')

const app = express();
const PORT = process.env.PORT || 4050;

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));

const cors = require("cors");

//IMPORT ROUTES
const authRoute = require("./routes/auth");
const authDashboard = require("./routes/authDashboard");
const notificationRoute = require("./notifications/chatnotifications");

const db = require("./models/database/db")

console.log("process.env.DB_CONNECT " + process.env.DB_CONNECT)




//MIDDLEWARE -> DISALBING CORS AND USED FOR JSON OUTPUT
app.use(express.json(), cors());
app.get("/", (req, res) => {
    res.send("jhhhhhhh");
})
//ROUTE MIDDLEWARE
app.use("/api/users", authRoute);
app.use("/api/dashboard", authDashboard);
app.use("/api/notification", notificationRoute);


