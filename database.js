const mongoose = require('mongoose');
mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify',false);
mongoose.set('useUnifiedTopology',true);


class Database {
    constructor() {
        this.connect();
    
    }

    connect() {
        mongoose.connect('mongodb+srv://Admin:Admin@cluster0.ufafy.mongodb.net/shoppingDB?retryWrites=true&w=majority')
.then(() => {
    console.log('Database connection successful!');
})
.catch((e) => {
    console.log('Database connecton error '+e);

})
    }
}

module.exports = new Database();

