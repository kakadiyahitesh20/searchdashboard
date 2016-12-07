/**
 * Created by Hitesh on 29-11-2016.
 */
var crypto = require('crypto');
var connection = require('./config');
module.exports = function(app) {

    app.post('/adminlogin', function (req, res) {

        var hashnew = crypto.createHash('md5').update(req.body.pass).digest("hex");
        connection.query("select * from users where email = '" + req.body.email + "' and password = '" + hashnew + "'", function (err, rows) {
            console.log(rows);
            console.log("above row object");
            numRows = rows.length;
            console.log(numRows);
            if (err)
                return done(err);
            if (numRows == 0) {
                // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                res.end('Please enter correct credentials.');
            }
            else {
                sess = req.session;
                sess.email = req.body.email;
                res.end('done');
            }
        });

    });
    app.post('/login', function (req, res) {

        var hashnew = crypto.createHash('md5').update(req.body.pass).digest("hex");
        connection.query("select * from users where email = '" + req.body.email + "' and password = '" + hashnew + "'", function (err, rows) {
            console.log(rows);
            console.log("above row object");
            numRows = rows.length;
            console.log(numRows);
            if (err)
                return done(err);
            if (numRows == 0) {
                // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                res.end('Please enter correct credentials.');
            }
            else {
                sess = req.session;
                sess.email = req.body.email;
                res.end('done');
            }
        });
    });
    app.post('/fpassword', function (req, res) {

        connection.query("select * from users where email = '" + req.body.email + "'", function (err, rows) {
            numRows = rows.length;
            if (err)
                return done(err);
            if (numRows == 0) {
                // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                res.end('Please enter correct credentials.');
            }
            else {
                res.end('done');
            }
        });
    });
    app.post('/addCategory', function (req, res) {
        var queryString = "insert into category(name,description,website) values('" + req.body.category + "','" + req.body.description + "','" + req.body.website + "')";
        console.log(queryString);
        connection.query(queryString, function (error, results) {
            if (error) {
                throw error;
            }
            else {
                //res.send('Inserted Successfully!');
                res.end('done');

                // res.write("Looked everywhere, but couldn't find that page at all!\n");
            }
        });
    });
    app.post('/addSubCategory', function (req, res) {
        var queryString = "insert into subcategory(category_id,name,description,website) values('" + req.body.categoryid + "','" + req.body.subcategory + "','" + req.body.subdescription + "','" + req.body.subwebsite + "')";
        console.log(queryString);
        connection.query(queryString, function (error, results) {
            if (error) {
                throw error;
            }
            else {
                //res.send('Inserted Successfully!');
                res.end('done');

                // res.write("Looked everywhere, but couldn't find that page at all!\n");
            }
        });
    });
    app.post('/removeCategory', function (req, res) {
        /* var queryString = "DELETE FROM category WHERE id=" +req.body.categoryid;
         console.log(queryString);
         connection.query(queryString, function (error, results) {
         if (error) {
         throw error;
         }
         else {
         //res.send('Inserted Successfully!');
         res.end('done');

         // res.write("Looked everywhere, but couldn't find that page at all!\n");
         }
         });*/
        connection.query("DELETE FROM category WHERE id= '" + req.body.categoryid + "'", function (err, result2) {
            connection.query("DELETE FROM subcategory WHERE category_id='" + req.body.categoryid + "'", function (err, result3) {
                console.log(result3);
                res.end('done');
            });
        });
    });
    app.post('/searchResult', function (req, res) {
        console.log(req.body.keyword);
        var queryString = "SELECT * FROM category inner JOIN subcategory ON category.id=subcategory.category_id WHERE category.description or subcategory.description Like '%" + req.body.keyword + "%'";
        connection.query(queryString, function (error, results) {
            if (error) {
                throw error;
            }
            else {
                //res.send('Inserted Successfully!');
                res.type('text/plain');
                res.json(results);
                // res.end('done');

                // res.write("Looked everywhere, but couldn't find that page at all!\n");
            }
        });
    });
    app.post('/signup', function (req, res) {

        connection.query("select * from  users where email = '" + req.body.email + "'", function (err, rows) {
            console.log(rows);
            // console.log("above row object");
            numRows = rows.length;
            console.log(numRows);
            if (err)
                return done(err);
            if (numRows == '1') {
                // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                res.end('done');
            }
            else {
                var created = new Date();
                var hash = crypto.createHash('md5').update(req.body.pass).digest("hex");
                var queryString = "insert into users(name,dob,email,password,organization,created) values('" + req.body.name + "','" + req.body.dob + "','" + req.body.email + "','" + hash + "','" + req.body.org + "','" + created + "')";
                console.log(queryString);
                connection.query(queryString, function (error, results) {
                    if (error) {
                        throw error;
                    }
                    else {
                        //res.send('Inserted Successfully!');
                        res.end('success');

                        // res.write("Looked everywhere, but couldn't find that page at all!\n");
                    }
                });
            }
        });
    });
    app.post('/editinfo', function (req, res) {
        var created = new Date();
        var queryString = "update users set name='" + req.body.name + "',dob='" + req.body.dob + "',organization='" + req.body.org + "',created='" + created + "' WHERE email='" + req.body.email + "'";
        console.log(queryString);
        connection.query(queryString, function (error, results) {
            if (error) {
                throw error;
            }
            else
            {
                res.end('success');
            }
        });
    });
    app.post('/contacts', function (req, res) {
        var queryString = "insert into contactus(name,email,message) values('" + req.body.name + "','" + req.body.email + "','" + req.body.message + "')";
        console.log(queryString);
        connection.query(queryString, function (error, results) {
            if (error) {
                        throw error;
                    }
                    else {
                        //res.send('Inserted Successfully!');
                        res.end('success');

                        // res.write("Looked everywhere, but couldn't find that page at all!\n");
                    }
                });
            });
    app.post('/removeuser', function (req, res) {
        var queryString = "DELETE FROM users WHERE id='" + req.body.id + "'";
        console.log(queryString);
        connection.query(queryString, function (error, results) {
            if (error) {
                throw error;
            }
            else {
                //res.send('Inserted Successfully!');
                res.end('success');

                // res.write("Looked everywhere, but couldn't find that page at all!\n");
            }
        });
    });
    app.post('/changePassword', function (req, res) {
        var hashnew = crypto.createHash('md5').update(req.body.password).digest("hex");
        var queryString = "UPDATE users SET password='" + hashnew + "' WHERE email='" + sess.email + "'";
        console.log(queryString);
        connection.query(queryString, function (error, results) {
            if (error) {
                throw error;
            }
            else {
                //res.send('Inserted Successfully!');
                res.type('text/plain');
                res.json(results);
                // res.end('done');

                // res.write("Looked everywhere, but couldn't find that page at all!\n");
            }
        });
    });
}