/**
 * Created by User on 05/06/2017.
 */
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

var Answer = new keystone.List('Answer', {
	map: { name: 'questionAndAnswerText' },
	label: 'תשובות'
	});

Answer.add({
	question: {type: Types.Relationship, ref:'Question', initial:true},
	questionAndAnswerText: {type: Types.Text, hidden:true, index:true, initial:false},
	answer: {type: Types.Text, required: true, initial: true}
});
Answer.schema.pre('save', function(next){
	var Question = keystone.list('Question');
	var temp = this;
	Question.model.findOne().where('_id', temp.question).exec(function(err, item) {
		if(err) 
			console.log(err);
		else
			temp.questionAndAnswerText = item.question + ': ' + temp.answer;
		next();
	});
	
});
Answer.relationship({ ref: 'CheckListEntry', path: 'checklistentries', refPath:'answers'});
Answer.defaultColumns = 'question,answer';
Answer.register();
