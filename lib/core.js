const path = require("path")
const puppeteer = require("puppeteer")
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
        headless: "shell"
    })
    const page = await browser.newPage()
    page.goto(`${BASE_URL}`)
    await page.waitForSelector("#username")
    await page.type("#username", username)
    await page.type("#password", password)
    await sleep(200)
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
                return content
            },
            getServices: async () => {
                await page.goto(`${BASE_URL}/user/services`)
                const content = extractJSON(await page.content())
                return content
            },
            getLinks: async () => {
                await page.goto(`${BASE_URL}/user/links`)
                const content = extractJSON(await page.content())
                return content
            }
        },
        news: {
            getMessages: async () => {
                await page.goto(`${BASE_URL}/news/messages`)
                const content = extractJSON(await page.content())
                return content
            }
        },
        timeline: {
            getFlashMessages: async () => {
                await page.goto(`${BASE_URL}/timeline/flash-messages`)
                const content = extractJSON(await page.content())
                return content
            }
        },
        logout: async () => {
            await page.goto(`${BASE_URL}/oauth2/sign_out?rd=https%3A%2F%2Fauth.monlycee.net%2Frealms%2FIDF%2Fprotocol%2Fopenid-connect%2Flogout?client_id=psn-web-een%26post_logout_redirect_uri=https%3A%2F%2Fmonlycee.net`)
            await sleep(2)
            process.kill(browser.process().pid)
        }
    }
}

module.exports.login = login