const express = require("express");
require("express-async-errors");
const app = express();

const routes = require("./routes/routes");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());

// parse application/json
app.use(bodyParser.json());

//  Connect all our routes to our application
app.use("/", routes);

// Turn on that server!
app.listen(5000, () => {
  console.log("App listening on port 5000");
});
