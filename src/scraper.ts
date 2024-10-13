import axios from "axios"
import { load } from "cheerio"

interface Font {
  family: string
  variants: string
  letterSpacings: string
  fontWeight: string
  url: string
}

interface PrimaryButton {
  fontFamily: string
  fontSize: string
  lineHeight: string
  letterSpacing: string
  textTransform: string
  textDecoration: string
  textAlign: string
  backgroundColor: string
  color: string
  borderColor: string
  borderWidth: string
  borderRadius: string
}

interface ScrapedData {
  fonts: Font[]
  primaryButton: PrimaryButton
}

async function scrapeShopifyStyles(url: string): Promise<ScrapedData> {
  try {
    // Fetch the HTML of the product page
    const { data } = await axios.get(url)
    const $ = load(data)

    // Scrape fonts used on the page
    const fonts: Font[] = []
    $('link[rel="stylesheet"]').each((i, elem) => {
      const href = $(elem).attr("href")
      if (href) {
        // Add font styles here
        // This example assumes the stylesheet contains font information
        if (href.includes("google")) {
          // Check if the URL is a Google font link
          const familyMatch = href.match(/family=([^&]*)/)
          const weightMatch = href.match(/wght@(\d+)/)

          fonts.push({
            family: familyMatch
              ? decodeURIComponent(familyMatch[1].replace(/\+/g, " "))
              : "",
            variants: weightMatch ? weightMatch[1] : "",
            letterSpacings: "0.01em", // Default letter spacing, adjust as necessary
            fontWeight: weightMatch ? weightMatch[1] : "400", // Default font weight
            url: href.startsWith("http") ? href : `https:${href}`, // Handle relative URLs
          })
        }
      }
    })

    // Scrape styles for the primary button
    const buttonStyles = $('form[action*="/cart/add"] button').first() // Get the first button

    const primaryButton: PrimaryButton = {
      fontFamily: buttonStyles.css("font-family") || "",
      fontSize: buttonStyles.css("font-size") || "",
      lineHeight: buttonStyles.css("line-height") || "",
      letterSpacing: buttonStyles.css("letter-spacing") || "",
      textTransform: buttonStyles.css("text-transform") || "",
      textDecoration: buttonStyles.css("text-decoration") || "",
      textAlign: buttonStyles.css("text-align") || "",
      backgroundColor: buttonStyles.css("background-color") || "",
      color: buttonStyles.css("color") || "",
      borderColor: buttonStyles.css("border-color") || "",
      borderWidth: buttonStyles.css("border-width") || "",
      borderRadius: buttonStyles.css("border-radius") || "",
    }

    return { fonts, primaryButton }
  } catch (error) {
    // Improved error handling
    if (axios.isAxiosError(error)) {
      console.error(
        "Error scraping Shopify page:",
        error.response?.data || error.message
      )
    } else {
      console.error("Error scraping Shopify page:", error)
    }
    throw new Error("Error scraping the Shopify page")
  }
}

export { scrapeShopifyStyles }
