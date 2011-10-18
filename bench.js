define(['Impulse', 'Neuron'], function (Impulse, Neuron) {
	function Thing () {
		Neuron.call(this, arguments);
	}

	Thing.prototype = new Neuron;
	Thing.prototype.constructor = Thing;

	Thing.prototype.stim = function () {
		var imp = new Impulse('something', {foo: 'bar'});
		this.emit(imp);
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
});
