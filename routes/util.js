
var mongo = require('mongodb');
var monk = require('monk');

var util_methods = {

	imageNumberSelector : function() {

		var db = monk('localhost:27017/picinfo');
		// photo collection
		var picCollection = 'pics';
		const collectionPics = db.get(picCollection);
		
		collectionPics.count({}).then((num) => {

			var randNumber = parseInt((Math.random() * num + 1));

			collectionPics.find({}).then((docs) => {
				
				var selectedImageName = docs[randNumber-1];
				console.log(selectedImageName["imageName"]);
			
			}).catch((err) => {

			});
			

		  }).catch((err) => {
		    	console.log(err);
		  });
	}

}

exports.data = util_methods;