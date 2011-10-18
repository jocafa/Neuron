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

	Impulse.prototype.clone = function () {
		var clone = new Impulse(this.type, this.payload);

		for (var k in this.payload) if (this.payload.hasOwnProperty(k)) {
			clone.payload[k] = this.payload[k];
		}

		for (var k in this.log) if (this.log.hasOwnProperty(k)) {
			clone.log[k] = this.log[k];
		}

		return clone;
	};

	return Impulse;
});
