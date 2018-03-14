# MyFantasyGolf

### Installation Instructions

1. Clone this repository to your machine - look at git documentation for more information on how to do this.

2. Install [NodeJs](https://nodejs.org/en/) version 8 or better.  This will install the compiler necessary to build the web app and the execution environment for the server code.

3. Run the following command
>npm install

This will configure all the tools and libraries necessary to run the application.

4. Launch the UI and open your web browser to [localhost:1234](http://localhost:1234)
>npm run watch

### Database Instructions

All the files are currently checked in, but in the future they probably will not be.  Download the MongoDB from mongodb.com and put it in a directory under server/mongo.

Next, create a sibling directory called 'db'.

To run the database and make it accessible to the server process execute the script:
>run_db.sh
