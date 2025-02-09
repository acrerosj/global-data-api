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
    const availableDataTypes = Object.keys(data);
    console.log('Devolviendo los datos disponibles: ');
    console.log(availableDataTypes);
    console.log('-------------------------------------------');
    res.json(availableDataTypes);
});

app.get('/api/codes', (req, res) => {
    const codes = Object.keys(data.name);
    console.log('Devolviendo los códigos de países: ');
    console.log(codes);
    console.log('-------------------------------------------');
    res.json(codes);
});

app.get('/api/names', (req, res) => {
    console.log('Devolviendo los nombres de los países: ');
    console.log(data.name);
    console.log('-------------------------------------------');
    res.json(data.name);
});

app.get('/api/data/:dataType', (req,res) => {
    const dataType = req.params.dataType;
    if (data[dataType]) {
        console.log('Devolviendo los datos de la propiedad: ' + dataType);
        const result = transformData(data[dataType]);
        console.log(result);
        res.json(result);
    } else {
        console.log('No encontrada la propiedad: ' + dataType);
        res.status(404).end();
    }
    console.log('-------------------------------------------');
});

app.get('/api/country/:country', (req,res) => {
    const country = req.params.country;
    console.log(country);
    if (Object.keys(data.name).includes(country)) {
        console.log('Devolviendo datos del país con código: ' + country);
        const countryObj = {code: country};
        Object.keys(data).forEach(prop => {
            if (data[prop][country]) {
                countryObj[prop] = data[prop][country];
            }
        })
        console.log(countryObj);
        res.json(countryObj);
    } else {
        console.log('No encontrado el país con el código: ' + country);
        res.status(404).end();
    }
    console.log('-------------------------------------------');
});

app.delete('/api/country/:country', (req,res) => {
    const country = req.params.country;
    Object.keys(data).forEach(prop => {
        if (data[prop][country]) {
            delete data[prop][country];
        }
    })
    console.log('Se elimina el país con código ' + country);
    console.log('Aunque no esté siempre se devuelvo estado 204 sin contenido');
    res.status(204).end();
});

app.listen(port, () => {
    console.log(`Servidor API global-data en http://localhost:${port}`);
});