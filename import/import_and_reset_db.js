/*
    This script resets the database completely and inserts the data of users.csv and others.csv.
 */

const fs = require("fs");
const csvParser = require("csv-parse");
const dataStore = require("../models/data-store.js");
const logger = require("../utils/logger.js");

const dataStoreClient = dataStore.getDataStore();

// delete existing relations
const deleteOthers = 'DROP TABLE IF EXISTS other.others';
dataStoreClient.query(deleteOthers);

const deleteFollowing = 'DROP TABLE IF EXISTS other.following';
dataStoreClient.query(deleteFollowing);

const deleteUsers = 'DROP TABLE IF EXISTS other.users';
dataStoreClient.query(deleteUsers);

// create relations users, others, following
const createUsers = 'CREATE TABLE other.users(' +
    'user_id serial primary key,' +
    'name text not null unique,' +
    'password text not null,' +
    'birthday date,' +
    'profile_pic text default \'default\',' +
    'bio_text text default \'\',' +
    'created timestamp default NOW())';
dataStoreClient.query(createUsers);

const createOthers = 'CREATE TABLE other.others(' +
    'post_id serial not null primary key,' +
    'user_id integer not null references other.users(user_id) on delete cascade,' +
    'text text,' +
    'created timestamp default NOW())';
dataStoreClient.query(createOthers);

const createFollowing = 'CREATE TABLE other.following(' +
    'followed_id INT REFERENCES other.users(user_id) ON DELETE CASCADE,' +
    'follower_id INT REFERENCES other.users(user_id) ON DELETE CASCADE,' +
    'PRIMARY KEY(followed_id, follower_id))';
dataStoreClient.query(createFollowing);

const processFile = async () => {
    // add users.csv to relation users
    const user_parser = fs
        .createReadStream("./import/users.csv")
        .pipe(csvParser.parse());
    for await (const record of user_parser) {
        const query = 'INSERT INTO other.users(user_id, name, password, birthday, profile_pic, bio_text, created)' +
            'VALUES($1, $2, $3, $4, $5, $6, $7)';
        const values = record;
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error inserting user to database.", e);
        }
    }

    // set sequenz/serial of user_id to next possible value
    const setSeqUserId = 'ALTER SEQUENCE other.users_user_id_seq RESTART with 106';
    dataStoreClient.query(setSeqUserId);

    // add others.csv to relation others
    const other_parser = fs
        .createReadStream("./import/others.csv")
        .pipe(csvParser.parse());
    for await (const record of other_parser) {
        const query = 'INSERT INTO other.others(post_id, user_id, text, created)' +
            'VALUES($1, $2, $3, $4)';
        const values = record;
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error inserting other to database.", e);
        }
    }

    // set sequenz/serial of post_id to next possible value
    const setSeqPostId = 'ALTER SEQUENCE other.others_post_id_seq RESTART with 8';
    dataStoreClient.query(setSeqPostId);
};

(async () => {
    await processFile();
    process.exit(0);
})();

