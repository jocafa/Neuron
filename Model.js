define(['Impulse', 'Neuron'], function (Impulse, Neuron) {
	function Model (data) {
		data = data || {};
		Neuron.call(this);
		this.fields = {};

		for (var key in data) if (data.hasOwnProperty(key)) {
			this[key] = data[key];
		}
	}

	Model.prototype = new Neuron;
	Model.prototype.constructor = Model;

	Model.prototype.toJSON = function () {
		var obj = {};

		for (var k in this.fields) if (this.fields.hasOwnProperty(k)) {
			obj[k] = this[k];
		}

		return JSON.stringify(obj);
	};

	Model.prototype.toString = function () {
		return '[object ' + this.constructor.name + '] : <' + this.cid + '>';
	};

	Model.defineField = function (cls, field, dfn) {
		dfn = dfn || {};
		Object.defineProperty(cls.prototype, field, (function () {
			return {
				get: dfn.get || function fieldGetter () {
					return this.fields[field] || dfn.defaultVaule;
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

					var oldValue = this.fields[field] || dfn.def;
					this.fields[field] = dfn.setter ? dfn.setter(newValue) : newValue;
					this.emit(new Impulse('change', {
						field: field,
						oldValue: oldValue,
						newValue: newValue
					}));
				}
			}
		})());
	};

	Model.defineFields = function (cls, fields) {
		for (var k in fields) if (fields.hasOwnProperty(k)) {
			Model.defineField(cls, k, fields[k]);
		}
	};

	return Model;
});
