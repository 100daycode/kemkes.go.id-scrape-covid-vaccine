const axios = require("axios");
const cheerio = require("cheerio");

// Allow Cors
const cors = require("cors");

// Express init
const express = require("express");
const app = express();
const router = express.Router();

// serverless http
const serverless = require("serverless-http");

// port local
app.use(cors());
const port = 5000;

// base url
const url = "https://www.kemkes.go.id/";

// Configuring CORS

async function getData() {
  try {
    const vaccine = [];

    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    const trs = $(".info-case").children().eq(1).find("table>tbody").children();

    // i for : index
    // e for : element
    $(trs).each((i, e) => {
      const tds = $(e).find("td");
      const title = `${$(tds[0]).text()}`;
      const value = `${$(tds[2]).text()}`;
      vaccine[i] = { title, value };
    });

    return vaccine;
  } catch (error) {
    console.error(error);
  }
}

router.get("/", async (req, res) => {
  res.send(await getData());
});

app.use("/.netlify/functions/index", router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports.handler = serverless(app);
