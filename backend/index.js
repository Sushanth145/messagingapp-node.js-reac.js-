const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth"));
app.use("/messages", require("./routes/messages"));
app.use("/users", require("./routes/users"));


app.listen(3001, () => console.log("API running on http://localhost:3001"));