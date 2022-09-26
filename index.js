const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replacetemplate");

///////////////////////////////////////////////BLOCKING CODE///////////////////////////////////////
// fs.readFile("./txt/final.txt", "utf-8", (err, data) => {
//   console.log(data);
// });

// const test = "this is a test script to write into final http skkshhff";

// fs.writeFile("./txt/final.txt", test, "utf-8", (err) => {
//   console.log(err);
// });

///////////////////////////////////////////////UNBLOCKING CODE///////////////////////////////////////

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCards = fs.readFileSync(
  `${__dirname}/templates/template-cards.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCards, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //API PAGE
  } else if (pathName === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "newton said there's nothing to be found here!",
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen("3000", () => {
  console.log("listening to request on port 3000...");
});
