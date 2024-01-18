const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const keep_alive = require('./keep_alive.js')

const logInToSteamAccount = (username, password, shared_secret, games, status) => {
  const user = new steamUser();
  user.logOn({"accountName": username, "password": password, "twoFactorCode": steamTotp.generateAuthCode(shared_secret)});
  user.on('loggedOn', () => {
    if (user.steamID != null) console.log(user.steamID + ' - Successfully logged on');
    user.setPersona(status);               
    user.gamesPlayed(games);

    // Listen for log out event
    user.on('disconnected', () => {
      console.log('Logged out');
    });
  });

  // Function to log out
  const logOut = () => {
    user.logOff();
  }

  return logOut;
}

const username1 = process.env.username;
const password1 = process.env.password;
const shared_secret1 = process.env.shared;
const games1 = [730, 271590, 2073850, 1085660, 346110];
const status1 = 1;
