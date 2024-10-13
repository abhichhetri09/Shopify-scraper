"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeShopifyStyles = scrapeShopifyStyles;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
function scrapeShopifyStyles(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch the HTML of the product page
            const { data } = yield axios_1.default.get(url);
            const $ = cheerio_1.default.load(data);
            // Scrape fonts used on the page
            const fonts = [];
            $('link[rel="stylesheet"]').each((i, elem) => {
                const href = $(elem).attr("href");
                if (href) {
                    // Add font styles here
                    // This example assumes the stylesheet contains font information
                    if (href.includes("google")) {
                        // Check if the URL is a Google font link
                        const familyMatch = href.match(/family=([^&]*)/);
                        const weightMatch = href.match(/wght@(\d+)/);
                        fonts.push({
                            family: familyMatch
                                ? decodeURIComponent(familyMatch[1].replace(/\+/g, " "))
                                : "",
                            variants: weightMatch ? weightMatch[1] : "",
                            letterSpacings: "0.01em", // Default letter spacing, adjust as necessary
                            fontWeight: weightMatch ? weightMatch[1] : "400", // Default font weight
                            url: href.startsWith("http") ? href : `https:${href}`, // Handle relative URLs
                        });
                    }
                }
            });
            // Scrape styles for the primary button
            const buttonStyles = $('form[action*="/cart/add"] button').first(); // Get the first button
            const primaryButton = {
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
            };
            return { fonts, primaryButton };
        }
        catch (error) {
            console.error("Error scraping Shopify page:", error);
            throw new Error("Error scraping Shopify page");
        }
    });
}
