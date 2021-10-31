const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const ObjectId = require('mongodb').ObjectId;

// middleware
app.use(cors());
app.use(express.json());

// user: mydbuser1
// pass: h38jlgZbqifdPZUi

const uri = "mongodb+srv://mydbuser1:h38jlgZbqifdPZUi@cluster0.jr5y0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();

        // have to create a database with the name- metlife & collection- services
        const database = client.db("metlife");
        const usersCollection = database.collection("services");
        const orderCollection = database.collection("orders");
        const reviewCollection = database.collection("users");
        const faqCollection = database.collection("faq");

        // get api
        app.get('/services', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        // find a specific user
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('load user with id: ', id);
            res.send(user);
        })

        // post api
        app.post('/services', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added user', result);
            res.send(result);
        })

        // update
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

        // delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            // res.json(1);
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })

        // Add Oders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            // res.json(1);
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log(result);
            res.json(result);
        })

        app.get('/users', async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        })

        app.get('/faq', async (req, res) => {
            const cursor = faqCollection.find({});
            const faq = await cursor.toArray();
            res.send(faq);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('My First MongoDB');
})

app.listen(port, () => {
    console.log('listening to port', port);
});