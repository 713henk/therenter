/**
 * Created by User on 11/06/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;


var City = new keystone.List('City', {
	map: { name: 'cityName' }
	});

City.add({
	cityName: {type: Types.Text, noedit:true},
	citySymbol: {type: Types.Number, noedit:true, hidden: true}
});
City.defaultColumns = 'id,cityName';
City.register();
