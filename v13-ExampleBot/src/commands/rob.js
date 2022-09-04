    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    module.exports.run = async (client, message, args) => {
        let user = args[0].user
        if (user.bot || user === client.user) return message.reply("This user is a bot.");
        if (!user) return message.reply('Sorry, you forgot to mention somebody.');

        let result = await cs.rob({
            user: message.user,
            user2: user,
            guild: message.guild,
            minAmount: 100,
            successPercentage: 5,
            cooldown: 25, //25 seconds,
            maxRob: 1000
        });
        if (result.error) {
            if (result.type === 'time') return message.reply(`You have already robbed recently Try again in ${result.time}`);
            if (result.type === 'low-money') return message.reply(`You need atleast $${result.minAmount} to rob somebody.`);
            if (result.type === 'low-wallet') return message.reply(`${result.user2.username} have less than $${result.minAmount} to rob.`)
            if (result.type === 'caught') return message.reply(`${message.user.username} you robbed ${result.user2.username} and got caught and you payed ${result.amount} to ${result.user2.username}!`)
        } else {
            if (result.type === 'success') return message.reply(`${message.user.username} you robbed ${result.user2.username} and got away with ${result.amount}!`)

        }

    }

    module.exports.help = {
        name: "rob",
        data: {
            name: 'rob',
            description: "A way to earn money",
            options: [{
                name: 'user',
                type: 'USER',
                description: 'The user you want to rob..',
                required: true,
            }]
        }
    };

    module.exports.conf = {
        aliases: [],
        cooldown: 5 // This number is a seconds, not a milliseconds.
        // 1 = 1 seconds.
    }