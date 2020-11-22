const express = require('express');
const keys = require('./config/keys');

const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//handlebars middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set the static folder for images etc

app.use(express.static(`${__dirname}/public`));

//index route

app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    })
});
app.get('/success', (req, res) => {
    res.render('success')
})
//charge route
app.post('/charge', (req, res) => {
    var amount = 2500;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description:'web development ebook',
        currency: 'usd',
        customer: customer.id
    }))
    .then(charge => res.render('success'))
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started on ${port}`))