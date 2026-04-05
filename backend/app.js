const express = require("express");
const app = express();
const routes = require("./routes/employeeRoutes");

app.use(express.json());
app.use("/api", routes);

app.listen(3000, () => console.log("Server running"));
