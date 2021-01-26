console.log("CoinApp Running");
const express = require("express");
const Client = require("coinbase").Client;
const app = express();
app.use(express.json());

// const API_KEY = "oMUlw3ORcWrrs8xi";
// const API_SECRET = "taLSy4UmTcKCPXTm1r0w5uCVwBI3j95K";
// const DEFAULT_ACCOUNT = "primary";

const API_KEY = "aAQKlFBGH36NqP2R";
const API_SECRET = "Eza8jtzauO1ta6qGUdR8hi4K88Kmz5Q9";
const DEFAULT_ACCOUNT = "primary";

// const API_KEY = "aAQKlFBGH36NqP2R";
// const API_SECRET = "tEza8jtzauO1ta6qGUdR8hi4K88Kmz5Q9";
// const DEFAULT_ACCOUNT = "primary";

const client = new Client({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  strictSSL: false,
});

app.post("/send/", function (req, res) {
  const params = req.body;
  // const to = params.to;
  // const amount = params.amount;
  // const currency = params.currency;
  if (!params.accountID) {
    params.accountID = DEFAULT_ACCOUNT;
  }

  getAccount(client, params, res)
    .then((details) => {
      const account = details.account;
      // console.log("details:", details);
      return sendMoney(account, details.params, res).then((output) => {
        console.log("Successful: ", output);
        res.status(200).send(output);
      });
    })
    .catch((err) => {
      switch (err.name) {
        case "ExpiredToken":
          res.status(401).send("Coinbase session expired");
          break;

        case "ValidationError":
          res.status(400).send(err.message);
          break;

        default:
          res.status(400).send(err.message);
          break;
      }
    });
});

function getAccount(client, params, res) {
  if (!client) {
    //Unauthorized
    res.sendStatus(401);
    return;
  }
  return new Promise((resolve, reject) => {
    client.getAccount(params.accountID, function (err, account) {
      if (err) {
        // console.log("A1", err.name);
        // console.log("A2", err.id);
        reject(err);
        return;
      } else {
        resolve({
          account,
          params,
        });
        return;
      }
    });
  });
}

function sendMoney(account, params, res) {
  return new Promise((resolve, reject) => {
    account.sendMoney(
      {
        to: `${params.to}`,
        amount: `${params.amount}`,
        currency: `${params.currency}`,
      },
      function (err, tx) {
        if (err) {
          console.log("Error Name :", err.name);
          reject(err);
          return;
        }
        resolve(tx);
        return;
      }
    );
  });
}

app.listen(3000);
