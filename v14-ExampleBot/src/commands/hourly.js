const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, message, args) => {

    let result = await cs.hourly({
        user: message.user,
        guild: message.guild,
        amount: 100,
    });
    if (result.error) return message.reply(`You have used hourly recently Try again in ${result.time}`);
    else return message.reply(`You have earned $${result.amount}. Your streak is now ${result.rawData.streak.hourly}`);
}

module.exports.help = {
    name: "hourly",
    data: {
        name: 'hourly',
        description: "a way to earn money, hourly",
        options: []
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}