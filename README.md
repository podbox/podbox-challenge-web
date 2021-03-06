This challenge is related to the [Podbox's growth hacker position](https://www.podbox.com/blog/podbox-recruits-a-web-developer-marketer-growth-hacker-rennes/). **This position has been filled** as of the 1st September 2015. Thanks to all the candidates who have participated in this challenge, you were awesome and the competition was tough. Stay tuned on [Podbox job offers stream](https://www.podbox.com/blog/category/job-offers/), Podbox hires often.

# The Podbox web Challenge!
<img align="right" alt="We want you!" title="We want you!" width="350px" src="https://s3.amazonaws.com/podbox-blog/blog/wp-content/uploads/2015/07/Growth-Hacking-Your-Startup-Be-A-Pirate-1024x512.jpg" />
So you are willing to have fun working along with the [Podbox](https://www.podbox.com/about-us) team? Here is the first step, which will give you the freedom to demonstrate some of your web developer skills!

<br clear="all" />

## The game
This repository contains a skeleton of a contacts manager web application. The server handles a list of contacts which evolves randomly through time: some fields will be updated (firstname, email, etc.), some contacts will be created, others will be deleted. These updates are sent to the browser through a websocket.

Your goals are:
* to display the list of contacts with the front technologies you like to play with
* to update the display when contact updates come
* when you like your solution, you can submit it by sending us your proposal to `rd+challenge@podbox.com`

You are not expected neither to modify the server code (`server.js`) nor to add new server functionalities (like contact edition). Focusing on the front end already gives you lots of ways to impress us :)

## How will you impress us?
* the visual result of your solution
* the coolness of your code: a balanced level of engineering and integration which illustrates an efficient use of the technologies involved and an ease of maintenance of the code

The spirit of the challenge is to let you have fun, not to trap you (or...).

Notes:
* **we will test your submission** by setting up the project with `npm i`, running it with `npm start` and then going to [http://localhost:9999/](http://localhost:9999/). Make sure this works!
* we will spend about half an hour reviewing your submission, so don't waste days writing too much code (it is just a challenge)
* as a basic packaging step, the predefined `prestart` phase (see the `scripts` property in `package.json`) moves all the `/dev` files into `/public` which are served by the server

## Setup
Enter the challenge!
* retrieve this skeleton repository
* install Node.js or Io.js on your computer
* install the application dependencies by running `npm i` in the terminal at the root of the repository
* launch the web application with `npm start`
* visit [http://localhost:9999/](http://localhost:9999/) in your browser
* press `ctrl`+`c` in the terminal to stop the web application
