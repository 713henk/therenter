/**
 * Created by User on 05/06/2017.
 */
/**
 * Created by User on 22/05/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * CheckListItem Model
 * ==========
 */

var CheckListEntry = new keystone.List('CheckListEntry', {
	map: { name: 'parsedAddress'},
	//autokey: { path: 'slug', from: 'parsedAddress', unique: true },
	label: "שאלונים ממולאים"
});

CheckListEntry.add(
	'משתמש פייסבוק',{facebookUser: { type: Types.Relationship, ref:'FacebookUser', initial:true, required: true, label:'משתמש פייסבוק:'}},
	'תאריך מילוי',{date: {type: Types.Datetime, default:Date.now}},
	'כתובת',{ address:
	{
		city: {type: Types.Text,  required: true, initial:true },
		streetName: {type: Types.Text,  required: true, initial:true },
		streetNumber: {type: Types.Number,  required: true,initial:true },
		floor: {type: Types.Number,  initial:true },
		apartmentNumber: {type: Types.Number,  required: true, initial:true }}
	},
	'כתובת מלאה',{parsedAddress: { type: String, noedit:true, index:true}},
	//'תשובות',{answers: {type: Types.Relationship, ref:'Answer',  many: true, label:':תשובות'}}
	'מילוי השאלון',{answers: {type: Types.TextArray, initial:false}}
);

CheckListEntry.schema.pre('save', function(next){
	this.parsedAddress = 'רחוב: '+ this.address.streetName + ' מספר:' + this.address.streetNumber + ', ' + this.address.city
		+ ' מספר דירה: ' + this.address.apartmentNumber;
	if(this.address.floor)
		this.parsedAddress = this.parsedAddress + ' קומה: ' + this.address.floor;
	next();
});

CheckListEntry.defaultColumns = 'parsedAddress,facebookUser, date ';
CheckListEntry.register();
