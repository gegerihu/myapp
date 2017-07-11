var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
    bcrypt = require('bcrypt'),                         // 用于密码加密
    SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },

    userName : String,
    password:   String,
    email : String,
    // qq : Number,
    name:  String,
    phoneNum : Number,
    studentId: Number,
    gender : String,
    class : String,

    date: { type: Date, default: Date.now()},

    group: { type: String, default: "0" },
    application:{
        type: String,
        ref :'Application'
    }

});

UserSchema.pre('save',function(next) {
    var user = this;
    // 生成随机的盐，和密码混合后再进行加密
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt) {
        if(err) {
            return next(err);
        }
        bcrypt.hash(user.password,salt,function(err,hash) {
            if(err) {
                return next(err);
            }
            user.password = hash;  // 将hash后的密码赋值到当前用户密码
            next();
        });
    });
});

// 实例方法，通过实例可以调用
UserSchema.methods = {
    comparePassword : function(password,cb) {
        // 使用bcrypt的compare方法对用户输入的密码和数据库中保存的密码进行比对
        bcrypt.compare(password,this.password,function(err,isMatch) {
            if(err) {
                return cb(err);
            }
            cb(null,isMatch);
        });
    }
};

// 给模型添加静态方法
UserSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort({'date':-1})
            .exec(cb);
    },
    findById: function(id,cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

var User = mongoose.model("User",UserSchema);

module.exports = User;
