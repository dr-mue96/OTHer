const trends = {
    async getTrends(others) {
        // returns the top five hashtags with occurences of given others
        let counter = {};
        // get hashtags by regex
        for (const row of others) {
            const tags = row.text.matchAll(/#[a-zA-Z0-9]+/g);
            for (const tag of tags) {
                if (tag[0] in counter) {
                    counter[tag[0]] += 1;
                } else {
                    counter[tag[0]] = 1;
                }
            }
        }
        // convert dict to array
        let items = Object.keys(counter).map(function(key) {
            return [key, counter[key]];
        });
        // sort by values
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        // convert back to array of dicts
        const trends = Object.values(items.slice(0, 5)).map(function(items) {
            return {'tag': items[0], 'num': items[1]};
        });
        return trends;
    },
};

module.exports = trends;