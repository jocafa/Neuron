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


	//////////////////////////////////////////////////////////////[ Tests ]////
	describe('Neuron', function () {
		it('should be able to be subclassed', function () {
			var a = new Thing;
			expect(a instanceof Thing).toBe(true);
			expect(a instanceof Neuron).toBe(true);
		});

		describe('firing', function () {
			it('should not talk to itself: a -> a = nothing', function () {
				var a = new Thing;
				a.influence(a);

				spyOn(a, 'respondToSomething').andCallThrough();

				runs(function () {
					a.stim();
				});

				waits(100);

				runs(function () {
					expect(a.respondToSomething).not.toHaveBeenCalled();
				});
			});

			it('a -> b = b', function () {
				var a = new Thing, b = new Thing;

				a.influence(b);
				a.stim();

				waitsFor(function () {
					return b.responses == 1;
				});
			});

			it('a -> b -> c = b, c', function () {
				var a = new Thing, b = new Thing, c = new Thing;

				a.influence(b);
				b.influence(c);

				a.stim();

				waitsFor(function () {
					return b.responses == 1 && c.responses == 1;
				});
			});

			it('a -> b -> c -> b = b, c', function () {
				var a = new Thing, b = new Thing, c = new Thing;

				a.influence(b);
				b.influence(c);
				c.influence(b);

				a.stim();

				waitsFor(function () {
					return b.responses == 1 && c.responses == 1;
				});
			});

			it('a -> (b->d, c->e) = b, c, d, e', function () {
				var a = new Thing, b = new Thing, c = new Thing, d = new Thing, e = new Thing;

				a.influence(b);
				a.influence(c);
				b.influence(d);
				c.influence(e);

				a.stim();

				waitsFor(function () {
					return (
						b.responses == 1 &&
						c.responses == 1 &&
						d.responses == 1 &&
						e.responses == 1
					);
				});
			});

			it('a -> (b->d->f, c->e->f) = b, c, d, e, f', function () {
				var a = new Thing, b = new Thing, c = new Thing, d = new Thing, e = new Thing, f = new Thing;

				a.influence(b);
				a.influence(c);
				b.influence(d);
				d.influence(f);
				c.influence(e);
				e.influence(f);
				
				a.stim();

				waitsFor(function () {
					return (
						b.responses == 1 &&
						c.responses == 1 &&
						d.responses == 1 &&
						e.responses == 1 &&
						f.responses == 1
					);
				});
			});

			it('a -> (b->d->f->a, c->e->f->a) = b, c, d, e, f', function () {
				var a = new Thing, b = new Thing, c = new Thing, d = new Thing, e = new Thing, f = new Thing;

				a.influence(b);
				a.influence(c);
				b.influence(d);
				d.influence(f);
				c.influence(e);
				e.influence(f);
				f.influence(a);

				a.stim();

				waitsFor(function () {
					return (
						b.responses == 1 &&
						c.responses == 1 &&
						d.responses == 1 &&
						e.responses == 1 &&
						f.responses == 1
					);
				});
			});

			it('a -> (b->d, c->d), d -> e = b, c, d, e', function () {
				var a = new Thing, b = new Thing, c = new Thing, d = new Thing, e = new Thing;

				a.influence(b);
				a.influence(c);
				b.influence(d);
				c.influence(d);
				d.influence(e);

				a.stim();

				waitsFor(function () {
					return (
						b.responses == 1 &&
						c.responses == 1 &&
						d.responses == 1 &&
						e.responses == 1
					);
				});
			});
		});
	});

	/////////////////////////////////////////////////////////[ Benchmarks ]////
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
		var fired = 0;
		var div = document.createElement('div');
		div.addEventListener('foo', function (e) {
			fired++;
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
