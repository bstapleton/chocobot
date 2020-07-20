## Chocobot dice rolling bot

I started this just to play around with some of Discord's API things. It's a chatbot that responds to a bunch of commands, but is most useful if you need to roll some dice for tabletop games, such as D&D.

Unlike some(?) dice rollers, this hooks into the random.org API in order to get some more true-randomness to the results.

Feel free to fork it and adapt to your needs. Its very WIP right now, and I don't get a lot of time to work on it extensively.

It should be noted also that there are much more comprehensive dice rolling bots available for Discord, and you'll likely have a better time with those!

### Todo list

* Global stats and averages
* Personal stats and averages
* Proper saving of data
* Probably much more that I haven't thought of yet!

### How to run it

#### Prerequisites

You'll need to generate a token from the Discord development site. You're not having mine, for obvious reasons.

#### Process

1. Pull down the repo
1. Run `npm install`
1. In the project root, create a `auth.json` file. This will be where you stash your Discord token. I have provided an example below.

```json
{
    "discord": {
        "token": "PUT YOUR TOKEN HERE"
    },
    "database": {
        "username":"",
        "password": "",
        "databaseName": ""
    }
}
```

The `auth.json` file is excluded from the repo, so you don't go accidentally exposing your token/s to the world. Please remember yo keep your secrets secret :wink: 
