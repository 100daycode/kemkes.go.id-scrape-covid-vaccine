const axios = require("axios");
const cheerio = require("cheerio");

// Express init
const express = require("express");
const app = express();
// port local
const port = 5000;

// base url
const url_kemkes = "https://www.kemkes.go.id/";
const url_bing = "https://bing.com/covid/local/indonesia?vert=vaccineTracker";

async function getDataKemkes() {
  try {
    const vaccine = {};

    const response = await axios.get(url_kemkes);

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
    // If the assertion fails, it will throw an error.
    // This error will cause done() never to get called,
    // because the code errored out before it. That's what causes the timeout.
    assert.isNotOk(error, "Promise error");
    done();
  }
}

app.get("/", async (req, res) => {
  res.send(await getDataKemkes());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
