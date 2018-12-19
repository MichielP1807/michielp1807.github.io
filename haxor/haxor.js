$(function(){ // on page load
	$("#input").keydown(keyboard_input); // bind keypress event from input textarea
	$(document).keypress(function(e) {
		$("#input").focus(); // focus on input textarea
	});
	COMMANDS.CLEAR.do(); // execute clear command
	output_line(" Use the command 'HELP' for info about the available commands...", "gray");
	$("#input").focus(); // focus on input textarea
});

// Input functions

// called whenever a key is pressed in the input textarea
const keyboard_input = (e) => {
	if (e.which == 13) { // if key is enter
		// get input string
		const input_string = $("#input")[0].value.trim();

		// if not empty process the input string
		if (input_string.length > 0) {
			do_input(input_string);
		}
	} else if (e.which == 38) { // up arrow
		nav_move(1);
		e.preventDefault();
	} else if (e.which == 40) { // down arrow
		nav_move(-1);
		e.preventDefault();
	}
}

// called when user hits enter in input textarea
const do_input = (input_string) => {
	// reset the input textarea and print input line
	$("#input")[0].value = "";
	output_line("> " + input_string, "input");

	// seperate command and parameters from input string
	let split = split_first_parameter(input_string);
	let command = split[0].toUpperCase();
	let parameters = split[1];

	do_command(command, parameters, input_string);

	// scroll down and left to make sure output is visible
	$("#output").scrollTop($("#output")[0].scrollHeight);
	$("#output").scrollLeft(0);

	reset_navigation();
}

const split_first_parameter = (text) => {
	let output = [];
	output.push(text.split(" ")[0]);
	output.push(text.substr(output[0].length+1));
	return output;
}

// Output functions

// writes line to output
const output_line = (text, style) => {
	let class_name = "new_line";
	if (style)
		class_name += " " + style;
	$("#output").append('<div class="'+class_name+'">'+text+'</div>');
}

const add_spaces_until = (text, length) => {
	while (text.length < length)
		text += " ";

	return text;
}

// Navigate functions
let nav_position = 0;
let nav_temp_text = "";

// navigate up or down, dir is either 1 (up) or -1 (down)
const nav_move = (dir) => {
	// array of all the input texts as a list of nodes
	let inputs = $(".new_line.input").contents();

	if (dir == 1 && (inputs.length - nav_position) > 0) { // move up
		nav_position++;
		if (nav_position == 1) {
			nav_temp_text = $("#input")[0].value;
		}
		$("#input")[0].value = get_previous_command(nav_position, inputs);

	} else if (dir == -1 && nav_position > 0) { // mode down
		nav_position--;
		if (nav_position == 0) {
			$("#input")[0].value = nav_temp_text;
		} else {
			$("#input")[0].value = get_previous_command(nav_position, inputs);
		}
	}
	//console.log("nav_position: " + nav_position + " || input_text: '" + $("#input")[0].value + "'");
}

// get a previous input, 1 is the first previous input, 2 the second etc...
const get_previous_command = (nav_position, inputs) => {
	return inputs[inputs.length - nav_position].nodeValue.substr(2);
}

// reset navigation, called in on_input
const reset_navigation = () => {
	nav_position = 0;
	nav_temp_text = "";
}