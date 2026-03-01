import express from 'express';

const appp = express();

appp.get("/", (reqw, res ) => {
    res.json({"messagee" : "Hello World!"})
})

appp.listen(8000, () => {
    console.log("Server is running on port 8000");
})