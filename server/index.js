const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require("cors");
const xml2js = require("xml2js");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// POST route to convert JSON to XML
app.post("/convert-to-xml", (req, res) => {
  // Convert JSON to XML
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(req.body);

  res.send(xml);
});

// POST route to convert XML to JSON
app.post("/convert-to-json", (req, res) => {
  // Convert XML to JSON
  const parser = new xml2js.Parser();
  parser.parseString(req.body, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
