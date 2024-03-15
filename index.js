require('dotenv').config();

//WebsiteStuff
const express = require('express');
const fs = require('fs');
const util = require('util')
const path = require('path');
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

let Pages = [];

fs.readdir('views/pages', function(err, files) {
    files = files.filter(file => path.extname(file) === '.ejs');

    for(let i = 0; i < files.length; i++) {
        Pages.push(files[i]);
    }
});

let Services = {};

fs.readFile('services.json', 'utf8', (error, data) => {
    if(error) {
        return console.log(error);
    }

    let parsedData = JSON.parse(data);

    for(let service in parsedData) {
        Services[service] = parsedData[service]
    }
});

// Middleware Routes
app.get('/', (req,res) => {
    res.render('index', { pages: Pages, page: `pages/Home.ejs` });
});

app.get('/load', (req,res) => {
    if(req.query.page !=null) {
        if(req.query.page === "Home.ejs") {
            res.redirect('/');
        } else if(req.query.page == "Services.ejs") {
            res.render('index', { pages: Pages, page: `pages/${req.query.page}`, services: Services });
        } else {
            try {
                res.render('index', { pages: Pages, page: `pages/${req.query.page}` });
            } catch(err) {
                res.redirect('/');
            }
        }
    } else {
        res.redirect('/');
    }
});

app.get('*', function(req, res) {
    res.render('errorpage', { pages: Pages });
});

//Listeners for website
app.listen(process.env.PORT || 5000);