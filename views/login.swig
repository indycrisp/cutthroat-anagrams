{% extends 'layout.swig' %}
{% set title = 'Log in' %}
{% block body %}
	<h1>Log in</h1>
	<form method="POST" action="/login">
		<div>
			<span>email</span>
			<input type="email" name="email">
		</div>
		<div>
			<span>password</span>
			<input type="password" name="password">
		</div>
		<input type="submit" value="Log in">
	</form>
{% endblock %}
