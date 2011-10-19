/* Neuron */
define(['Impulse'], function (Impulse) {
	var cid = 0;

	function __bind (fn, obj) {
		return function () {
			return fn.apply(obj, arguments);
		}
	}

	function Neuron () {
		this.cid = this.constructor.name + '-' + cid++;
		this.axonTerminals = {};

		this.bindResponders();
	}

	Neuron.prototype.bindResponders = function () {
		for (var fn in this) {
			if (fn.indexOf('respondTo') == 0) {
				this[fn] = __bind(this[fn], this);
			}
		}
	};

	Neuron.prototype.emit = function (impulse) {
		var synapses = Object.keys(this.axonTerminals);
		var l = synapses.length;
		impulse.log[this.cid] = true;
		if (l) {
			var self = this;

			var responderKey = 'respondTo' + impulse.type.replace(/./, function (c) {
				return c.toUpperCase();
			});


			for (var i = 0; i < l; i++) {
				if (!impulse.log[synapses[i]]) {
					var synapse = this.axonTerminals[synapses[i]];
					impulse.log[synapses[i]] = true;
					(function (rk, syn, imp) {
						setTimeout(function () {
							syn[responderKey](imp);
							if (imp.active) {
								syn.emit(imp);
							}
						});
					})(responderKey, synapse, impulse);
				}
			}
		}
	};

	Neuron.prototype.observe = function (stimulator) {
		stimulator.axonTerminals[this.cid] = this;
	};

	Neuron.prototype.stopObserving = function (stimulator) {
		delete stimulator.axonTerminals[this.cid];
	};

	Neuron.prototype.influence = function (target) {
		target.observe(this);
	};

	Neuron.prototype.stopInfluencing = function (target) {
		target.stopObserving(this);
	};

	return Neuron;
});
