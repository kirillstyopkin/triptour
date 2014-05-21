define(['channel',
	    'marionette'
], function(channel) {
	'use strict';

	return Marionette.ItemView.extend({
		
		itemViewContainer: '#status',

		tplNotFound	: _.template('Not found'),
		tplLoad     : _.template('<%= page * 10 %> / <%= total %>'),
		tplFinish   : _.template('<%= total %> / <%= total %>'),

		initialize: function() {
			channel.trigger('reset');
			this.listenTo(channel, 'getEvents', this.getEvents);
			this.listenTo(this.model, 'change', this.render);
		},

		render: function() {
			if (this.model.get('page') < this.model.get('totalPages')) {
				this.$el.html(this.tplLoad(this.model.toJSON()));
			} else {
				this.$el.html(this.tplFinish(this.model.toJSON()));
			}

			if (!this.model.get('totalPages')) {
				this.$el.html(this.tplNotFound());
			}
		},

		getEvents: function(search) {
			channel.trigger('reset');
			this.model.set(this.model.defaults);
			channel.trigger('setParam', search.param);

			this.$el.show();
			channel.trigger('showControls');

			var self = this;

			(function go() {
				Backbone.ajax({
					url: 'http://ws.audioscrobbler.com/2.0/',
					type: 'GET',
					data: {
						method        : search.param + '.getevents',
						location      : search.value,
						artist        : search.value,
						autocorrect   : 1,
						festivalsonly : search.fest,
						tag           : search.tag,
						page 		  : self.model.get('page'),
						limit	      : 10,
						api_key  	  : 'dd349d2176d3b97b8162bb0c0e583b1c',
						format 		  : 'json'
					},
					success: function(data) {
						self.getEventsData(data, search.param);

						self.model.set('page', self.model.get('page') + 1);

						if (self.model.get('page') <= self.model.get('totalPages')) {
							go();
						} else {
							channel.trigger('addPaths');
						}
					}
				});
			}());
		},

		getEventsData: function(data, param) {
			var self = this;

			if (data.error == 8 || data.events.total == 0) {
				this.model.set({totalPages: 0});
				return false;
			}

			this.model.set({
				totalPages : data.events["@attr"].totalPages,
				total      : data.events["@attr"].total
			});

			if (this.model.get('page') == this.model.get('totalPages') && /1$/.test(this.model.get('total'))) {
				channel.trigger('addEvent', data.events.event);
			} else {
				data.events.event.forEach(function(value, index, list) {
					channel.trigger('addEvent', value);
					
					if (self.model.get('page') == 1 && index == 0) {
						channel.trigger('setView', list, param);
					}
				});
			}
		}

	});

});