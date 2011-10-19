/* Neuron */
define(function () {
	var cid = 0;

	function __bind (fn, obj) {
		return function () {
			return fn.apply(obj, arguments);
		}
	}

	function Neuron () {
		this.cid = this.constructor.name + '-' + cid++;
		this.axonTerminals = {};
		this.nucleus = document.createElement('div');
		this.nucleus.addEventListener('impulse', __bind(this.handleImpulseEvent, this));

		this.bindResponders();
	}

	Neuron.prototype.bindResponders = function () {
		for (var fn in this) {
			if (fn.indexOf('respondTo') == 0) {
				this[fn] = __bind(this[fn], this);
			}
		}
	};

	Neuron.prototype.handleImpulseEvent = function (event) {
		if (!event.impulse.log[this.cid]) {
			var responderKey = 'respondTo' + event.impulse.type.replace(/./, function (c) {
				return c.toUpperCase();
			});

			event.impulse.log[this.cid] = true;

			if (typeof this[responderKey] == 'function') {
				this[responderKey](event.impulse.payload);
			}

			this.emit(event.impulse);
		}
	};

	Neuron.prototype.emit = function (impulse) {
		var synapses = Object.keys(this.axonTerminals);
		var l = synapses.length;
		if (l) {
			var evt = document.createEvent('Event');
			evt.initEvent('impulse', true, false);
			evt.impulse = impulse;
			evt.impulse.log = evt.impulse.log || {};
			evt.impulse.log[this.cid] = true;

			for (var i = 0; i < l; i++) {
				if (!evt.impulse.log[synapses[i]]) {
					var synapse = this.axonTerminals[synapses[i]];
					synapse.nucleus.dispatchEvent(evt);
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
