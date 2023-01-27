const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var request = require("request");
var zlib = require("zlib");

const port = process.env.PORT || 5005;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const typicodeRoute = require("./routes/tribehired");

app.use("/tribe-hired", typicodeRoute);

app.get("/", (req: any, res: any) => {
  res.send("testing: rest api");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
