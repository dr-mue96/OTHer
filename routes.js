const express = require("express");
const router = express.Router();

const home = require("./controllers/home.js");
const dashboard = require("./controllers/dashboard.js");
const users = require("./controllers/users.js");
const accounts = require("./controllers/accounts.js");
const profile = require("./controllers/profile.js");
const othern = require("./controllers/othern.js")

const auth = require("./utils/auth.js");

// non-protected routes
router.get("/", home.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

// protected routes
router.get("/dashboard", auth.protected, dashboard.index);
router.get("/users", auth.protected, users.index);
router.post("/users/follow/:userid/:followed", auth.protected, users.follow);
router.get("/profile", auth.protected, profile.index);
router.get("/profile/:username", auth.protected, profile.index);
router.get("/othern", auth.protected, othern.index);
router.post("/othern/other", auth.protected, othern.postOther);
router.get("/othern/delete/:otherid", auth.protected, othern.deleteOther);
router.post("/search", auth.protected, users.search);
router.post("/upload", auth.protected, profile.uploadImg);

module.exports = router;