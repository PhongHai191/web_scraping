const puppeteer = require("puppeteer");

async function scrapePage(pageNumber) {
  const browser = await puppeteer.launch({
    headless: "new", 
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const url = `https://scrapingtest.com/ecommerce/pagination?page=${pageNumber}`;
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitForSelector(".product");

  const products = await page.evaluate(() => {
    const items = document.querySelectorAll(".product");

    return Array.from(items).map((el) => {
      const name =
        el.querySelector(".product-name")?.innerText.trim() || "";
      const price =
        el.querySelector(".product-price")?.innerText.trim() || "";

      return { name, price };
    });
  });

  await browser.close();

  return products;
}

module.exports = { scrapePage };