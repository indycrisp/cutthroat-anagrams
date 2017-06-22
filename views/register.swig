{% extends 'layout.swig' %}
{% set title = 'Register' %}
{% block body %}
	<h1>Register</h1>
	<form method="POST" action="/user">
		<div>
			<span>email</span>
			<input type="email" name="email">
		</div>
		<div>
			<span>password</span>
			<input type="password" name="password">
		</div>
		<input type="submit" value="Register">
	</form>
{% endblock %}
