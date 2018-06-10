/**
 * Created by User on 11/06/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Street = new keystone.List('Street', {
	map: { name: 'streetName' }
	});

Street.add({
	cityName: {type: Types.Text},
	citySymbol: {type: Types.Number},
	streetSymbol: {type: Types.Number},
	streetName: {type: Types.Text}
});
Street.defaultColumns = 'streetName,streetSymbol,cityName';
Street.register();


