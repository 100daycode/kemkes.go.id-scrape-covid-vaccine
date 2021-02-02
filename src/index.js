const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://www.kemkes.go.id/";

axios.get(url).then((response) => {
  const vaccine = [];

  const $ = cheerio.load(response.data);

  const trs = $(".info-case").children().eq(1).find("table>tbody").children();
  $(trs).each((i, e) => {
    const tds = $(e).find("td");

    vaccine.push(`${$(tds[0]).text()} : ${$(tds[2]).text()}`);
  });

  console.log(vaccine);
});