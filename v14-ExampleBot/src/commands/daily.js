const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, message, args) => {
  let result = await cs.daily({
    user: message.user,
    guild: message.guild,
    amount: 100,
  });
  if (result.error)
    return message.reply(
      `You have used daily recently Try again in ${result.time}`
    );
  else
    message.reply(
      `You have earned $${result.amount}. Your streak is now ${result.rawData.streak.daily}`
    );
};

module.exports.help = {
  name: "daily",
  data: {
    name: "daily",
    description: "A way to Earn Money!",
    options: [],
  },
};

module.exports.conf = {
  aliases: [],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
