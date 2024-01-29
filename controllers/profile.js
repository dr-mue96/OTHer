const logger = require("../utils/logger.js");
const otherStore = require("../models/other-store");
const userStore = require("../models/user-store");
const accounts = require("./accounts");
const upload = require("../utils/upload");

const profile = {
    async index(request, response) {
        const username = request.params.username;
        const loggedInUser = await accounts.getCurrentUser(request);
        // redirection to profile page of logged in user if no user is specified
        if(!username)
            response.redirect("/profile/" + loggedInUser.name);
        // check if requested profile page is the one of the logged in user
        const isItMe = username === loggedInUser.name;
        const user = await userStore.getUserByName(username);
        const others = await otherStore.getOthersByUserName(username);
        // for correct display of singular and plural for number of others
        const oneOrMoreOthers = others.length === 1 ? 'OTHer' : 'OTHers';
        const followStatistic = await userStore.getFollowStatistic(username);
        const viewData = {
            title: "Nutzerprofil",
            user: user,
            others: others,
            loggedInUser: loggedInUser,
            numOthers: others.length,
            oneOrMore: oneOrMoreOthers,
            followStatistic: followStatistic,
            isItMe: isItMe,
        };
        logger.debug("profile rendering", user);
        response.render("profile", viewData);
    },
    async uploadImg(request, response) {
        // check if image is selected for upload and give it to util upload, if successful update profile pic path
        const loggedInUser = await accounts.getCurrentUser(request);
        if (request.files != null) {
            const success = await upload.uploadImg(request, response);
            if (success == true) {
                await userStore.updateImg(loggedInUser.user_id, request.files.sampleFile.name.split(".")[0]);
            }
        }
        response.redirect("/profile/" + loggedInUser.name);
    },
};

module.exports = profile;