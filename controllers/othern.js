const logger = require("../utils/logger.js");
const otherStore = require("../models/other-store.js");
const accounts = require("./accounts");

const othern = {
    async index(request, response) {
        const loggedInUser = await accounts.getCurrentUser(request);
        const viewData = {
            title: "Othern",
            loggedInUser: loggedInUser,
        };
        logger.debug("othern rendering");
        response.render("othern", viewData);
    },
    async postOther(request, response) {
        // create new other and give it to the other store
        const loggedInUser = await accounts.getCurrentUser(request);
        const newOther = {
            userid: loggedInUser.user_id,
            text: request.body.message,
        };
        logger.debug("Creating new other", newOther);
        await otherStore.addOther(newOther);
        response.redirect("/dashboard");
    },
    async deleteOther(request, response) {
        // delete other by post_id
        const otherId = request.params.otherid;
        await otherStore.removeOther(otherId);
        logger.debug("Deleted Other with id", otherId);
        response.redirect("/dashboard");
    },
};

module.exports = othern;