const logger = require("../utils/logger.js");
const otherStore = require("../models/other-store");

const home = {
  async index(request, response) {
    const others = await otherStore.getOthers(undefined);
    const viewData = {
      title: "Willkommen bei OTHer!",
      others: others,
    };
    logger.debug("home rendering");
    response.render("index", viewData);
  },
};

module.exports = home;
