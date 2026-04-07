require("dotenv").config();

const puppeteer = require("puppeteer");
const crawlQueue = require("../queue/queue");
const pool = require("../db/db");

let browser;

// ✅ đảm bảo browser luôn sẵn sàng
async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log(" Browser started");
  }
  return browser;
}

crawlQueue.process(5, async (job) => {
  const { page } = job.data;

  try {
    console.log(" Scraping page:", page);

    const browser = await initBrowser();
    const newPage = await browser.newPage();

    const url = `https://scrapingtest.com/ecommerce/pagination?page=${page}`;

    await newPage.goto(url, {
        waitUntil: "domcontentloaded",
    });

    await newPage.waitForSelector(".product-card", { timeout: 15000 });

    const products = await newPage.evaluate(() => {
        return Array.from(document.querySelectorAll(".product-card")).map((el) => ({
            name: el.querySelector(".product-title")?.innerText.trim(),

            price: el
                .querySelector(".product-price")
                ?.innerText.replace(/[^0-9.]/g, ""),
        }));
    });

    await newPage.close();

    for (const p of products) {
      await pool.query(
        `INSERT INTO products(name, price)
         VALUES($1, $2)
         ON CONFLICT (name, price) DO NOTHING`,
        [p.name, p.price]
      );
    }

    console.log(` Page ${page}: ${products.length} products`);
    return products.length;

  } catch (err) {
    console.error(` Error scraping page ${page}:`, err.message);
    throw err; // để Bull retry
  }
});