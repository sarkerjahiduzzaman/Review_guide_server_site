const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.a3ye7y2.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db('review').collection('services');
        const reviewCollection = client.db ('review').collection('reviews');

        app.get('/services', async(req, res) =>{
            const query ={}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/review/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
        app.delete('/allreviews/:id',async(req,res)=>{
            const id =req.params.id;
            const query={_id:ObjectId(id)}
            //console.log('trying to delete',id)
            const result=await reviewCollection.deleteOne(query)
            console.log(result)
            res.send(result)

        }) 
        app.get('/reviews', async(req, res) =>{
            console.log(req.query.email);
            let query ={};
            if (req.query.email){
                query={
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.get('/alllreviews:/id', async(req, res) =>{
        
            const id =req.params.id;
            const query={_id:ObjectId(id)}
            
            
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        ,
        app.post('/services', async(req, res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(err => console.error(err));

