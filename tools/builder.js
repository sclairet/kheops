
var fs = require('fs');
var path = require('path');
var rfs = require('recursive-fs');
 

var copyDemo = function copyDemo(dest, name, callback) {

	var lDest = path.resolve(dest,'./' + name);

	var _copyImpl = function _copyImpl() {
		fs.mkdir(lDest, function (err) {
		 	if (err) {
		    	console.error(err);
		  	}
			else {
				var src = path.resolve('./../demos/' + name);
				if (fs.existsSync(src)) {
					rfs.cpdirr(src, lDest, function (err) {
					 	if (err) {
					    	console.error(err);
					  	}
					  	else {
				  			rfs.cpdirr(path.resolve('./../lib'), lDest, function (err) {
							 	if (err) {
							    	console.error(err);
							  	}
							  	else {
						  			rfs.cpdirr(path.resolve('./../deps'), lDest, function (err) {
									 	if (err) {
									    	console.error(err);
									  	}
									  	else {
									  		console.log('- build demo ' + name);
									  	}
									} );
						  		}
					  		} );
				  		}
					} );
				}
				else {
					console.error('- demo \'' + name + '\' not found');
				}
			}
		} );
	};

	if (fs.existsSync(lDest)) {
		rfs.rmdirr(lDest, function (err) {
			if (err) {
				console.error(err);
			}
			else {
				_copyImpl();
			}
		} );
	}
	else {
	 	_copyImpl();
	}
};


if (process.argv.length > 2) {

	var dest = path.resolve(process.argv[2]);

	console.log('- destination folder: ' + dest);

	if (fs.existsSync(dest)) {

		var name = (process.argv.length > 3) ? process.argv[3] : 'all';

		if (name == 'trumpet') {
			copyDemo(dest, 'trumpet');
		}
		
		if (name == 'wave-cube') {
			copyDemo(dest, 'wave-cube');
		}
	}
	else {
		console.error('- destination folder not found');		
	}
}
else {
	console.error('- missing destination folder argument');
}
