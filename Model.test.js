define(['Model'], function (Model) {
	//////////////////////////////////////////////////////////////[ Tests ]////
	describe('Model', function () {
		describe('subclassing', function () {
			function Thing (data) {
				Model.call(this, arguments);
			}

			Thing.prototype = new Model;
			Thing.prototype.constructor = Thing;

			var t = new Thing;

			it('should be an instance of Thing', function () {
				expect(t instanceof Thing).toBe(true);
			});

			it('should also be an instance of Model', function () {
				expect(t instanceof Model).toBe(true);
			});
		});

		describe('defining an empty field', function () {
			function Thing (data) {
				Model.call(this, arguments);
			}

			Thing.prototype = new Model;
			Thing.prototype.constructor = Thing;

			Thing.prototype.respondToChange = function (impulse) {
				this.lastImpulse = impulse;
			};

			Model.defineField(Thing, 'something', {});

			var descriptor = Object.getOwnPropertyDescriptor(Thing.prototype, 'something');

			it('should use fieldGetter', function () {
				expect(descriptor.get.name).toBe('fieldGetter');
			});

			it('should use fieldSetter', function () {
				expect(descriptor.set.name).toBe('fieldSetter');
			});

			it('should fire a change event when setting a value', function () {
				var a = new Thing, b = new Thing;
				a.influence(b);
				spyOn(b, 'respondToChange').andCallThrough();
				runs(function () {
					a.something = true;
				});
				waits(200);
				runs(function () {
					expect(b.respondToChange).toHaveBeenCalled();
					expect(b.lastImpulse.payload.oldValue).toBe(undefined);
					expect(b.lastImpulse.payload.newValue).toBe(true);
				});

			});
		});
	});

	/////////////////////////////////////////////////////////[ Benchmarks ]////
});
