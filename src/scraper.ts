import puppeteer from "puppeteer";

interface Font {
  family: string;
  variants: string;
  letterSpacings: string;
  fontWeight: string;
  url: string;
}

interface PrimaryButton {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  textDecoration: string;
  textAlign: string;
  backgroundColor: string;
  color: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
}

interface ScrapedData {
  fonts: Font[];
  primaryButton: PrimaryButton;
}

async function scrapeShopifyStyles(url: string): Promise<ScrapedData> {
  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the Shopify page and wait for the network to be idle (JavaScript fully loaded)
    await page.goto(url, { waitUntil: "networkidle0" });

    // Extract the styles and fonts using Puppeteer
    const result = await page.evaluate(() => {
      const fonts: Font[] = [];

      // Scrape Google Fonts
      document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.includes("google")) {
          const familyMatch = href.match(/family=([^&]*)/);
          const weightMatch = href.match(/wght@(\d+)/);
          fonts.push({
            family: familyMatch
              ? decodeURIComponent(familyMatch[1].replace(/\+/g, " "))
              : "",
            variants: weightMatch ? weightMatch[1] : "",
            letterSpacings: "0.01em", // Default letter spacing
            fontWeight: weightMatch ? weightMatch[1] : "400", // Default font weight
            url: href.startsWith("http") ? href : `https:${href}`,
          });
        }
      });

      // Scrape Primary Button Styles
      const button = document.querySelector('form[action*="/cart/add"] button');
      const primaryButton: PrimaryButton = button
        ? {
            fontFamily: getComputedStyle(button).fontFamily || "",
            fontSize: getComputedStyle(button).fontSize || "",
            lineHeight: getComputedStyle(button).lineHeight || "",
            letterSpacing: getComputedStyle(button).letterSpacing || "",
            textTransform: getComputedStyle(button).textTransform || "",
            textDecoration: getComputedStyle(button).textDecoration || "",
            textAlign: getComputedStyle(button).textAlign || "",
            backgroundColor: getComputedStyle(button).backgroundColor || "",
            color: getComputedStyle(button).color || "",
            borderColor: getComputedStyle(button).borderColor || "",
            borderWidth: getComputedStyle(button).borderWidth || "",
            borderRadius: getComputedStyle(button).borderRadius || "",
          }
        : {
            fontFamily: "",
            fontSize: "",
            lineHeight: "",
            letterSpacing: "",
            textTransform: "",
            textDecoration: "",
            textAlign: "",
            backgroundColor: "",
            color: "",
            borderColor: "",
            borderWidth: "",
            borderRadius: "",
          };

      return { fonts, primaryButton };
    });

    // Close the browser
    await browser.close();

    return result;
  } catch (error) {
    console.error("Error scraping Shopify page:", error);
    throw new Error("Error scraping the Shopify page.");
  }
}

export { scrapeShopifyStyles };
