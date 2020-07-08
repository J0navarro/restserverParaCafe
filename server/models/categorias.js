const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'la descripcion es necesaria'],
        unique: true,
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    img: {
        type: String,
        required: false
    }


});
categoriaSchema.methods.toJSON = function() {
    let cat = this;
    let catObject = cat.toObject();

    return catObject;
}
categoriaSchema.plugin(uniqueValidator, {
    message: 'Error, el campo {PATH} ya está registrado.'
});

module.exports = mongoose.model('Categoria', categoriaSchema);