import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true, // en caso de que no se quieran repetidos
    },
    available:{
        type: Boolean,
        default: true,
    },
    price:{
        type: Number,
        default: 0,
    },
    description:{
        type: String,
    },
    userId:{
        type: Schema.Types.ObjectId, // Id de Mongo, como r¿una relación en SQL
        ref: 'User',
        required: true,
    },

    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'Category', // Mismo nombre que se define el modelo
        required: true,
    }
});

// Afecta a como se manda por la API
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret, options){
        delete ret._id;
    },
});

export const ProductModel = mongoose.model('Product', productSchema);