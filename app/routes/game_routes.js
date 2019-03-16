// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for games
const Game = require('../models/game')
const checkAdmin = require('../../lib/check_admin')
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { game: { title: '', text: 'foo' } } -> { game: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /games
router.get('/games', requireToken, checkAdmin, (req, res, next) => {
  Game.find()
    .then(games => {
      // `games` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return games.map(game => game.toObject())
    })
    // respond with status 200 and JSON of the games
    .then(games => res.status(200).json({ games: games }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /games/5a7db6c74d55bc51bdf39793
router.get('/games/:id', requireToken, checkAdmin, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Game.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "game" JSON
    .then(game => res.status(200).json({ game: game.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /games
router.post('/games', requireToken, checkAdmin, (req, res, next) => {
  // set owner of new game to be current user
  const game = {
    title: 'Game of Thrones (season 4)',
    image_url: 'data:image/jpeg;base64,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',
    url: ['http://classic.dnvod.tv/Movie/Readyplay.aspx?id=pljG0ZokKC4%3d', 'http://classic.dnvod.tv/Movie/Readyplay.aspx?id=3iqEP1kjZT0%3d']
  }
  Game.create(game)
    // respond to succesful `create` with status 201 and JSON of new "game"
    .then(game => {
      res.status(201).json({ game: game.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /games/5a7db6c74d55bc51bdf39793
router.patch('/games/:id', requireToken, checkAdmin, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.game.owner

  Game.findById(req.params.id)
    .then(handle404)
    .then(game => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, game)

      // pass the result of Mongoose's `.update` to the next `.then`
      return game.update(req.body.game)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /games/5a7db6c74d55bc51bdf39793
router.delete('/games/:id', requireToken, checkAdmin, (req, res, next) => {
  Game.findById(req.params.id)
    .then(handle404)
    .then(game => {
      // throw an error if current user doesn't own `game`
      requireOwnership(req, game)
      // delete the game ONLY IF the above didn't throw
      game.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
