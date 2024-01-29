const userStore = require("../models/user-store.js");
const logger = require("../utils/logger.js");

const accounts = {
    login(request, response) {
        const viewData = {
            title: "Login in OTHer"
        };
        logger.debug("login rendering");
        response.render("login", viewData);
    },
    logout(request, response) {
      request.session.destroy();
        logger.debug("logout and redirect to home");
      response.redirect("/");
    },
    signup(request, response) {
        const viewData = {
            title: "Registrieren für OTHer"
        };
        logger.debug("register rendering");
        response.render("register", viewData);
    },
    async register(request, response) {
        const user = request.body;
        const success = await userStore.addUser(user);
        logger.debug("Registered user", user);
        if(success)
            response.redirect("/login");
        else
            response.redirect("/signup");
    },
    async authenticate(request, response) {
        let user = await userStore.authenticateUser(request.body.username, request.body.password);
        if (user) {
            request.session.user = user.id;
            logger.debug("User successfully authenticated and added to session", user);
            response.redirect("/dashboard");
        } else {
            logger.debug("No user authenticated");
            response.redirect("/login");
        }
    },
    async getCurrentUser(request) {
        // user name is unique
        const user = request.session.user;
        return await userStore.getUserByName(user);
    }
};

module.exports = accounts;