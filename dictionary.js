#!/usr/bin/env node
var http = require('http');
var inquirer    = require('inquirer');

var search =function (hint, callback) {
	var url = 'http://api.wordnik.com:80/v4/word.json/' +hint + '/definitions?limit=20&includeRelated=true& '+
    'useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
	var straightline='';
	for (var i=1; i<process.stdout.columns ;i++){
		straightline += '_';
	}
http.get(url, function(res){
    var body =' ';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var fbResponse = JSON.parse(body);
        let curmeaning ='',
        		index=0;
        console.log('Searching, please wait...');

        fbResponse.forEach(meaning=> {
					console.log(straightline);
        	curmeaning ='Word:' + meaning.word.toString().toUpperCase() + '\n' + 'source: ' + meaning.sourceDictionary +
        	'\nPart of speech:' + meaning.partOfSpeech +
        	'\n ' + meaning.text + '\n' ;
        	console.log(curmeaning);
        });
        callback();
    });
}).on('error', function(e){
      console.log("Got an error,check your internet connection and try again ");
      callback();
});	
	
}

function userinput(callback) {
  var questions = [
    {
      name: 'hint',
      type: 'input',
      message: 'Enter a word :',
      validate: function( value ) {
        if (value.length && typeof value == 'string' && value !='') {
          return true;
        } else {
          return 'Please enter a valid word';
        }
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}

function restart(callback) {
  var questions = [
    {
      type: 'list',
      name: 'quit',
      message: 'Continue or quit:',
      choices: [ 'Continue', 'quit' ],
      default: 'Continue'
    }
    
  ];

  inquirer.prompt(questions).then(callback);
}


var entry = function() {
	let keyword='';
	userinput(function(){
		keyword =arguments[0].hint;
		search(keyword, function(){
			restart(function(){
				if (arguments[0].quit == 'quit'){
						console.log('Thanks for visiting...!');
		  			process.exit();
				} else{
					entry();
				}
			});
		});
	});
		
	
	
}

entry();

