module.exports = function(req, res, next) {
	sails.log.info("Applying cache disabling");
	res.header('Cache-Control', 'no-cache');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
};
