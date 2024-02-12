const passport = require("passport");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const AppError = require("../model/errorModel");
const { generateToken } = require("./authController");

// Import the GoogleStrategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// Import the FacebookStrategy
// const FacebookStrategy = require("passport-facebook").Strategy;

// Google authentication setup (unchanged)
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/login/callback",
  },
  asyncHandler(async (accessToken, refreshToken, profile, cb) => {
    const existingUser = await User.findOne({ userId: profile.id });

    if (existingUser && existingUser.googleId) {
      // console.log(refreshToken);
      // existingUser.refreshToken = refreshToken;
      existingUser.token = generateToken(existingUser._id);
      await existingUser.save();
      return cb(null, existingUser);
    } else if (existingUser && !existingUser.googleId) {
      throw new AppError(
        "You have used a diffrent method for login previously, please switch to that method.",
        401
      );
    }

    // console.log(refreshToken);
    //if user doesn't exist
    const user = await new User({
      name: profile.displayName,
      userId: profile.id,
      email: profile.emails[0].value,
      googleId: profile.id,
    }).save();
    cb(null, user);
  })
);

// // Facebook authentication setup
// const facebookStrategy = new FacebookStrategy(
//   {
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:5000/api/auth/facebook/login/callback",
//     profileFields: ["id", "displayName", "emails"],
//   },
//   asyncHandler(async (accessToken, refreshToken, profile, cb) => {
//     const existingUser = await User.findOne({ userId: profile.id });

//     if (existingUser && existingUser.facebookId) {
//       existingUser.refreshToken = refreshToken;
//       await existingUser.save();
//       return cb(null, existingUser);
//     } else if (existingUser && !existingUser.facebookId) {
//       throw new AppError(
//         "You have used a diffrent method for login previously, please switch to that method.",
//         401
//       );
//     }

//     const user = await new User({
//       name: profile.displayName,
//       userId: profile.id,
//       email: profile.emails ? profile.emails[0].value : null,
//       facebookId: profile.id,
//       refreshToken,
//     }).save();
//     cb(null, user);
//   })
// );

// Register the strategies with Passport
passport.use("google", googleStrategy);
// passport.use("facebook", facebookStrategy);

const googleAuthModule = {
  googleLoginAuth: passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  googleCallbackAuth: passport.authenticate("google", { session: false }),
  googleCallbackLoggedIn: asyncHandler(async (req, res) => {
    // write code for what happens when user is logged and sent to this callback url by default(from googles end)
    //u can redirect request to some other route or can send rresponse instead
    const user = req.user;
    const { token } = user;

    if (!user) {
      throw new AppError("Google authentication failed", 401);
    }
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.redirect("http://localhost:3000/prepareLogin");
  }),
  googleLogout: (req, res) => {
    req.logout();
    res.redirect("/");
  },
};

// Export Facebook authentication module
// const facebookAuthModule = {
//   facebookLoginAuth: passport.authenticate("facebook", { scope: ["email"] }),
//   facebookCallbackAuth: passport.authenticate("facebook", { session: false }),
//   facebookCallbackLoggedIn: asyncHandler(async (req, res) => {
//     const user = req.user;

//     if (!user) {
//       throw new AppError("Facebook authentication failed", 401);
//     }

//     const token = generateToken(user._id);

//     return res.status(200).json({ token });
//   }),
// };

module.exports = {
  googleAuthModule,
  // facebookAuthModule
};

//Passport.js is a popular Node.js library used to authenticate requests between different endpoints. It supports a wide range of authentication mechanisms, including OAuth, OpenID, and JSON Web Tokens (JWT).

// Resource:- https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5#id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjBhZDFmZWM3ODUwNGY0NDdiYWU2NWJjZjVhZmFlZGI2NWVlYzllODEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMTYyOTYwMzU4MzQtazFrNnFlMDYwczJ0cDJhMmphbTRsamRjbXMwMHN0dGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMTYyOTYwMzU4MzQtazFrNnFlMDYwczJ0cDJhMmphbTRsamRjbXMwMHN0dGcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE2OTczOTU2MjQyNjE5NDUxNzIiLCJlbWFpbCI6InN1bWl0bWVodGE1MTRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTcwMjQ2OTk4NCwibmFtZSI6InN1bWl0IG1laHRhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xGQ2l3RWtTZlRNVU5CaWpKdEFJOXdiV292MFhlbkZGSnNhRDJLS0lWcD1zOTYtYyIsImdpdmVuX25hbWUiOiJzdW1pdCIsImZhbWlseV9uYW1lIjoibWVodGEiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTcwMjQ3MDI4NCwiZXhwIjoxNzAyNDczODg0LCJqdGkiOiI2NzY5ZDY3ZjBkZjJmZmZkN2JjNTgyN2ZiNmZhMmJjY2E3M2Y3ZDdiIn0.KKGKRM71cT1S2SFohMI5f-sJRfmsbaWYyX7fFB1pmd-WDRlnEli5Nu3ddWx-i94yDIYfFJiBqtqgFvfROLr7QTpi6E4rKyphEM6XHAeaYa6W51ittviH0SMUKz3F4gyEfyYLRkR60v_yYC78IsnEeNlpHesulgNX-r59UROy9bQvc8iZ79xEWL21G6gW-RZAMOHGzN1PNLkFp9y3cdJH_0Z_S5E31mlfacNMWQf2ArZ_ABVqcMsRYn9lOr4Yb_zWE7EgIF9pgOL3jmg8oCgvUzEfYESYbWELb_jsh_cHvUmfA8mDKVIMfKa1iTY7jmpOWrpwtYUt1d2bIpRPNaiC0w

//This code sets up a JWT (JSON Web Token) strategy for authentication using Passport.js.
// const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = "your_jwt_secret";
// passport.use(
//   new JwtStrategy(opts, function (jwt_payload, done) {
//     User.findById(jwt_payload.id, function (err, user) {
//       if (err) {
//         return done(err, false);
//       }
//       if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     });
//   })
// );

// This function is typically used when an existing access token has expired, and you need to refresh it using the associated refresh token without requiring the user to re-authenticate. It's an essential part of maintaining long-lived access to protected resources.

// const getNewAccessToken = asyncHandler(async (user) => {
//   oauth2Client.setCredentials({
//     refresh_token: user.refreshToken,
//   });

//   const newAccessToken = await oauth2Client.getAccessToken();
//   return newAccessToken;
// });

// If you're using stateless authentication with passport-jwt, you can authenticate each request by adding the passport.authenticate('jwt', { session: false }) middleware to the routes that require authentication. This middleware checks the JWT token in the request and verifies its authenticity.

// const express = require("express");
// const passport = require("passport");

// const router = express.Router();

// // Middleware to authenticate requests using passport-jwt
// const requireAuth = passport.authenticate("jwt", { session: false });

// // Protected route that requires authentication
// router.get("/protected-route", requireAuth, (req, res) => {
//   // Your protected route logic here
//   res.send("You are authenticated!");
// });

// module.exports = router;

//NOTE - Make sure that you have configured the JwtStrategy in your application and that the JWT is included in the request headers, typically in the Authorization header as a bearer token.

// NOTE - Ensure that you have the passport.initialize() middleware applied to your Express app before applying the route middleware. This initializes Passport and sets it up to work with Express.
