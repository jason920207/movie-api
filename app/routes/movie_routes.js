// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for movies
const Movie = require('../models/movie')
const checkAdmin = require('../../lib/check_admin')
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')
// aws
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const promiseS3Upload = require('../../lib/promise_s3_upload')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else

// this is middleware that will remove blank fields from `req.body`, e.g.
// { movie: { title: '', text: 'foo' } } -> { movie: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

const dotenv = require('dotenv')
dotenv.config()
const yelp = require('yelp-fusion')
const client = yelp.client(process.env.YELP_SECRET_KEY)

// INDEX
// GET /movies
router.get('/movies', (req, res, next) => {
  Movie.find()
    .then(movies => {
      // `movies` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return movies.map(movie => movie.toObject())
    })
    // respond with status 200 and JSON of the movies
    .then(movies => res.status(200).json({ movies: movies }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX
// GET /movies
router.get('/moviesbystar', (req, res, next) => {
  Movie.find()
    .sort({'imdbRating': -1})
    .limit(10)
    .then(movies => {
      // `movies` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return movies.map(movie => movie.toObject())
    })
    // respond with status 200 and JSON of the movies
    .then(movies => res.status(200).json({ movies: movies }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// INDEX
// GET /movies
router.get('/moviesbydate', (req, res, next) => {
  Movie.find()
    .sort({'publishDate': -1})
    .limit(10)
    .then(movies => {
      // `movies` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return movies.map(movie => movie.toObject())
    })
    // respond with status 200 and JSON of the movies
    .then(movies => res.status(200).json({ movies: movies }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /movies/5a7db6c74d55bc51bdf39793
router.get('/movies/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Movie.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "movie" JSON
    .then(movie => res.status(200).json({ movie: movie.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /movies
router.post('/movies', requireToken, checkAdmin, upload.single('imageUrl'), (req, res, next) => {
  // set owner of new movie to be current user
  console.log(req.body)
  console.log('incoming req.file  is ', req.file)

  promiseS3Upload(req)
    .then(awsResponse => {
      req.body.imageUrl = awsResponse.Location
      Movie.create(req.body)
        // respond to succesful `create` with status 201 and JSON of new "movie"
        .then(movie => {
          res.status(201).json({ movie: movie.toObject() })
        })
        // if an error occurs, pass it off to our error handler
        // the error handler needs the error message and the `res` object so that it
        // can send an error message back to the client
        .catch(next)
    })
})

// router.post('/uploads', upload.single('image'), (req, res, next) => {
//   console.log('incoming req.file  is ', req.file)
//   promiseS3Upload(req)
//     .then(awsResponse => {
//       console.log(awsResponse)
//       return Upload.create({url: awsResponse.Location})
//     })
//
//     // respond to succesful `create` with status 201 and JSON of new "upload"
//     .then(upload => {
//       res.status(201).json({ upload: upload.toObject() })
//     })
//     // if an error occurs, pass it off to our error handler
//     // the error handler needs the error message and the `res` object so that it
//     // can send an error message back to the client
//     .catch(next)
// })

// UPDATE
// PATCH /movies/5a7db6c74d55bc51bdf39793
router.patch('/movies/:id', requireToken, checkAdmin, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  console.log(req.body.movie)
  Movie.findById(req.params.id)
    .then(handle404)
    .then(movie => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner

      // pass the result of Mongoose's `.update` to the next `.then`
      return movie.update(req.body.movie)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /movies/5a7db6c74d55bc51bdf39793
router.delete('/movies/:id', requireToken, checkAdmin, (req, res, next) => {
  Movie.findById(req.params.id)
    .then(handle404)
    .then(movie => {
      // throw an error if current user doesn't own `movie`
      // delete the movie ONLY IF the above didn't throw
      movie.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /movies/5a7db6c74d55bc51bdf39793
router.get('/movies/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Movie.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "movie" JSON
    .then(movie => res.status(200).json({ movie: movie.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /movies
router.post('/searchtheater', (req, res, next) => {
  // set owner of new movie to be current user
  client.search({
    term: 'Movie Theater',
    location: req.body.location
  }).then(response => {
    res.status(200).json({ theater: response.jsonBody.businesses })
  }).catch(e => {
    console.log(e)
  })
})

module.exports = router
