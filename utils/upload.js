const logger = require("../utils/logger.js");

const uploader = {
    async uploadImg(request, response) {
        // returns true or false if upload of image was successful
        if (!request.files || Object.keys(request.files).length == 0) {
            return response.status(400).send('No files were uploaded.');
        }
        let sampleFile = request.files.sampleFile;
        let uploadPath = './Public/img/users/' + sampleFile.name;

        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                logger.error("Error uploading image", err);
                return false;
            }
        });
        return true;
    },
};

module.exports = uploader;