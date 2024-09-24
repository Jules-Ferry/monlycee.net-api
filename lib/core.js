const path = require("path")
const puppeteer = require("puppeteer-core")
const htmlparser = require("node-html-parser")
const BASE_URL = "https://psn.monlycee.net"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function extractJSON(data) {
    const html = htmlparser.parse(data)
    return JSON.parse(html.querySelector("pre").innerText)
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
                const content = extractJSON(await page.content())
                page.close()
                return content
            },
            getServices: async () => {
                await page.goto(`${BASE_URL}/user/services`)
                const content = extractJSON(await page.content())
                page.close()
                return content
            },
            getLinks: async () => {
                await page.goto(`${BASE_URL}/user/links`)
                const content = extractJSON(await page.content())
                page.close()
                return content
            }
        },
        news: {
            getMessages: async () => {
                await page.goto(`${BASE_URL}/news/messages`)
                const content = extractJSON(await page.content())
                page.close()
                return content
            }
        },
        timeline: {
            getFlashMessages: async () => {
                await page.goto(`${BASE_URL}/timeline/flash-messages`)
                const content = extractJSON(await page.content())
                page.close()
                return content
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