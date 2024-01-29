const logger = require("../utils/logger.js");
const otherStore = require("../models/other-store.js");
const accounts = require("./accounts.js");
const trend = require("../utils/trends.js");

const dashboard = {
    async index(request, response) {
        const loggedInUser = await accounts.getCurrentUser(request);
        const others = await otherStore.getOthers(loggedInUser.name);
        const trends = await trend.getTrends(others);
        const viewData = {
            title: "Willkommen bei OTHer",
            loggedInUser: loggedInUser,
            others: others,
            trends: trends,
        };
        logger.debug("dashboard rendering");
        response.render("dashboard", viewData);
    },
};

module.exports = dashboard;