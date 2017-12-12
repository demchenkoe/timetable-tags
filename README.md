TimetableTags JS
=================

Helpful for select tagged  time periods. 
Working in browsers, NodeJS applications and other JS platform.
 
Very small (1783 bytes in minified) library.
Not have other dependencies.

### Install

	npm install timetable-tags --save

or

	bower install timetable-tags --save 


### Example

		var TimetableTags = require('timetable-tags');
		
		var tagsSettings = [
			//{ tag: "tag name",period: { from: 'MM-DD', to: 'MM-DD' }, daily: { from: 'hh:mm:ss', to: 'hh:mm:ss' }, order: <number> },
			{ tag: 'morning',  period: { from: '01-01', to: '12-31' }, daily: { from: '05:00:00', to: '12:00:00' }, order: 2 },
			{ tag: 'afternoon',period: { from: '01-01', to: '12-31' }, daily: { from: '12:00:00', to: '17:00:00' }, order: 2 },
			{ tag: 'evening',  period: { from: '01-01', to: '12-31' }, daily: { from: '17:00:00', to: '21:00:00' }, order: 2 },
			{ tag: 'night',    period: { from: '01-01', to: '12-31' }, daily: { from: '21:00:00', to: '23:59:59' }, order: 2 },
			{ tag: 'night',    period: { from: '01-01', to: '12-31' }, daily: { from: '00:00:00', to: '04:59:59' }, order: 2 },
			{ tag: 'christmas_night', period: { from: '12-25', to: '12-25' }, daily: { from: '21:00:00', to: '23:59:59' }, order: 1 },
			{ tag: 'christmas_night', period: { from: '12-26', to: '12-26' }, daily: { from: '00:00:00', to: '04:59:59' }, order: 1 },
		
		];
		var defaultRow = { tag: 'generic' };
		
		var tt = new TimetableTags(tagsSettings, defaultRow);
		
		console.log( tt.getActive().tag ); //return 'morning' or 'afternoon' or etc..
		console.log( tt.getForDate( new Date('2017-12-26T03:00:00')).tag ); //return 'christmas_night'


### Author

Eugene Demchenko ( demchenkoev@gmail.com )