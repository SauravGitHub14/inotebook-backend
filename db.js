const mongoose = require('mongoose');
// const mongoURI = "mongodb+srv://saurav:saurav123@cluster0.yhfmevt.mongodb.net/?appName=Cluster0"
// const mongoURI = "mongodb+srv://saurav_123:Saurav123@cluster0.yhfmevt.mongodb.net/inotebook?retryWrites=true&w=majority&appName=Cluster0";
const mongoURI = "mongodb+srv://saurav_1234:saurav1234@cluster0.ukqx8du.mongodb.net/?appName=Cluster0";
const connectToMongo = async () => {
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,})
    .then( () =>  console.log("Connected to MongoDB successfully"))
    .catch( (error) => {
        console.log("Issuse in DB Connection");
        console.error(error.message);
        process.exit(1);
    })
       
    
}

module.exports = connectToMongo;

