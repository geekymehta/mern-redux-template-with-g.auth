// If you're using stateless authentication with passport-jwt, you can authenticate each request by adding the passport.authenticate('jwt', { session: false }) middleware to the routes that require authentication. This middleware checks the JWT token in the request and verifies its authenticity.

// Here's an example of how you might use this middleware in an Express route:

// javascript
// Copy code
// const express = require('express');
// const passport = require('passport');

// const router = express.Router();

// // Middleware to authenticate requests using passport-jwt
// const requireAuth = passport.authenticate('jwt', { session: false });

// // Protected route that requires authentication
// router.get('/protected-route', requireAuth, (req, res) => {
//   // Your protected route logic here
//   res.send('You are authenticated!');
// });

// module.exports = router;
// In this example:

// The passport.authenticate('jwt', { session: false }) middleware is applied to the /protected-route route.
// If a valid JWT is present in the request, the user information will be available in req.user.
// If the JWT is not valid or not present, the middleware will respond with an unauthorized status.
// Make sure that you have configured the JwtStrategy in your application and that the JWT is included in the request headers, typically in the Authorization header as a bearer token.

// Here's a simplified example of how you might configure JwtStrategy:

// javascript
// Copy code
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const User = require('./models/user');

// const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'your_jwt_secret'; // Use your actual JWT secret

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
// Ensure that you have the passport.initialize() middleware applied to your Express app before applying the route middleware. This initializes Passport and sets it up to work with Express.

// javascript
// Copy code
// const express = require('express');
// const passport = require('passport');
// const app = express();

// app.use(passport.initialize());
// // ... other middleware and route configurations
// This setup allows you to protect specific routes in your Express application and ensure that only authenticated users with valid JWTs can access them.
