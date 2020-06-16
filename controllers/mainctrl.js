var fs = require('fs');
var path = require('path');
const readline = require('readline');
const { once } = require('events');
var Client = require('ssh2').Client;
let cp = require('child_process');


var filePath = path.join(__dirname, '../public/data/RUL_Data.csv')
var filePath_sensor = path.join(__dirname, '../public/data/Sensor_Data.csv')

var dataAdded = false;
exports.showIndex = function (req, res) {
	res.render("index.ejs");
}



exports.getData = async function (req, res) {
	console.log("=========Get data==========")
	var year = []
	var data = []
	try {
		const rl = readline.createInterface({
			input: fs.createReadStream(filePath),
			crlfDelay: Infinity
		});
		var n = 0
		rl.on('line', (line) => {
			if (n == 0) {
				//table header: do nothing
				console.log("line " + n + ": " + line)
			} else {
				var colData = line.toString().split(",")
				year.push(colData[2]);
				data.push(colData[3])
				console.log("line " + n + ": " + line)
			}
			n++;
		});
		await once(rl, 'close');
		res.json({ "status": "ok", "year": year, "rul": data });

	} catch (err) {
		console.error(err);
		res.json({ "status": "error" });
	}
}

exports.addData = function (req, res) {
	console.log("=========Add data==========")
	if (!dataAdded) {
		dataAdded = true;
		callPython((data) => {
			if (data != "") {
				fs.open(filePath, 'a', (err, fd) => {
					if (err) throw err;
					fs.appendFile(fd, 'Motor20,,2020,' + data + '\n', 'utf8', (err) => {
						fs.close(fd, (err) => {
							if (err) throw err;
						});
						if (err) throw err;
					});
				});
				console.log("new data added ok")
				res.json({ "status": "new data added ok" });
			} else {
				dataAdded = false;
				res.json({ "status": "python model error" });
			}
		})
	} else {
		console.log("data already added")
		res.json({ "status": "already added" });
	}
}

function callPython(callback) {
	console.log("calling python...")
	//******************for window********************** */
	// cp.exec('cd RUL_Prediction && python RUL_prediction.py', function (error, stdout, stderr) {
	//******************for ubuntu********************** */
	cp.exec('cd RUL_Prediction; python RUL_prediction.py', function(error, stdout, stderr){
		if (error) {
			console.error('error: ' + error);
			callback("")
			return;
		}
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + typeof stderr);

		//******************for window********************** */
		// var result = stdout.split('\r\n')[2]
		//******************for ubuntu********************** */
		var result=stdout.split('\n')[2]

		callback(result)
	});

}

exports.resetData = function (req, res) {
	console.log("=========Reset data==========")
	fs.writeFile(filePath, "MOTORNAME,STARTDATE,NUMCYCLE,RUL\nMotor20,,2016,98.61\nMotor20,,2017,93.24\nMotor20,,2018,91.81\nMotor20,,2019,85.4\n", 'utf8', (err) => {
		if (err) {
			throw err;
		}
	});
	dataAdded = false;
	res.json({ "status": "data reset ok" });
}

exports.sensorData = function (req, res) {
	console.log("=========Add sensor data==========")
	console.log(req)
	fs.writeFile(filePath_sensor, "1,50,0.003", 'utf8', (err) => {
		if (err) {
			throw err;
		}
		res.json({ "status": "data received" });
	});
}
exports.getSensorData = function(req, res){
	console.log("=========Get sensor data==========")
	fs.readFile(filePath_sensor,'utf8',(err, data) => {
		if (err) throw err;
		console.log(data)
		res.json({ "results": data });
	  });

}

//**********************below not in use************************* */
// function callPythonssh(callback) {
// 	var RULdata;
// 	var RUL_result = "";
// 	var conn = new Client();
// 	conn.on('ready', function () {
// 		console.log('Client :: ready');
// 		//******************for window********************** */
// 		conn.exec('cd /d D:\\RUL\\RUL_Prediction && python RUL_prediction.py', function (err, stream) {
// 			//******************for ubuntu********************** */
// 			// conn.exec('cd /home/i3-vm-test1/RUL/RUL_Prediction; python RUL_prediction.py', function (err, stream) {
// 			if (err) throw err;
// 			stream.on('close', function (code, signal) {
// 				console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
// 				//******************for window********************** */
// 				RUL_result = RULdata.split('\r\n')[2]
// 				//******************for ubuntu********************** */
// 				// RUL_result=RULdata.split('\n')[2]

// 				conn.end();
// 			}).on('data', function (data) {
// 				console.log('STDOUT: ' + data);
// 				RULdata = data.toString();
// 			}).stderr.on('data', function (data) {
// 				console.log('STDERR: ' + data);
// 			});
// 		});
// 	}).connect({
// 		host: '127.0.0.1',
// 		port: 22,
// 		username: '',
// 		password: ''
// 	});
// 	conn.on("error", function (err) {
// 		console.log("=============ssh connection error==============")
// 		console.log(err)
// 		conn.end();
// 	});
// 	conn.on('close', function () {
// 		callback(RUL_result)
// 		console.log("ssh connection close...")
// 	})
// }




