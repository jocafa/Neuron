define(['Neuron'], function (Neuron) {
	function Thing () {
		Neuron.call(this, arguments);
	}

	Thing.prototype = new Neuron;
	Thing.prototype.constructor = Thing;

	Thing.prototype.stim = function () {
		this.emit({
			type: 'something',
			payload: {
				foo: 'bar'
			}
		});
	};

	Thing.prototype.respondToSomething = function (imp) {
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
