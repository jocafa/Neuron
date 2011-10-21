/* Impulse */
define(function () {
	var cid = 0;

	function Impulse (type, payload) {
		this.cid = 'Impulse-' + cid++;
		this.type = type;
		this.payload = payload || {};
		this.timestamp = new Date().getTime();
		this.active = true;
		this.log = {}; // Log of the neurons this impulse has visited
	}

	Impulse.prototype.terminate = function () {
		this.active = false;
	}

	return Impulse;
});
