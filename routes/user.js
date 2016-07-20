module.exports = function (express) {

    var api = express.Router();

    /**
     * GET login
     */
    api.get('/login', function (request, response) {
        if (response.user)
            return response.redirect('/');
        response.render('index');
    });

    /**
     * POST login
     */
    api.post('/login', function (request, response) {
        
    });

    /**
     * GET register
     */
    api.get('/register', function (request, response) {
        if (response.user)
            return response.redirect('/');
        response.render('index');
    });

    /**
     * GET profile
     */
    api.get('/profile', function (request, response) {
        if (!request.user)
            return response.redirect('/user/login');
        response.render('index');
    });

    return api;

};