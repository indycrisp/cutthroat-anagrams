<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<title>{{ title|default('The Default Title') }}</title>
	</head>
	<body>
		<script src="/js/dependencies/jquery.min.js"></script>
		<script src="/js/dependencies/sails.io.js"></script>
		{% block body %}{% endblock %}
		<script src="/js/dist/bundle.js"></script>
	</body>
</html>
