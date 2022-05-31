const fs = require('fs/promises');
const csv = require('csvtojson');
const { Z_FIXED } = require("zlib");
const { Parser } = require("json2csv");

(async () =>{
	const proxiesList = await csv().fromFile('Free_Proxy_List.csv');
	console.log(proxiesList);


	//const filteredList = new Parser({fields: ["protocols", "ip", "port" ]}).parse(proxiesList);
	let rlstString = '';
	for(let proxy of proxiesList){
		rlstString +=  proxy.protocols + ' ' + proxy.ip + ' ' + proxy.port + '\n';
	}

	//console.log(filteredList);
	fs.writeFile("outInCSV.csv", rlstString);



} )();