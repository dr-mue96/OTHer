const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const otherStore = {
    async getOthers(userName) {
        // returns all others if no user is logged in, returns only others from followed users if a user is logged in
        // userName is unique
        let query;
        if (userName === undefined) {
            query = 'SELECT name, profile_pic, TO_CHAR(o.created, \'dd.mm.yyyy\') AS date, TO_CHAR(o.created, \'HH24:MI\') AS time, text ' +
                'FROM other.users u JOIN other.others o USING(user_id) ORDER BY o.created DESC';
            try {
                let result = await dataStoreClient.query(query);
                return result.rows;
            } catch (e) {
                logger.error("Error fetching other.", e);
            }
        } else {
            query = 'SELECT name, profile_pic, TO_CHAR(created, \'dd.mm.yyyy\') AS date, TO_CHAR(created, \'HH24:MI\') AS time, text ' +
                'FROM (SELECT user_id, name, profile_pic FROM other.users JOIN other.following ON user_id=followed_id ' +
                'WHERE follower_id=(SELECT user_id FROM other.users WHERE name=$1)) u ' +
                'JOIN other.others USING(user_id) ORDER BY created DESC';
            const values = [userName];
            try {
                let result = await dataStoreClient.query(query, values);
                return result.rows;
            } catch (e) {
                logger.error("Error fetching other.", e);
            }
        }
    },
    async getOthersByUserName(userName) {
        // returns all others of a specified user
        const query = 'SELECT post_id AS other_id, name, profile_pic, TO_CHAR(others.created, \'dd.mm.yyyy\') AS date, TO_CHAR(others.created, \'HH24:MI\') AS time, text ' +
            'FROM other.users JOIN other.others using(user_id) WHERE name=$1 ORDER BY date DESC';
        const values = [userName];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows;
        } catch (e) {
            logger.error("Error fetching other.", e);
        }
    },
    async addOther(other) {
        // adds a new other
        const query = 'INSERT INTO other.others(user_id, text) VALUES($1, $2)';
        const values = [other.userid, other.text];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error adding other", e);
        }
    },
    async removeOther(otherId) {
        // removes other
        const query = 'DELETE FROM other.others WHERE post_id = $1';
        const values = [otherId];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error removing other", e);
        }
    },
};

module.exports = otherStore;