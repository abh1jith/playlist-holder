const { authenticate } = require("passport")

const LocalStrategy = require("passport-local").Strategy

function initialize(passport){
    const authenticateUser = (email, passwoed, done) => {
        users.findOne({ email: req.body.email })
        .then(user => {
            //if user not exist
            if (!user){
                return done(null, false, { message: "No user found in the database" });
            }
            else{
                bcrypt.compare(req.body.password, user.password, (err, data) => {
                //if error than throw error
                if (err){
                    return done(err, false, { message: "Password Incorrect" });
                    
                }
                
                //if both match than you can do anything
                else if (data) {
                  return done(null, user)
                    res.render("index", { songsList: user.playlist, email: user.email });

                }


            })
          }
        })
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }), authenticateUser)

    passport.serializeUser((user, done) => { });
    passport.deserializeUser((id, done) => { })

}

module.exports = initialize;