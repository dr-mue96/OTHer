const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const userStore = {
    async getUsers(userId) {
        // returns all users with additional column 'followed' which is true or false if logged in user follows the respective user
        const query = 'SELECT u.user_id, name, profile_pic, created, CASE WHEN follower_id=$1 THEN 1 ELSE 0 END AS followed ' +
            'FROM other.users u LEFT JOIN ' +
            '(SELECT user_id, follower_id from other.users LEFT JOIN other.following ON user_id=followed_id WHERE follower_id=$1) a ' +
            'ON a.user_id=u.user_id WHERE u.user_id != $1 ORDER BY name ASC';
        const values = [userId]
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows;
        } catch (e) {
            logger.error("Error fetching users.", e);
        }
    },
    async authenticateUser(username, password) {
        // returns user name (as unique id) if user name and respective password exists
        const query = 'SELECT * FROM other.users WHERE name=$1 AND password=$2';
        const values = [username, password];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            if (dbRes.rows[0] !== undefined) {
                return {id: username};
            } else {
                return undefined;
            }
        } catch (e) {
            logger.error("Error authenticating user.", e);
        }
    },
    async addUser(user) {
        // adds new user
        const query = 'INSERT INTO other.users(name, password, birthday) VALUES ($1, $2, $3)';
        const values = [user.username, user.password, user.birthday];
        try {
            await dataStoreClient.query(query, values);
            return true;
        } catch (e) {
            logger.error("Error adding user.", e);
            return false;
        }
    },
    async getUserByName(username) {
        // get all information of a user by its user name
        const query = 'SELECT user_id, name, password, TO_CHAR(birthday, \'dd.mm.yyyy\') as birthday, profile_pic, bio_text, TO_CHAR(created, \'dd.mm.yyyy\') as created ' +
            'FROM other.users WHERE name = $1';
        const values = [username];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch (e) {
            logger.error("Error fetching user.");
        }
    },
    async follow(followedId, followerId) {
        // adds followship what means the follower follows the following
        const query = 'INSERT INTO other.following VALUES($1, $2)';
        const values = [followedId, followerId];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error following user.");
        }
    },
    async unfollow(followedId, followerId) {
        // remove followship
        const query = 'DELETE FROM other.following WHERE followed_id=$1 AND follower_id=$2';
        const values = [followedId, followerId];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error unfollowing user.");
        }
    },
    async getFollowStatistic(username) {
        // returns num followers, num followed for a specified user
        const query = 'select f1.follower as follower, f2.followed as followed from' +
            '(select count(*) as follower from other.following join other.users on user_id=followed_id where name=$1) f1, ' +
            '(select count(*) as followed from other.following join other.users on user_id=follower_id where name=$1) f2';
        const values = [username];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch (e) {
            logger.error("Error fetching follow statistics.");
        }
    },
    async searchUsers(userId, searchFor) {
        // returns results of search for users
        const query = 'SELECT u.user_id, name, profile_pic, created, CASE WHEN follower_id=$1 THEN 1 ELSE 0 END AS followed ' +
            'FROM other.users u LEFT JOIN ' +
            '(SELECT user_id, follower_id from other.users LEFT JOIN other.following ON user_id=followed_id WHERE follower_id=$1) a ' +
            'ON a.user_id=u.user_id WHERE u.user_id != $1 AND u.name LIKE \'%\' || $2 || \'%\' ORDER BY followed DESC, created DESC';
        const values = [userId, searchFor];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows;
        } catch (e) {
            logger.error("Error fetching search request.");
        }
    },
    async updateImg(userId, imgPath) {
        // updates the name of the profile pic of a specified users
        const query = 'UPDATE other.users SET profile_pic = $2 WHERE user_id = $1';
        const values = [userId, imgPath];
        try {
            dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error updating profile img.");
        }
    },
};

module.exports = userStore;