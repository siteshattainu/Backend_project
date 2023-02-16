const { urlencoded } = require('express')
const express = require('express')
const bcrypt = require('bcrypt');
const app = express()
const User = require('./database')
app.use(express.json())
app.use(urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send("Hello")
})

app.post('/userLogin', async (req, res) => {
    const data = req.body;
    let user_password = data.password;
    let user_email = data.email;
    const user_data = await User.findOne({email: user_email})
    // console.log(user_data);
    if(!user_data){
       res.status(400);
       res.send("User doesn't exist"); 
    }
    let db_password = user_data.password;
    const isValid = await bcrypt.compare(user_password.toString(), db_password);
    if(isValid){
        res.send("Send to home page")
    }
    res.status(400)
    res.send("Incorrect Password")
})

app.post('/userSignup', async (req, res) => {
    const data = req.body;
    if(data.password !== data.cpassword){
        res.send("Incorrect Password");
    }
    let user_name = data.name;
    let user_email = data.email;
    let user_password = data.password;
    if(!user_name || !user_email || !user_password){
        res.status(400)
        res.send("Fields are empty")
    }
    const user_data = await User.findOne({email: user_email})
    if(user_data){
        res.status(400);
        res.send("User already exists"); 
    }
    const salt = await bcrypt.genSalt(10)
    let hashed_password = await bcrypt.hash(user_password.toString(), salt)
    // hashed_password = hashed_password.toString()
    const data_to_store = new User({name: user_name, email: user_email, password: hashed_password})
    const result = await data_to_store.save()
    res.send("Signup successful")
})

app.get('/landingpage', () => {})

app.listen(5000, () => {
    console.log("Listening on Port 5000")
})