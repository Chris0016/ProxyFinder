/*
To run:
  npm init -y
  npm install puppeteer
*/
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const BASE_URL = "https://proxy-tools.com/proxy/us";

(async () => {
	let browser = await puppeteer.launch({headless: false});
	let page = await browser.newPage();

	await page.goto(BASE_URL);
	await page.waitForTimeout('20000'); //Use this time to fill out captcha or comment out to if port number is not needed. 


	let proxyList = await collectProxies();
	//let proxyList = [];

	let rsltString = '';
	proxyList.forEach(proxy => {
		rsltString += 
		proxy.type + " " + proxy.ip + " " + proxy.port
		+ '\n';
	})

	await browser.close();

	console.log(proxyList);
	await fs.appendFile('output_proxy_list.txt', rsltString);

	

	async function collectProxies(){
		let proxyList = await page.evaluate(() => {
			const proxyFactory = (ip, port, type, speed) => {
				return {
					ip: ip,
					port: port,
					type: type,
					speed: speed,
				}
			}

			const PROXIES_TO_COLLECT = 30; //CHANGE ME MAX= 30
			let holder = [];
			let ip, port, type, speed;

			let getData = (a, b) => '.table > tbody:nth-child(2) > tr:nth-child(' + a +') > td:nth-child('+ b +')';
			const IP_NUM = 1;
			const PORT_NUM = 2;
			const TYPE_NUM = 3;
			const SPEED_NUM = 7;

	 		for(let i = 1; i <= PROXIES_TO_COLLECT ; i++){
		 		speed = document.querySelector(getData(i, SPEED_NUM)).innerText;

		 		//Comment out to get all speeds 
		 		if (speed !== 'Fast') 
		 			continue;
		 		//Comment out to get all speeds 

		 		ip = document.querySelector(getData(i, IP_NUM)).innerText;
		 		port = document.querySelector(getData(i, PORT_NUM)).innerText;
		 		type  = document.querySelector(getData(i, TYPE_NUM)).innerText;
	 			
	 			holder.push(proxyFactory(ip, port, type, speed));
	 		}

	 		return holder;

		 	});

		return proxyList; 	
	} 


})();