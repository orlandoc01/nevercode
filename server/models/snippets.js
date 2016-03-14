'use strict';
const Promise = require('bluebird');
let mongoose = require('mongoose');
let _ = require('lodash');

let snippetSchema = mongoose.Schema({
	_createdAt: {type: Date, default: new Date()},
  	_updatedAt: {type: Date, default: new Date()},
	createdBy: { type: String, required: true },
	data: {type: String, required: true},
	filePath: { type: String, required: true},
	labels: { type: mongoose.Schema.Types.Mixed, default: {} },
	shareUrl: { type: String },
});

let Snippet = mongoose.model('Snippet', snippetSchema);

Snippet.makeSnippet = (snippetObj, callback) => {
	return Snippet.create(snippetObj)
	  .then((result)=> {
	  	console.log("snippet Created");
	  	return callback(result);
	  })
	  .catch((err) => {
	  	console.log("Error:", err);
	  })
}

Snippet.getSnippet = (_id, callback) => {
	return Snippet.findOne({_id: mongoose.Types.ObjectId(_id)})
		.then((snippetObj) => {
		 	callback(snippetObj);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return null
		});
}

Snippet.getSnippetByUser = (user_Id, callback) => {
	return Snippet.find({createdBy: user_Id})
		.then((foundSnippets) => {
			if(Array.isArray(foundSnippets) && foundSnippets.length !== 0){
			 	callback(snippetObj);
			 	return;
			}
			return callback({message: 'password invalid'}, null);
		})
		.catch((err) => {
		 	console.log("error", err);
		 	return
		});
}

Snippet.updateSnippet = (_id, newProps, callback) => {
  newProps._updatedAt = new Date();
  return Snippet.update({_id: mongoose.Types.ObjectId(_id)}, newProps, { multi: false } , (err, raw) => {
  		if (raw) {
      		callback(null, raw);
  		} else {
  			callback(err, null);
  		}
    });
}

Snippet.removeSnippet = (_id, callback) => {
  Snippet.findOne({email: email}).remove(callback);
}


module.exports = Snippet;
