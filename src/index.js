/**
 * @author Silent-Coder
 * @license Apache-2.0
 * @copyright Silent-Coder
 * @file index.js
 */

const {
  findUser,
  getInventory,
  connect,
  event,
} = require("./functions/global");
/**
 * @class CurrencySystem
 */
class CurrencySystem {
  setMongoURL(password, toLog = true) {
    if (!password.startsWith("mongodb"))
      throw new TypeError("Invalid MongoURL");
    connect(password, toLog);
    process.mongoURL = password;
    event.emit(
      "debug",
      `[ CS => Debug ] : Successfully saved MongoDB URL ( Used in Shop Functions )`
    );
  }

  async buy(settings) {
    return await _buy(settings);
  }

  async addUserItem(settings) {
    return await _buy(settings);
  }

  async addItem(settings) {
    if (!settings.inventory)
      return {
        error: true,
        type: "No-Inventory",
      };
    if (!settings.inventory.name)
      return {
        error: true,
        type: "No-Inventory-Name",
      };
    if (!settings.inventory.price)
      return {
        error: true,
        type: "No-Inventory-Price",
      };
    if (!parseInt(settings.inventory.price))
      return {
        error: true,
        type: "Invalid-Inventory-Price",
      };
    const item = {
      name: String(settings.inventory.name) || "Air",
      price: parseInt(settings.inventory.price) || 0,
      description: String(settings.inventory.description) || "No Description",
    };
    if (typeof settings.guild === "string")
      settings.guild = {
        id: settings.guild,
      };
    if (!settings.guild)
      settings.guild = {
        id: null,
      };
    require("./models/inventory").findOneAndUpdate(
      {
        guildID: settings.guild.id || null,
      },
      {
        $push: {
          inventory: item,
        },
      },
      {
        upsert: true,
        useFindAndModify: false,
      },
      (e, d) => {
        if (e) return console.log(e);
      }
    );

    return {
      error: false,
      item: item,
    };
  }
  async removeItem(settings) {
    let inventoryData = await getInventory(settings);

    let thing = parseInt(settings.item);
    if (!thing)
      return {
        error: true,
        type: "Invalid-Item-Number",
      };
    thing = thing - 1;
    if (!inventoryData.inventory[thing])
      return {
        error: true,
        type: "Unknown-Item",
      };
    const deletedDB = inventoryData.inventory[thing];
    inventoryData.inventory.splice(thing, 1);
    inventoryData.save();
    return {
      error: false,
      inventory: deletedDB,
    };
  }
  async setItems(settings) {
    // let inventoryData = await getInventory(settings);

    if (!settings.shop)
      return {
        error: true,
        type: "No-Shop",
      };
    if (!Array.isArray(settings.shop))
      return {
        error: true,
        type: "Invalid-Shop",
      };
    for (const x of settings.shop) {
      if (!x.name)
        return {
          error: true,
          type: "Invalid-Shop-name",
        };
      if (!x.price)
        return {
          error: true,
          type: "Invalid-Shop-price",
        };
      if (!x.description) x.description = "No Description.";
    }
    require("./models/inventory").findOneAndUpdate(
      {
        guildID: settings.guild.id || null,
      },
      {
        $set: {
          inventory: settings.shop,
        },
      },
      {
        upsert: true,
        useFindAndModify: false,
      },
      (e, d) => {
        if (e) return console.log(e);
      }
    );
    return {
      error: false,
      type: "success",
    };
  }
  async removeUserItem(settings) {
    let data = await findUser(settings, null, null, "removeUserItem");

    let thing = parseInt(settings.item);
    if (!thing)
      return {
        error: true,
        type: "Invalid-Item-Number",
      };
    thing = thing - 1;
    if (!data.inventory[thing])
      return {
        error: true,
        type: "Unknown-Item",
      };
    let done = false,
      deletedDB = {};

    for (let i in data.inventory) {
      if (data.inventory[i] === data.inventory[thing]) {
        if (data.inventory[i].amount > 1) {
          data.inventory[i].amount--;
          deletedDB = data.inventory[i];
          done = true;
        } else if (data.inventory[i].amount === 1) {
          deletedDB = data.inventory[i];
          deletedDB.amount = 0;
          data.inventory.splice(i, 1);
          done = true;
        }
      }
    }

    if (done == false)
      return {
        error: true,
        type: "Invalid-Item-Number",
      };

    require("./models/currency").findOneAndUpdate(
      {
        guildID: settings.guild.id || null,
        userID: settings.user.id || null,
      },
      {
        $set: {
          inventory: data.inventory,
        },
      },
      {
        upsert: true,
        useFindAndModify: false,
      },
      (e, d) => {
        if (e) return console.log(e);
      }
    );

    return {
      error: false,
      inventory: deletedDB,
      rawData: data,
    };
  }
}

Object.assign(CurrencySystem.prototype, require("./functions/global"));
module.exports = CurrencySystem;

// function _getDbURL() {
//   let url = process.mongoURL;
//   if (require("mongoose").connections.length)
//     url = require("mongoose").connections[0]._connectionString;
//   return url;
// }
module.exports.cs = event;

async function _buy(settings) {
  event.emit("debug", `[ CS => Debug ] : Buy Function is Executed.`);
  let inventoryData = await getInventory(settings);
  event.emit("debug", `[ CS => Debug ] : Fetching Inventory. ( Buy Function )`);

  event.emit("debug", `[ CS => Debug ] : Fetching User ( Buy Function )`);
  let data = await findUser(settings, null, null, "buy");

  if (!settings.guild)
    settings.guild = {
      id: null,
    };
  let thing = parseInt(settings.item);
  if (!thing)
    return {
      error: true,
      type: "No-Item",
    };
  thing = thing - 1;
  if (!inventoryData.inventory[thing])
    return {
      error: true,
      type: "Invalid-Item",
    };

  if (data.wallet < inventoryData.inventory[thing].price)
    return {
      error: true,
      type: "low-money",
    };
  data.wallet -= inventoryData.inventory[thing].price;
  let done = false;
  let makeItem = true;

  for (let j in data.inventory) {
    if (inventoryData.inventory[thing].name === data.inventory[j].name)
      makeItem = false;
  }

  if (makeItem == false) {
    for (let j in data.inventory) {
      if (inventoryData.inventory[thing].name === data.inventory[j].name) {
        data.inventory[j].amount++;
        done = true;
      }
    }
  }

  if (done == false) {
    data.inventory.push({
      name: inventoryData.inventory[thing].name,
      amount: 1,
    });
  }
  require("./models/currency").findOneAndUpdate(
    {
      guildID: settings.guild.id || null,
      userID: settings.user.id || null,
    },
    {
      $set: {
        inventory: data.inventory,
        wallet: data.wallet,
      },
    },
    {
      upsert: true,
      useFindAndModify: false,
    },
    (e, d) => {
      if (e) return console.error(e);
    }
  );
  event.emit("debug", `[ CS => Debug ] : Updating Inventory ( Buy Function )`);
  return {
    error: false,
    type: "success",
    inventory: inventoryData.inventory[thing],
  };
}
