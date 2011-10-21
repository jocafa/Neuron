define(['Impulse', 'Neuron', 'Model'], function (Impulse, Neuron, Model) {
	function Collection (opts) {
		opts = opts || {};

		Model.call(this, opts.fields || {});

		this.model = opts.model || Model;
		this.members = {};
		this.indices = {};

		if (opts.members && opts.members.length) {
			this.add(opts.members);
		}
	}

	Collection.prototype = new Model;
	Collection.prototype.constructor = Collection;

	Model.defineField(Collection, 'length');

	/////////////////////////////////////////////////////////[ Population ]////
	Collection.prototype.add = function (members) {
		members = members instanceof Array ? members : [members];
		var membersAdded = [];

		for (var i = 0, l = members.length; i < l; i++) {
			var member = members[i];
			if (Object.getPrototypeOf(member).constructor.name == 'Object') {
				member = new this.model(member);
			}
			if (!this.members[member.cid]) {
				this.members[member.cid] = member;
				membersAdded.push(member);
			}
		}

		if (membersAdded.length) {
			this.length += membersAdded.length;
		}

		this.emit(new Impulse('add', {
			members: membersAdded
		}));
	};

	Collection.prototype.create = function () {
		var newMember = new this.model(arguments);
		this.add(newMember);
		return newMember;
	};

	Collection.prototype.remove = function (members) {
		members = members instanceof Array ? members : [members];
		var membersRemoved = [];

		for (var i = 0, l = members.length; i < l; i++) {
			var member = members[i];
			if (this.members[member.cid]) {
				membersRemoved.push(this.member[member.cid]);
				delete this.members[member.cid];
			}
		}

		if (membersRemoved.length) {
			this.length -= membersRemoved;
		}

		this.emit(new Impulse('remove', {
			members: membersRemoved
		}));
	};

	Collection.prototype.clear = function () {
		var membersToRemove = [];

		for (var k in this.indices) if (this.indices.hasOwnProperty(k)) {
			this.indices[k] = [];
		}

		for (var cid in this.members) if (this.members.hasOwnProperty(cid)) {
			membersToRemove.push(this.members[cid]);
		}

		this.remove(membersToRemove);
		this.emit(new Impulse('clear'));
	};

	Collection.prototype.reset = function (members) {
		this.clear();
		this.add(members);
		this.emit(new Impulse('reset'));
	};

	Collection.prototype.respondToChange = function (impulse) {
	});


	//////////////////////////////////////////////////////[ Serialization ]////
	Collection.prototype.toArray = function () {
	};

	Collection.prototype.toJSON = function () {
	};

	Collection.prototype.toString = function () {
	};

	//////////////////////////////////////////////////////////[ Iteration ]////
	Collection.prototype.each = function (fn) {
	};

	Collection.prototype.invoke = function (fn, args) {
	};

	Collection.prototype.pluck = function (field) {
	};

	Collection.prototype.map = function (fn) {
	};

	Collection.prototype.reduce = function (fn, memo) {
	};

	Collection.prototype.reduceRight = function (fn, memo) {
	};

	//////////////////////////////////////////////////////////[ Selection ]////
	Collection.prototype.find = function (fn) {
	};

	Collection.prototype.indexOf = function (member, field) {
	};

	Collection.prototype.lastIndexOf = function (member, field) {
	};

	Collection.prototype.filter = function (fn) {
	};

	Collection.prototype.reject = function (fn) {
	};

	Collection.prototype.without = function (members) {
	};

	////////////////////////////////////////////////////////////[ Sorting ]////
	Collection.sorters = {};
	Collection.sorters.alphabetical = function (a, b) {
		if (a == b) {
			return 0;
		} else if (a < b) {
			return -1;
		} else {
			return 1;
		}
	};

	Collection.sorters.numerical = function (a, b) {
		return a - b;
	};

	Collection.prototype.sortBy = function (field, how) {
		how = how || Collection.sorters.alphabetical;
		var sorted = Object.keys(this.members);
		var that = this;
		sorted.sort(function (a, b) {
			return how(that[a], that[b]);
		});
	};

	///////////////////////////////////////////////////////////[ Grouping ]////
	Collection.prototype.groupBy = function (field) {
	};

	///////////////////////////////////////////////////////////[ Indexing ]////
	Collection.prototype.createIndexFor = function (field) {
		this.indicies[field] = [];
	};

	Collection.prototype.updateIndexFor = function (field) {
	};

	Collection.prototype.removeIndexFor = function (field) {
	};

	////////////////////////////////////////////////////////////[ Metrics ]////
	Collection.prototype.minOf = function (field) {
	};

	Collection.prototype.meanOf = function (field) {
	};

	Collection.prototype.medianOf = function (field) {
	};

	Collection.prototype.modeOf = function (field) {
	};

	Collection.prototype.rangeOf = function (field) {
	};

	Collection.prototype.maxOf = function (field) {
	};

});
