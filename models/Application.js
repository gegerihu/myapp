var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var User = require('./User');
var ApplicationSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    user: {
        type: String,
        ref: 'User'
    },
    applicant: String,
    date: { type: Date, default: Date.now() },
    devices: String,
    reasons: String,
    outTime: String,
    returnTime: String,
    advisor: String,
    comment: {
        type: String,
        default: '无'
    },
    state: {
        type: Number,
        default: 4
                    // when 0
                    //     同意借出
                    // when 1
                    //      不同意
                    // when 2
                    //      到期已还
                    // when 3
                    //      过期未还
                    // when 4
                    //      申请当中
    }

});

ApplicationSchema.statics = {
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



var Application = mongoose.model("Application", ApplicationSchema);

module.exports = Application