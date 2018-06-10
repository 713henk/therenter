var keystone = require('keystone');

/**
 * QuestionCategory Model
 * ==================
 */

var QuestionCategory = new keystone.List('QuestionCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	sortable: true
});

QuestionCategory.add({
	name: { type: String, required: true, unique: true },
});

QuestionCategory.relationship({ ref: 'Question', path: 'category' });

QuestionCategory.register();
