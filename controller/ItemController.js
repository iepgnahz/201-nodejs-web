import Item from '../models/item';
export default class ItemController {
  getAll(req, res, next) {
    Item.find({}, (err, docs) => {
      if (!err && docs) {
        res.send({items: docs});
      } else {
        return next(err);
      }
    });
  }

  getOne(req, res, next) {
    let id = req.params.id;
    Item.findById(id,(err,doc)=>{
      if(!err && doc){
        res.send({item:doc})
      }else {
        return next(err);
      }
    })
  }

  addOne(req,res,next){
    let item = req.body.item;
    new Item(item).save((err,doc)=>{
      if(!err && doc){
        res.sendStatus(201)
      }else {
        return next(err);
      }
    })
  }

  deleteOne(req, res, next) {
    let id = req.params.id;
    Item.findByIdAndRemove(id, (err)=>{
      if(!err){
        res.sendStatus(200)
      }else {
        return next(err);
      }
    })
  }

  updateOne(req, res, next) {
    let id = req.params.id;
    let item = req.body.item;
    console.log(id,item);
    Item.findByIdAndUpdate(id, item, (err) => {
      if (!err) {
        res.sendStatus(200)
      } else {
        return next(err);
      }
    });
  }
}
