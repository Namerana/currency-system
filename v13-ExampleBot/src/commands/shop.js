const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, message, args) => {
    let result = await cs.getShopItems({
        guild: message.guild
    });
    let inv = result.inventory;
    const embed = new Discord.MessageEmbed()
        .setDescription('Shop!')
    for (let key in inv) {
        embed.addField(`${parseInt(key) + 1} - **${inv[key].name}:** for $${inv[key].price}`, 'Description: ' + inv[key].description)
    }
    message.reply({
        embeds: [embed]
    });
}

module.exports.help = {
    name: "shop",
    data: {
        name: 'shop',
        description: "A way to see shop",
        options: []
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}