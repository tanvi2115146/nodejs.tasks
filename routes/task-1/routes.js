
const express=require('express');
const students = require('./students');


const app=express();
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("API is working");
})

app.get('/users',(req,res)=>{
    res.send(students);
})

app.post('/users',(req,res)=>{
    if(! req.body.password){
         return res.send({error: "Password is required..."})
    }
    const user ={
        id: students.length+1,
        first_name: req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password:req.body.password
    }
    students.push(user)
    res.send(students)
})

app.put('/users/:id',(req,res)=>{
    let id= req.params.id
    let first_name =  req.body.first_name
    let last_name = req.body.last_name
    let email = req.body.email
    let password = req.body.password

    let index = students.findIndex((students) => {
        return (students.id == Number.parseInt(id))
    
})
   
   if(index >=0){
        let std = students[index]
        std.first_name=first_name
        std.last_name=last_name
        std.email= email
        std.password=password
        return res.send(std)
    } 
    else{
      res.send("error")
    }
})



app.delete('/users/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    const index = students.findIndex(user => user.id === id);

    if (index !== -1) {
        const deletedUser = students.splice(index, 1);
        return res.send({ message: "User deleted", user: deletedUser[0] });
    } else {
        return res.status(404).send({ error: "User not found" });
    }
});





app.listen(3000,()=>{
    console.log(`server is running on http://localhost:3000}`)
})