const logger = require("../utils/logger.js");
const userStore = require("../models/user-store.js");
const accounts = require("./accounts");

const users = {
    async index(request, response) {
        const loggedInUser = await accounts.getCurrentUser(request);
        const users = await userStore.getUsers(loggedInUser.user_id);
        const viewData = {
            title: " Registrierte Nutzer",
            loggedInUser: loggedInUser,
            users: users,
        };
        logger.debug("users rendering");
        response.render("users", viewData);
    },
    async follow(request, response) {
        // calls follow or unfollow function depending on a user already follows another one or not
        const loggedInUser = await accounts.getCurrentUser(request);
        const followerId = loggedInUser.user_id;
        const followedId = request.params.userid;
        const is_following = parseInt(request.params.followed);
        if(is_following === 1) {
            await userStore.unfollow(followedId, followerId);
            logger.info(followerId, "unfollows user", followedId);
        } else {
            await userStore.follow(followedId, followerId);
            logger.info(followerId, "follows user", followedId);
        }
        response.redirect("/users");
    },
    async search(request, response) {
        // renders users page with the results of the search for any users
        const loggedInUser = await accounts.getCurrentUser(request);
        const searchFor = request.body.searchfor;
        const users = await userStore.searchUsers(loggedInUser.user_id, searchFor);
        const viewData = {
            title: "Suchergebnisse",
            loggedInUser: loggedInUser,
            users: users,
        };
        logger.debug("search rendering");
        response.render("users", viewData);
    },
};

module.exports = users;