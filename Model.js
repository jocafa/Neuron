define(['Impulse', 'Neuron'], function (Impulse, Neuron) {
	function Model (data) {
		data = data || {};
		Neuron.call(this);
		this.__ = {};

		for (var key in data) if (data.hasOwnProperty(key)) {
			this[key] = data[key];
		}
	}

	Model.prototype = new Neuron;
	Model.prototype.constructor = Model;

	Model.prototype.fields = {};

	Model.defineField = function (cls, field, dfn) {
		Object.defineProperty(cls.prototype, field, (function () {
			return {
				get: dfn.get || function fieldGetter () {
					return this.__[field] || this.dfn.defaultVaule;
				},

				set: function fieldSetter (newValue) {
					if (dfn.type && ! newValue instanceof dfn.type) {
						throw new TypeError("Can't set value of " + field + " to a " + Object.getPrototypeOf(newValue).constructor.name + ". It must be a " + dfn.type.name + ".");
					}

					if (dfn.vet) {
						var vetResult = dfn.vet(newValue);
						if (vetResult) {
							throw new TypeError("Error setting " + field + " to " + newValue + ". " + vetResult);
						}
					}

					var oldValue = this.__[field] || this.fields.def;
					this.__[field] = dfn.setter ? dfn.setter(newValue) : newValue;
					this.emit(new Impulse('change', {
						field: field,
						oldValue: oldValue,
						newValue: newValue
					}));
				}
			}
		})());
	};

	return Model;
});
