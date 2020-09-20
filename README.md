# Project Excel 1.0 Beta

[![Build Status](https://github.com/erikbridges/excel-project)](https://github.com/erikbridgesr)

Project Excel is a node js application that allows users to create a excel file containing the following...

- Name
- Phone Number
- Cash App
- Number of Spots

# What's in this Version?

- The basic function has been added. The ability to create an an excel file containing a single entry that has been created by the user. Once created after 10 seconds it will be reseted and added to a newly created master.xlsx file. (It can be changed to 2 days for production purposes)
- Validation has been added! The program has the ability to check if the information is correct. This is to avoid incorrect data from being submitted.
- A Debug logger has been added. The program can log errors in a debug.log file

# Noticable Bugs

- None at the moment.

### Tech

This project uses several libraries in order to work properly:

- [React/JS] - A JavaScript library for building user interfaces!
- [node.js] - evented I/O for the backend
- [ExcelJS] - library for creating and modifing excel files
- [Express] - fast node.js network app framework [@tjholowaychuk]



### Installation

This is a development application. You must have node js 12.18.3 or higher (LTS or current) release installed alongside npm. Both which can be installed here.
https://nodejs.org/en/download/

Optional: You may have git installed on your machine. Go to
https://git-scm.com/
and follow the installation instructions.

If you have git installed, `cd ` into your desired folder or go to the desired folder in your computer. Open a terminal and enter these commands.

```sh
$ cd myfolder
$ git clone git@github.com:erikbridges/excel-project.git .
$ yarn
or
$ npm install
or
$ npm i
```

You must also install the client node modules as well by doing the following commands.

```sh
$ cd client
$ yarn
or
$ npm install
or
$ npm i
```

Once all your node modules are installed head to the root directory and run `npm run dev` or `yarn run dev` if you have yarn installed.

```sh
$ npm run dev
or
$ yarn run dev
```

That's it! Have fun! See a bug? No problem, email me @ contact@solitivesolutions.com! Thank you!
