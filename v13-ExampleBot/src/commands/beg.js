const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, message, args) => {

    let result = await cs.beg({
        user: message.user,
        guild: message.guild,
        minAmount: 100,
        maxAmount: 400,
        cooldown: 10 // 60 seconds

    });
    if (result.error) return message.reply(`You have begged recently Try again in ${result.time}`);
    else message.reply(`You have earned $${result.amount}.`)
}

module.exports.help = {
    name: "beg",
    data: {
        name: "beg",
        description: "a way to earn money, beg",
        options: []
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}