require('dotenv').config();
const express=require('express');
const app=express();
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port=process.env.PORT || 5000; 

// middleware
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5175','https://houzezdeal.web.app','https://taskmateplus.netlify.app'],
    credentials: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n6sp6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
    try {
         const db=client.db('task-mate')
         const usersCollection=db.collection('users')
         const tasksCollection=db.collection('tasks')



        app.get('/tasks',async(req,res)=>{
            const email = req.query.email;
            let result;
    
            if (email) {
                result = await tasksCollection.find({ userEmail: email }).sort({ order: 1 }).toArray();
            } else {
                result = await tasksCollection.find().sort({ order: -1 }).toArray();
            }
    
            res.send(result);
        })
   

        //save all user to database
        app.post('/users/:email', async (req, res) => {
            const email = req.params.email
            const user=req.body
            const query = { email }
      
            const isExist= await usersCollection.findOne(query)
            if (isExist) {
              return res.status(400).send({ message: 'user already exist' })
            }
            const result = await usersCollection.insertOne(user)
            res.send(result)
            console.log(result);
      
          })


        app.post('/tasks',async(req,res)=>{
            const { title, description, category, userEmail,userName } = req.body
            const taskCount = await tasksCollection.countDocuments({ userEmail });
  const newTask = {
    title,
    description,
    category,
    userEmail,
    userName,
    order: taskCount, // Assign order based on total tasks
    timestamp: new Date(),
  };

  const result = await tasksCollection.insertOne(newTask);
  res.json(result);
        })          
         

        app.put("/tasks/:id", async (req, res) => {
          const { id } = req.params;
          const { title, description, category } = req.body;
        
          try {
            const result = await tasksCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: { title, description, category } }
            );
        
            if (result.modifiedCount > 0) {
              res.status(200).json({ success: true, message: "Task updated successfully" });
            } else {
              res.status(400).json({ success: false, message: "Task not updated" });
            }
          } catch (error) {
            res.status(500).json({ success: false, error: error.message });
          }
        });
        
        app.patch("/tasks/:id", async (req, res) => {
          const { id } = req.params;
          const { category } = req.body;
        
          try {
            const result = await tasksCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: { category } }
            );
        
            if (result.modifiedCount > 0) {
              res.status(200).json({ success: true, message: "Task updated successfully" });
            } else {
              res.status(400).json({ success: false, message: "Task not updated" });
            }
          } catch (error) {
            res.status(500).json({ success: false, error: error.message });
          }
        });
        
          

          app.put("/tasks/reorder", async (req, res) => {
            try {
                const { taskId, newIndex, category } = req.body;
        
                // Validate taskId is a valid 24-character hex string
                if (!taskId || !ObjectId.isValid(taskId)) {
                    return res.status(400).json({ message: "Invalid task ID" });
                }
        
                const objectId = new ObjectId(taskId);
                const task = await tasksCollection.findOne({ _id: objectId });
                if (!task) return res.status(404).json({ message: "Task not found" });
        
                const tasks = await tasksCollection.find({ category }).sort({ order: 1 }).toArray();
                const movedTask = tasks.find((t) => t._id.toString() === taskId);
        
                if (!movedTask) return res.status(404).json({ message: "Task not found in category" });
        
                tasks.splice(tasks.indexOf(movedTask), 1);
                tasks.splice(newIndex, 0, movedTask);
        
                const bulkOps = tasks.map((task, index) => ({
                    updateOne: {
                        filter: { _id: task._id },
                        update: { $set: { order: index } },
                    },
                }));
        
                await tasksCollection.bulkWrite(bulkOps);
                res.json({ message: "Task reordered successfully" });
            } catch (error) {
                console.error("Error reordering tasks:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });

        app.delete('/tasks/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:new ObjectId(id)}
            const result=await tasksCollection.deleteOne(query)
            res.send(result)
        })



      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('task-mate server is running')
})

app.listen(port,()=>{
    console.log(`task-mate server is running on port ${port}`)
})