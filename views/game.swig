{% extends 'layout.swig' %}
{% set title = 'Test' %}
{% block body %}
    <h1>Cutthroat Anagrams</h1>
	<div id='users-container'>
		<span id='users-title'>Current users</span>
		<div id='users'></div>
	</div>
	<input id='chat-input'></input>
	<div id='chat'></div>
{% endblock %}
