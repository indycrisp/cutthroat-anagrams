{% extends 'layout.swig' %}
{% set title = 'Test' %}
{% block body %}
	<div id='game-container'>
		<h1>Cutthroat Anagrams</h1>
		<div id='countdown'>
		</div>
		<div id='tiles-container'>
			<table id='tiles-table'>
				{% for i,x in Array(10) %}
					<tr class='tile-row' id='{{ i }}'>
						{% for j,y in Array(10) %}
							<td class='tile' id='tile-{{ i*10 + j }}' align='center'></td>
						{% endfor %}
					</tr>
				{% endfor %}
			</table>
		</div>
		<div id='users-container'>
			<span id='users-title'>Current users</span>
			<div id='users'></div>
		</div>
		<input id='chat-input'></input>
		<div id='chat'></div>
	</div>
{% endblock %}
