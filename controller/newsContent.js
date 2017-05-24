var mongoose = require('mongoose');
var Content  = mongoose.model('Content');
var _ =require('underscore');
var fs =require('fs');
var path= require('path');

exports.detail =function(req,res){
	var _id = req.params.id;
	Content.update({_id:id},{$inc:{clickNum:1}},function(err){
		if (err){
			console.log(err);
		}
	});
};

exports.new = function(req,res){
	Category.find({}, function(err, categories){
		if(err){
			console.log(err);
		}
		res.render('layouts/admin',{
			title:'后台管理',
			logo:'news',
			categories: categories,
			content:{}            
		});
	});
};

exports.saveImg = function(req, res, next){
	var imgData= req.files.uploadImg,
		filePath= imgData.path,
		originalFilename= imgData.originalFilename;
	if (originalFilename) {
		fs.readFile(filePath, function(err, data){
			if (err) {
				console.log(err);
			}
		var timestamp = Data.now(),
			type = imgData.type.split('/')[1],
			img = timestamp + '.'+type,
			newPath = path.join(__dirname,'../../../','/public/upload/news/'+img)
		fs.writeFile(newPath,data,function(err){
			if (err) {
				console.log(err);
			}
			req.img = img;
			next();
			});
		});
	} else {
		next();
	}
};

exports.save = function(req, res){
	var contentObj = req.body.content,
		id = contentObj._id,
		categoryId = contentObj.category,
		categoryName = contentObj.categoryName;
	if (req.img) {
		content.img = req.img;
	}
	if (id) {
		Content.findById(id,function(err, _content){
			if (err) {
				console.log(err);
			}
			if (contentObj.category.toString() !== _content.category.toString()) {
				Category.findById(_Content.category,function(err, _oldCat){
					if (err) {
						console.log(err);
					}
					var index = _odlCat.contents.indexOf(id);
					_oldCat.contents.splice(index,1);
					_oldCat.save(function(err){
						if (err) {
							console.log(err);
						}
					});
				});
				Category.findById(contentObj.category, function(err, _newCat){
					if (err) {
						console.log(err);
					}
					_newCat.contents.push(id);
					_newCat.save(function(err){
						if (err) {
							console.log(err);
						}
					});
				});
			}
			_content = _.extend(_content,contentObj);
			_content.save(function(err,_movie){
				if (err) {
					console.log(err);
				}
				res.redirect('/news/'+ _content._id);
			});
		});
	}else if (contentObj.title) {
		Content.findOne({title:contentObj.title},function(err,_content){
			if (err) {
				console.log(err);
			}
			if (_content) {
				console.log('新闻已存在');
				res.redirect('/admin/news/list');
			}else{
				var newContent = new Content(contentObj);
				newContent.save(function(err,_newContent){
					if (err) {
						console.log(err);
					}
					if (categoryId) {
						category.findById(categoryId,function(err,_category){
							if (err) {
								console.log(err);
							}
							_category.contents.push(_newContent._id);
							_category.save(function(err){
								if (err) {
									console.log(err);
								}
								res.redirect('/news/'+_newContent._id);
							});
						});
					}else if (categoryName) {
						Category.findOne({name:categoryName},function(err, _categoryName){
							if (err) {
								console.log(err);
							}
							if (_categoryName) {
								console.log('分类已存在');
								res.redirect('/admin/news/category/list');
							}else{
								var category = new Category({
									name:categoryName,
									contents:[_newContent._id]
								});
								category.save(function(err,category){
									if (err) {
										console.log(err);
									}
									_newContent.category = category._id;
									_newContent.save(function(err, content){
										if (err) {
											console.log(err);
										}
										res.redirect('/admin');
									});
								});
							}
						});
					}else {
						res.redirect('/admin/news/list');
					}
				});
			}
		});
	}else if (categoryName){
		Category.findOne({name:categoryName},function(err,_categoryName){
			if (err) {
				console.log(err);
			}
			if (_categoryName) {
				console.log('分类已存在');
				res.redirect('/admin/news/category/list');
			}else {
				var newCategory = new Category({
					name:categoryName
				});
				newCategory.save(function(err){
					if (err) {
						console.log(err);
					}
					res.redirect('/admin/news/category/list');
				});
			}
		});

	}else{
		res.redirect('/admin/news/new');
	}
};

exports.updata = function(req,res){
	var _id = req.params.id;
	Content.findById(_id, function(err, content){
		Category.find({},function(err,categories){
			if (err) {
				console.log(err);
			}
			res.render('layouts/admin',{
				title: '新闻后台更新',
				logo:'news',
				content:content,
				categories:categories
			});
		});
	});
};


exports.list = function(req,res){
	Content.find({})
		.populate('category','name')
		.exec(function(err,contents){
			if (err) {
				console.log(err);
			}
			res.render('layouts/news_list',{
				title: '新闻列表',
				log: 'news',
				contents:contents
			});
		});
};

exports.del = function(req,res) {
	var id = req.query.id;
	if (id) {
		Content.findById(id, function(err, content){
			if (err) {
				console.log(err);
			}
			Category.findById(content.category, function(err, category){
				if (err) {
					console.log(err);
				}
				if (category) {
					var index = category.contents.indexOf(id);
					category.contents.splice(index,1);
					category.save(function(err){
						if (err) {
							console.log(err);
						}
					});
				}
				Content.remove({_id:id}, function(err){
					if (err) {
						console.log(err);
					}
					res.json({success:1});
				});
			});
		});
	}
};






































