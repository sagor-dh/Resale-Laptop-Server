const express = require('express')
const app = express()
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oz1ak5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const categorysCollection = client.db('resell_laptop').collection('categorys')
    const newistProductsCollection = client.db('resell_laptop').collection('prodcts')
    const buyersProductCollection = client.db('resell_laptop').collection('buyers')
    const sellersProductCollection = client.db('resell_laptop').collection('sellers')
    const usersCollection = client.db('resell_laptop').collection('users')

    try {
        // Fetch all categorys from db
        app.get('/categorys', async (req, res) => {
            const query = {}
            const result = await categorysCollection.find(query).toArray()
            res.send(result)
        })

        app.put('/categorys', async (req, res) => {
            const categoty = req.body;
            const filter = { name: categoty }
            const options = { upsert: true };
            const updateDoc = {
                $set: categoty
            };
            const result = await categorysCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        // Fetch all Products from db
        app.get('/newistProduct', async (req, res) => {
            const query = {}
            const result = await newistProductsCollection.find(query).limit(10).sort({date: -1}).toArray()
            res.send(result)
        })

        app.post('/addNewistProduct', async (req, res) => {
            const product = req.body;
            const result = await newistProductsCollection.insertOne(product)
            res.send(result)
        })

        // Products fetch by category
        app.get('/products/:cata_id', async (req, res) => {
            const cataId = req.params.cata_id;
            const query = { cata_id: cataId }
            const result = await sellersProductCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/addProducts', async (req, res) => {
            const product = req.body;
            const result = await sellersProductCollection.insertOne(product)
            res.send(result)
            console.log(result)
        })

        // My Product route
        app.get('/myProduct', async (req, res) => {
            const email = req.query.email;
            const query = {userEmail: email}
            const result = await newistProductsCollection.find(query).toArray()
            res.send(result)
        })

        

        // Buyer add product her db
        app.post('/product', async (req, res) => {
            const product = req.body;
            const result = await buyersProductCollection.insertOne(product)
            res.send(result)
        })

        // Buyer get product her db
        app.get('/product', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const query = { email: email }
            const user = await buyersProductCollection.find(query).toArray()
            console.log(user)
            res.send(user)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.get('/user', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            res.send(user)
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello developer')
})

app.listen(port, () => {
    console.log('server is running')
})