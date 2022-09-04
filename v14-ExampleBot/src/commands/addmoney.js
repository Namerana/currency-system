    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
module.exports.run = async (client, message, args) => {
        let user = args[2]?.member || message.member;
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply("You do not have requied permissions.")
        let wheretoPutMoney = args.get('where_to_put_money');
        if (wheretoPutMoney) wheretoPutMoney = 'bank';
        else wheretoPutMoney = 'wallet';
        let amount = args.get('amount')
        let money = parseInt(amount);
        let result = await cs.addMoney({
            user: user,
            guild: message.guild,
            amount: money,
            wheretoPutMoney: wheretoPutMoney
        });
        if (result.error) return message.reply("You cant add negitive money");
        else message.reply(`Successfully added $${money} to ${user.user.username}, ( in ${wheretoPutMoney} )`)
    }

    module.exports.help = {
        name: "addmoney",
        data: {
            name: 'addmoney',
            description: "A way to add the amount  of money in your bank or wallet.",
            options: [{
                    name: 'amount',
                    type: 4,
                    description: 'Amount of money you want to add.',
                    required: true,
                },
                {
                    name: 'where_to_put_money',
                    type: 5,
                    description: 'TRUE means bank, FALSE means wallet.',
                    required: true,
                },
                {
                    name: 'user',
                    type: 6,
                    description: 'The user you want to add money to.',
                    required: false,
                }
            ]
        }
    }