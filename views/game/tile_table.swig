<table id='tiles-table'>
	{% for i,x in Array(10) %}
		<tr class='tile-row' id='{{ i }}'>
			{% for j,y in Array(10) %}
				<td class='tile' id='tile-{{ i*10 + j }}' align='center'></td>
			{% endfor %}
		</tr>
	{% endfor %}
</table>
