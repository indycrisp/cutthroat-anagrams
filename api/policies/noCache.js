module.exports = function(req, res, next) {
	sails.log.info("Applying cache disabling");
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Expires', '-1');
	res.setHeader('Pragma', 'no-cache');
	next();
};
