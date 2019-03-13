module.exports = function (req, res, next) {
  // we don't know the name of the object in `req.body`, so we'll apply this to
  // ALL objects in `req.body`
  if (req.user.isAdmin) {
    next()
  } else {
    res.status(401).json('No Authorazation To Change Product')
  }
  // pass `req` and `res` on to the route handler
}
