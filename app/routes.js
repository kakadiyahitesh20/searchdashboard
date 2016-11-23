module.exports = function(app) {

    app.get('/login', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('login');
        }
    });


// Register page
    app.get('/register', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('register', {user: "Great User", title: "homepage"});
        }
    });

    app.get('/logout', function (req, res) {

        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.redirect('/');
            }
        });

    });
    app.get('/aboutus', function (req, res) {
        sess = req.session;
        if (sess.email) {
            res.redirect('/dashboard');
        }
        else {
            res.render('aboutus', {title: "homepage"});
        }
    });

}