var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var User = require('./User');
var CarouselSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    title: String,
    date: { type: Date, default: Date.now() },
    path: String,

});

CarouselSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort({ 'date': -1 })
            .exec(cb);
    },
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb);
    }
};



var Carousel = mongoose.model("Carousel", CarouselSchema);

module.exports = Carousel