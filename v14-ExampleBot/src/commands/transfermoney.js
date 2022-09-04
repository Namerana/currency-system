    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    module.exports.run = async (client, message, args) => {
        let user = message.options.getUser('user');
        if (user.id === message.user.id) return message.channel.send(`You can't transfer money to yourself!`);

        let amount = message.options.getInteger('amount');

        if (!amount) return message.reply("Enter amount of money to add.");
        if (String(amount).includes("-")) return message.reply("You can't send negitive money.")
        let money = parseInt(amount);

        let result = await cs.transferMoney({
            user: message.user,
            user2: user,
            guild: message.guild,
            amount: money
        });
        if (result.error) return message.reply(`You don't have enough money in your wallet.`);
        else message.reply(`**${message.user.username}**, Successfully transfered **${result.money}** to **${result.user2.username}**`)

    }

    module.exports.help = {
        name: "transfer",
        data: {
            name: 'transfer',
            description: "A way to transfer money",
            options: [{
                    name: 'amount',
                    type: 4,
                    description: 'amount to transfer',
                    required: true,
                },
                {
                    name: 'user',
                    type: 6,
                    description: 'user to trasnfer money to',
                    required: true,
                }
            ]
        }

    };

    module.exports.conf = {
        aliases: ["pay"],
        cooldown: 5 // This number is a seconds, not a milliseconds.
        // 1 = 1 seconds.
    }