var express = require('express'),
	app = express(),
	storage = require('node-persist'), //Store data in json file locally to remember counter value 
	auth = require('http-auth'),
	counter,
	basic = auth.basic({
        realm: "ExampleRealm"
    }, (username, password, callback) => {              	
		callback(username === "demo" && password === "abc123");
    }
);

app.use(auth.connect(basic));

//Initialize storage for counter
storage.init({continuous: true}).then(function() {
  storage.getItem('counter').then(function(value){
  	counter = value || 0;
  })
});

app.get('/me', function(req, res){	
	setTimeout(function(){
		counter += Number(req.query.increment);
		res.send({
			user : req.user, 
			delay : req.query.delay, 
			counter : counter
		});
	}, req.query.delay*1000);

	//Set latest counter value
	storage.setItem('counter',counter)
});

var server = app.listen(3000, function () {
   console.log("Http server listening at http://%s:%s", server.address().address, server.address().port)
})
