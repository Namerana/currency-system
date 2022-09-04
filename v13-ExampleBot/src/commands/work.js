    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    module.exports.run = async (client, message, args) => {

        let result = await cs.work({
            user: message.user,
            guild: message.guild,
            maxAmount: 100,
            replies: ['Programmer', 'Builder', 'Waiter', 'Busboy', 'Chief', 'Mechanic'],
            cooldown: 25 //25 seconds,

        });
        if (result.error) return message.reply(`You have already worked recently Try again in ${result.time}`);
        else message.reply(`You worked as a ${result.workType} and earned $${result.amount}. your streak is ${result.rawData.streak.weekly}`)
    }

    module.exports.help = {
        name: "work",
        data: {
            name: 'work',
            description: "A way to earn money",
            options: []
        }
    };

    module.exports.conf = {
        aliases: ["wk", "wr"],
        cooldown: 5 // This number is a seconds, not a milliseconds.
        // 1 = 1 seconds.
    }