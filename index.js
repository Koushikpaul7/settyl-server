const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT ||5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://db_user:f5SAA0XIgxFh6XiU@cluster0.ipy50tk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try {
        await client.connect();
        const employeeCollection = client.db('settyl').collection('employee');

        //all employee
        app.get('/employee', async (req, res) => {
            const query = {};
            const cursor = employeeCollection.find(query);
            const employees = await cursor.toArray();
            console.log(employees)
            res.send(employees);

        })

        // create employee 
        app.post('/employee', async (req, res) => {
            const newEmployee = req.body;
            const result = await employeeCollection.insertOne(newEmployee);
            res.send(result);
        });
        // delete employee
        app.delete('/employee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await employeeCollection.deleteOne(query);
            res.send(result);
        });

        //update employee
        app.put('/employee/:id',async(req,res)=>{
            const id=req.params.id
            const updateEmployee=req.body
              const filter ={_id:ObjectId(id)}
              const options = { upsert: true };
              const updateDoc={
                $set:{
                   name:updateEmployee.name,
                   salary:updateEmployee.salary,
                   age:updateEmployee.age
                }
              }
              const result = await employeeCollection.updateOne(filter,updateDoc,options);
              res.send(result)
          })
}
finally{}
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello from Koushik!')
  })


app.listen(port, () => {
  console.log(`Settyl server listening on port ${port}`)
})