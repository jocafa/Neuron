/* Neuron */
define(['Impulse'], function (Impulse) {
	var cid = 0;

	// nextTick taken from https://github.com/substack/node-browserify/pull/77
	var nextTick = (function () {
		if (typeof process != 'undefined' && typeof process.nextTick === 'function') return process.nextTick;

		var
			queue = [],
			dirty = false,
			fn,
			hasPostMessage = !!window.postMessage,
			messageName = 'impulse';

		var trigger = (function () {
			return hasPostMessage
				? function trigger () {
					window.postMessage(messageName, '*');
				}
				: function trigger () {
					setTimeout(function () { processQueue()}, 0);
				};
		})();

		var processQueue = (function () {
			return hasPostMessage
				? function processQueue (event) {
					if (event.source === window && event.data === messageName) {
						event.stopPropagation();
						flushQueue();
					}
				}
				: flushQueue;
		})();

		function flushQueue () {
			while (fn = queue.shift()) {
				fn();
			}
			dirty = false;
		}

		function nextTick (fn) {
			queue.push(fn);
			if (dirty) return;
			dirty = true;
			trigger();
		}

		if (hasPostMessage) window.addEventListener('message', processQueue, true);

		nextTick.removeListener = function () {
			window.removeListener('message', processQueue, true);
		};

		return nextTick;
	})();

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
						nextTick(function () {
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
