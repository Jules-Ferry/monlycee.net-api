const MonLyceeAPI = require("./lib/core")
const config = require("./config.json")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
    const session = await MonLyceeAPI.login(config.identifiant, config.password)
    const profile = await session.user.getProfile()
    console.log(profile)
    await session.logout()
}

main()