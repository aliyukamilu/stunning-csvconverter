const express = require("express")
const PORT = process.env.PORT || 3004;
const app = express();
const cors = require("cors")
const xml2js = require("xml2js")
const bodyParser = require("body-parser")
const json2csv = require("json2csv")
const xmlparser = require('express-xml-bodyparser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser.text({ type: 'text/xml' }));

app.use(cors());

function replaceDoubleQuotesWithSingleQuotes(str) {
  return str.replace(/\"/g, "\'");
}

function replaceWord(str, target, replacement) {
  return str.replace(new RegExp(target, 'g'), replacement);
}

// POST route to convert JSON to XML
app.post("/convert-to-xml", (req, res) => {
  // Convert JSON to XML
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(req.body);


  // res.json({
  //   status: 1,
  //   result: replaceDoubleQuotesWithSingleQuotes(xml)
  // });
  // res.send(replaceDoubleQuotesWithSingleQuotes(xml));
  let singleQut = replaceDoubleQuotesWithSingleQuotes(xml)
  // let finalQut = singleQut.replace("<?xml version='1.0' encoding='UTF-8' standalone='yes'?>", "")

  res.send(singleQut)
  // res.json({
  //   status: 1,
  //   result: singleQut
  // });
});
// POST route to convert XML to JSON

app.post("/convert-to-json", (req, res) => {
  // Convert XML to JSON
  let xml = req.body
  const parseString = xml2js.parseString;

  parseString(xml, (err, result) => {
    if (err) console.error(err);

    res.json(result)
  });

});

app.post('/convert-to-edifact', (req, res) => {
  // Read the JSON data from the request body
  const jsonData = req.body

  // Create an EdifactInterchange object
  const interchange = new edifactLib.EdifactInterchange({
    sender: jsonData.header.sender,
    recipient: jsonData.header.recipient,
  });

  // Create an EdifactMessage object
  const message = new edifactLib.EdifactMessage({
    name: jsonData.name,
  });

  // Add segments to the message
  for (const segment of jsonData.segments) {
    message.addSegment({
      name: segment.name,
      elements: segment.elements,
    });
  }

  // Add the message to the interchange
  interchange.addMessage(message);
  // Convert the interchange to an EDIFACT message
  const edifactMessage = interchange.toString();

  res(edifactMessage)

});

app.post('/convert-to-csv', (req, res) => {
  // Read the JSON data from the request body
  const jsonData = req.body;

  // Convert the JSON data to CSV format
  const csvData = json2csv.parse(jsonData);

  // Send the CSV data as the response
  res.send(csvData);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
