import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { scrapeShopifyStyles } from "./scraper"

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Define a type for the request body
interface ScrapeRequestBody {
  url: string
}

// Define a route to scrape Shopify styles
app.post(
  "/scrape",
  async (req: Request<{}, {}, ScrapeRequestBody>, res: Response) => {
    const { url } = req.body

    if (!url) {
      return res.status(400).json({ error: "Please provide a valid URL." })
    }

    try {
      const result = await scrapeShopifyStyles(url)
      return res.json(result)
    } catch (error) {
      console.error(error) // Optional: Log the error for debugging
      return res.status(500).json({ error: "Error scraping the Shopify page." })
    }
  }
)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
