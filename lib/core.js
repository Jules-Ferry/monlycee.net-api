const path = require("path")
const puppeteer = require("puppeteer-core")
const cheerio = require("cheerio")

const BASE_URL = "https://psn.monlycee.net"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function extractJSON(data) {
    const html = cheerio.load(data)
    return html("pre").text()
}

async function login(username, password) {
    const browser = await puppeteer.launch({
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: false
    })
    const page = await browser.newPage()
    page.goto(`${BASE_URL}`)
    await page.waitForSelector("#username")
    await page.type("#username", username)
    await page.type("#password", password)
    await sleep(2000)
    await page.click("input[type=submit]")
    return {
        getConfig: async () => {
            await page.goto(`${BASE_URL}/config`)
            return page.content()
        },
        user: {
            getProfile: async () => {
                await page.goto(`${BASE_URL}/user/profile`)
                return extractJSON(page.content())
            },
            getServices: async () => {
                await page.goto(`${BASE_URL}/user/services`)
                return page.content()
            },
            getLinks: async () => {
                await page.goto(`${BASE_URL}/user/links`)
                return page.content()
            }
        },
        news: {
            getMessages: async () => {
                await page.goto(`${BASE_URL}/news/messages`)
                return page.content()
            }
        },
        timeline: {
            getFlashMessages: async () => {
                await page.goto(`${BASE_URL}/timeline/flash-messages`)
                return page.content()
            }
        },
        logout: async () => {
            await page.goto(`${BASE_URL}`)
            await page.click("a[href^=\"https://psn.monlycee.net/oauth2/sign_out\"]")
            await browser.close()
            return true
        }
    }
}

module.exports.login = login