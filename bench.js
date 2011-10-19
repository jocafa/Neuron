define(['Impulse', 'Neuron'], function (Impulse, Neuron) {
	// Thing
	function Thing (label) {
		Neuron.call(this, arguments);
		this.label = label;
		this.responses = 0;
	}

	Thing.prototype = new Neuron;
	Thing.prototype.constructor = Thing;

	Thing.prototype.respondToSomething = function (imp) {
		this.responses++;
	};

	Thing.prototype.stim = function () {
		this.emit(new Impulse('something', { foo: 'bar' }));
	};

	(function () {
		var a = new Thing, b = new Thing;
		a.influence(b);
		JSLitmus.test('Neuron emission', function (count) {
			while (count--) {
				a.stim();
			}
		});
	})();

	(function () {
		var div = document.createElement('div');
		div.addEventListener('foo', function (e) {
		});
		function fire () {
			var e = document.createEvent('Event');
			e.initEvent('foo', true, false);
			div.dispatchEvent(e);
		}
		fire();
		JSLitmus.test('Regular Event Dispatch', function (count) {
			while (count--) {
				fire();
			}
		});
	})();
});
