const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const cheerio = require("cheerio");
const getUrls = require("get-urls");
const fetch = require("node-fetch");

exports.scraper = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    const body = JSON.parse(request.body);
    const url = Buffer.from(body.encoding, "base64").toString();
    // const data = await scrapeMetatags(url);
    const data = await scrapePost(url);

    response.send(data);
  });
});

const scrapePost = async (url) => {
  const res = await fetch(url);

  const html = await res.text();
  const $ = cheerio.load(html);

  const getMetatag = (name) =>
    $(`meta[name=${name}]`).attr("content") ||
    $(`meta[name="og:${name}"]`).attr("content") ||
    $(`meta[name="twitter:${name}"]`).attr("content");

  const text = $("p")
    .toArray()
    .map((x) => $(x).text())
    .filter((p) => p.length > 56);
  console.log(text);

  const result = {
    url,
    title: $("title").first().text(),
    favicon: $('link[rel="shortcut icon"]').attr("href"),
    // description: $('meta[name=description]').attr('content'),
    description: getMetatag("description"),
    image: getMetatag("image"),
    author: getMetatag("author"),
    text: text,
  };
  return result;
};

const scrapeMetatags = async (url) => {
  const res = await fetch(url);

  const html = await res.text();
  const $ = cheerio.load(html);

  const getMetatag = (name) =>
    $(`meta[name=${name}]`).attr("content") ||
    $(`meta[name="og:${name}"]`).attr("content") ||
    $(`meta[name="twitter:${name}"]`).attr("content");

  const result = [
    {
      url,
      title: $("title").first().text(),
      favicon: $('link[rel="shortcut icon"]').attr("href"),
      // description: $('meta[name=description]').attr('content'),
      description: getMetatag("description"),
      image: getMetatag("image"),
      author: getMetatag("author"),
    },
  ];
  // console.log("RESULT:", result);
  return result;
};
