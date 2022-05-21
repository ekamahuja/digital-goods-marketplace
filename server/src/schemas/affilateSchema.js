import mongoose from 'mongoose';



const affilateSchema = mongoose.Schema({
    userID: {type: Number, required: true},
    affilateId: {type: String, required: true}, 
    visits: {type: Number, required: true, default: 0}
}, {
    timestamps: true
})