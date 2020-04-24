/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = (req, res, next) => {
	//console.log('session', req.session);

	if (req.session.loggedIn) {
		next();
	} else {
		res.status(401).json({ message: 'You cannot pass!!' });
	}
};
