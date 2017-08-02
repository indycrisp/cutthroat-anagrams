{% extends 'layout.swig' %}
{% set title = 'Test' %}
{% block body %}
	<div id='game-container'>
		<h1>Cutthroat Anagrams</h1>
		<div id='countdown'></div>
		<div id='tiles-container'>
			{% include "./game/tile_table.swig" %}
		</div>
		<div id='users-container'>
			{% include "./game/user_board.swig" %}
		</div>
		<div id='chat-container'>
			{% include "./game/chat_box.swig" %}
		</div>
	</div>
{% endblock %}
