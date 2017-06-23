{% extends 'layout.swig' %}
{% set title = 'Log in' %}
{% block body %}
	<h1>Log in</h1>
	<form method="POST" action="/login">
		<div>
			<span>email</span>
			<input type="email" name="email" value="kelly@kelly.com">
		</div>
		<div>
			<span>password</span>
			<input type="password" name="password" value="kellyy">
		</div>
		<input type="submit" value="Log in">
	</form>
{% endblock %}
