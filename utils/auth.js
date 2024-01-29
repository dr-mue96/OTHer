const auth = {
    protected(request, response, next) {
        if (request.session.user) {
            next();
        } else {
            response.redirect('/');
        }
    },
};

module.exports = auth;