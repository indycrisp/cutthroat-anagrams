{% extends 'layout.swig' %}
{% set title = 'Register' %}
{% block body %}
	<h1>Register</h1>
	<form method="POST" action="/register">
		{% if err %}
			<div>
				<span class='error'>{{err}}</span>
			</div>
		{% endif %}
		<div>
			<span>email</span>
			<input type="email" name="email" value="kelly@kelly.com">
		</div>
		<div>
			<span>password</span>
			<input type="password" name="password" value="kellyy">
		</div>
		<input type="submit" value="Register">
	</form>
{% endblock %}
