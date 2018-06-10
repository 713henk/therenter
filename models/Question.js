/**
 * Created by User on 22/05/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * CheckListItem Model
 * ==========
 */

var Question = new keystone.List('Question', {
	map: { name: 'question' },
	autokey: { path: 'slug', from: 'question', unique: true },
	label: "שאלות",
	sortable: true
});

Question.add({
	question: { type: String, required: true, default: "שאלה חדשה"},
	answers: {type: Types.TextArray},
	category: { type: Types.Relationship, ref: 'QuestionCategory'},
});
Question.relationship({ ref: 'CheckListEntry', path: 'checklistentries', refPath:'answers'});
Question.defaultColumns = 'question, answers, category';
Question.register();
