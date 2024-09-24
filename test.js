const MonLyceeAPI = require("./lib/core")
const config = require("./config.json")

async function main() {
    const session = await MonLyceeAPI.login(config.identifiant, config.password)
    const profile = await session.user.getProfile()
    console.log(profile)
}

main()