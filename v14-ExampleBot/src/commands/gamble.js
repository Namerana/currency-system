    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    module.exports.run = async (client, message, args) => {

        let money = args[0].value
        if (isNaN(money)) return message.reply("Amount is not a number.");

        let result = await cs.gamble({
            user: message.user,
            guild: message.guild,
            amount: money,
            minAmount: 1,
            cooldown: 25 //25 seconds
        });
        if (result.error) {
            if (result.type == 'amount') return message.reply("Please insert an amount first.");
            if (result.type == 'nan') return message.reply("The amount was not a number.");
            if (result.type == 'low-money') return message.reply(`You don't have enough money. You need ${result.neededMoney}$ more to perform the action. `);
            if (result.type == 'gamble-limit') return message.reply(`You don't have enough money for gambling. The minimum was $${result.minAmount}.`);
            if (result.type == 'time') return message.reply(`Wooo that is too fast. You need to wait **${result.second}** second(s) before you can gamble again.`);
        } else {
            if (result.type == 'lost') return message.reply(`Ahh, no. You lose $${result.amount}. You've $${result.wallet} left. Good luck next time.`);
            if (result.type == 'won') return message.reply(`Woohoo! You won $${result.amount}! You've $${result.wallet}. Good luck, have fun!`);
        }
    }

    module.exports.help = {
        name: "gamble",
        data: {
            name: 'gamble',
            description: "An efficient way to double your money.",
            options: [{
                name: 'amount',
                type: 4,
                description: 'Amount of money you want to gamble.',
                required: true,
            }]
        }
    }

    module.exports.conf = {
        aliases: ["gambling"],
        cooldown: 5
    }