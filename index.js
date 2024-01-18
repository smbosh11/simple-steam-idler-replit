const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const keep_alive = require('./keep_alive.js')

const RateLimit = require('express-rate-limit');

var limiter = new RateLimit({
  windowMs: 5*60*1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

var username = process.env.username;
var password = process.env.password;
var shared_secret = process.env.shared;

var games = [730, 271590, 2073850, 1085660, 346110];  // Enter here AppIDs of the needed games
var status = 1;  // 1 - online, 7 - invisible

const user = new steamUser();
user.use(limiter); // applying rate limit
user.logOn({"accountName": username, "password": password, "twoFactorCode": steamTotp.generateAuthCode(shared_secret)});
user.on('loggedOn', () => {
	if (user.steamID != null) console.log(user.steamID + ' - Successfully logged on');
	user.setPersona(status);               
	user.gamesPlayed(games);
});
