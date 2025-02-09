const express = require('express');
const cors = require('cors');
//const countries = require('./data/countries.json');
//const population = require('./data/population.json');

const app = express();
const path = require('path');

const data = {
    name: require('./data/name.json'),
    population: require('./data/population.json'),
    income: require('./data/income.json'),
    pib: require('./data/pib.json'),
    area: require('./data/area.json'),
};

app.use(cors());

const port = 3000;

function transformData(list) {
    return Object.keys(list).map((key) => {
        return {cod: key, data: list[key]}
    });
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/availableDataTypes', (req,res) => {
    res.json(Object.keys(data.names));
});

app.get('/api/countries', (req, res) => {
    res.json(Object.keys(data.name));
});

app.get('/api/data/:cod', (req,res) => {
    const cod = req.params.cod;
    if (data[cod]) {
        res.json(transformData(data[cod]));
    } else {
        res.status(404).end();
    }
});

app.get('/api/country/:country', (req,res) => {
    const country = req.params.country;
    console.log(country);
    if (Object.keys(data.name).includes(country)) {
        const countryObj = {};
        Object.keys(data).forEach(prop => {
            if (data[prop][country]) {
                countryObj[prop] = data[prop][country];
            }
        })
        res.json(countryObj);
    } else {
        res.status(404).end();
    }
});

app.listen(port, () => {
    console.log(`Servidor API global-data en http://localhost:${port}`);
});