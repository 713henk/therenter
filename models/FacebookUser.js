/**
 * Created by User on 05/06/2017.
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var FacebookUser = new keystone.List('FacebookUser', {
});

FacebookUser.add({
	name: { type: Types.Name, required: true, index: true },
	userID: {type: Types.Number, unique:true, required: true, initial: false,hidden:true},
	email: { type: Types.Email, initial: false, index: true },
	gender: { type: Types.Text, initial: false },
	age_range: { type: Types.Number, initial: false, hidden:true}
});

// Provide access to Keystone



/**
 * Relationships
 */
FacebookUser.relationship({ ref: 'CheckListEntry', path: 'checklistentries', refPath: 'facebookUser' });


/**
 * Registration
 */
FacebookUser.defaultColumns = 'name, email';
FacebookUser.register();
