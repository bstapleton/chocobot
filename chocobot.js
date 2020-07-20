'use strict';
let auth = require('./auth.json');
const Discord = require('discord.js');
const axios = require('axios');
const db = require('./database.js');

const client = new Discord.Client();
const allowedDice = [2,4,6,8,10,12,20,100];
const maximumAmountOfDice = 20;


// login to Discord
client.login(auth.discord.token);

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    var content = message.content;

    // Listen for commands, '!'
    if (content.substring(0, 1) == '!') {
        let command = content.substring(1).split(' '); // The command given, e.g. !roll 1d6
        let args = command[1]; // The arguments for the command, e.g. 1d6

        if (command[0] === 'roll') {
            // Handle dice roll options.
            let dice = args.split('d');
            let amount = parseInt(dice[0]);
            let sides = parseInt(dice[1]);
            console.log(args, dice, amount, sides);
            console.log(message.author.id);

            if (amount < 1) {
                message.channel.send(`${message.author.username}, you cannot roll less than one die, you numpty.`);
            } else if (amount > maximumAmountOfDice) {
                message.channel.send(`${message.author.username}, the maximum number of dice you can roll at once is ${maximumAmountOfDice}.`);
            } else if (allowedDice.includes(sides)) {
                axios.get(`https://www.random.org/integers/?num=${amount}&min=1&max=${sides}&col=1&base=10&format=plain&rnd=new`)
                .then(function(response) {
                    if (amount > 1) {
                        if (sides === 2) {
                            message.channel.send(`${message.author} tried to throw all their money on the floor. What a mess :disappointed:`);
                        } else {
                            let formatResponse = str => str.split(/\r?\n/);
                            let responseArray = formatResponse(response.data);
                            responseArray[responseArray.length - 1] === '' ? responseArray.pop() : responseArray; // random.org returns an extraneous \n, so pop it off if its there. Future-proofs in case they ever fix it.
                            message.channel.send(`${message.author} rolled ${amount} d${sides}: [**${responseArray.join(', ')}**] for a total of ***${responseArray.reduce((a, b) => parseInt(a) + parseInt(b))}***`);
                            responseArray.map(response => {
                                db.insertRoll(message.author.id, sides, response);
                            });
                        }
                    } else {
                        if (sides === 2) {
                            message.channel.send(`${message.author} flipped a coin: ***${response.data === 1 ? `Heads!` : `Tails!`}***`);
                        } else {
                            message.channel.send(`${message.author} rolled a d${sides}: **${response.data}**`);
                        }
                    }
                });
            } else {
                message.channel.send(`${message.author.username}, that's not on the list of dice that can be rolled: [${allowedDice.join(', ')}].`);
            }
        } else {
            switch(command[0]) {
                case 'rollinit':
                    db.init();
                    break;
                case 'rollstats':
                    return new Promise((resolve, reject) => {
                        db.getStats()
                        .then((data) => {
                            message.channel.send(data);
                        }).catch(() => console.error(reject));
                    });
                    break;
                case 'wench':
                    message.channel.send(':beer:');
                    break;
             }
         }
     }
});
