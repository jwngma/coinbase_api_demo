console.log("CoinApp Running");
const express = require("express");
const Client = require("coinbase").Client;
const app = express();
app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).json({
    message: "The codes are removed",
  });
});
