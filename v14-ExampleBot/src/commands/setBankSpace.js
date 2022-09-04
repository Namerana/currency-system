const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, message, args) => {
    const user = message.options.getUser('user') || message.user;

    let result = await cs.setBankSpace(user.id, message.guild.id, message.options.getInteger('amount') || 0);
    if (result.error) {
        if (result.type === 'no-amount-provided') return message.reply('Please provide number to setBank Limit to.');
        else return message.reply('Something went wrong., maybe same amount provided');
    } else return message.reply(`Successfully set Bank Limit of ${user.tag} to ${result.amount}`)

}

module.exports.help = {
    name: "setbankspace",
    data: {
        name: 'setbankspace',
        description: "A way to know the amount  of money in your bank.",
        options: [{
            name: 'user',
            type: 6,
            description: 'The user you want to set bank space of..',
            required: true,
        }, {
            name: 'amount',
            type: 4,
            description: 'Amount fo bank space you want to set.',
            required: true,
        }]
    }
}

module.exports.conf = {
    aliases: ["sets"],
    cooldown: 5
}