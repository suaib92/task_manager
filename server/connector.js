const mongoose = require("mongoose")

function connector() {
  mongoose.connect("mongodb+srv://suaib8211:t7Aj2B4IU74VT1Ne@cluster0.028gwzw.mongodb.net/task_manager?retryWrites=true&w=majority"
  , {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>{
   console.log("mongoose is live now")
}).catch((err)=>{
console.log({err})
})}

module.exports = connector