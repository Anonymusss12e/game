
log = function(s) {
	console.log(s)
} 


game = {
	pack: {},
	has_visited: {},
	world: {
		places: [{
			name: "Nowhere",
			desc: "You see nothing.",
			exits: {},
		}],
	},
};


here = game.world.places[0];

e_loc = I("location");
e_desc = I("description");

redraw = function() {

	e_loc.innerHTML = here.name;

	e_desc.innerHTML = here.desc;

	var a = [];
	for(var k in here.exits) {
		a.push(here[k]);
	}
	replicate("tpl_exit", a);

}

save = function() {
	conn.send({msg:"save", game:game, name:"game.json"}, function(r) {
		log("save: r="+o2j(r));
		game = r.game;
		here = game.world.places[0];
		redraw();
	});
}


redraw();


//	-	-	-	-	-	-	-	-

cb_msg = function(m) {
	if(m.msg == "ping") {
		m.reply({msg:"pong"});
		return
	}
}

cb_ctrl = function(m, x) {
	log("CTRL: "+m+", ["+o2j(x)+"]")

	if(m === "disconnected") {
		log("reconnecting ...");
		setTimeout(function() {
			conn = MAWS.connect(cb_msg, cb_ctrl)
		}, 5000);
		return
	}

	if(m === "connected") {
		conn.send({msg:"hello"}, function(r) {
			log("I've been welcomed as "+r.name)
		});
		return
	}
}

conn = MAWS.connect(cb_msg, cb_ctrl)


