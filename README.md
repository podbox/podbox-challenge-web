# The Podbox Web Challenge!
<img align="right" alt="We want you!" title="We want you!" width="350px" src="https://s3.amazonaws.com/podbox-blog/blog/wp-content/uploads/2015/05/we-want-you.jpg" />
So you are willing to have fun working along the R&D team of [Podbox](https://www.podbox.com/about-us)? Here is the first step, which will give you the freedom to demonstrate some of your web developer skills!

<br clear="all" />

This repository contains a skeleton of a contacts manager web application. The server handles a list of contacts which evolves randomly through time: some fields will be updated (firstname, email, etc.), some contacts will be created, others will be deleted. These updates are sent to the browser through a websocket.

Your goals are:
* to display the list of contacts with the front technologies you like to play with
* to update the display when contact updates come
* when you like your solution, you can submit it by sending us your proposal to `rd+challenge@podbox.com`

You are not expected neither to modify the server code (`server.js`) nor to add new server functionalities (like contact edition). Focusing on the front end already gives you lots of ways to impress us :)

How will you impress us?
* the visual result of your solution
* the coolness of the code: a balanced level of engineering and integration which illustrates an efficient use of the technologies involved and an ease of maintenance of the code

The spirit of the challenge is to let you have fun, not to trap you (or...).

## Setup
Enter the challenge!
* retrieve this skeleton repository
* install Node.js or Io.js on your computer
* install the application dependencies by running `npm i` in the terminal at the root of the repository
* launch the web application with `npm start`
* visit [http://localhost:9999/](http://localhost:9999/) in your browser
* press `ctrl`+`c` in the terminal to stop the web application

Notes:
* **we will test your submission** by setting up the project with `npm i`, running it with `npm start` and then going to [http://localhost:9999/](http://localhost:9999/). Make sure this works!
* we will spend about half an hour reviewing your submission, so don't waste days writing too much
* as a basic packaging step, the predefined `prestart` phase (see the scripts in `package.json`) moves all the `/dev` files into `/public` which are served by the server
