const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, message, args) => {
    let thing = args[0].value
    if (!thing) return message.reply('Please provide item number')
    if (isNaN(thing)) return message.reply('Please provide valid item number')
    let result = await cs.buy({
        user: message.user,
        guild: message.guild,
        item: parseInt(args[0].value)
    });
    if (result.error) {
        if (result.type === 'No-Item') return message.reply('Please provide valid item number');
        if (result.type === 'Invalid-Item') return message.reply('item does not exists');
        if (result.type === 'low-money') return message.reply(`**You don't have enough balance to buy this item!**`);
    } else return message.reply(`**Successfully bought  \`${result.inventory.name}\` for $${result.inventory.price}**`)

}

module.exports.help = {
    name: "buy",
    data: {
        name: 'buy',
        description: "A way to Buy stuff from shop!",
        options: [{
            name: 'item',
            type: 'INTEGER',
            description: 'Item Number from the shop.',
            required: true,
        }]
    }
};

module.exports.conf = {
    aliases: ['b'],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}