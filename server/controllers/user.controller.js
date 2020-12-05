const User = require('../models/auth.model');
const Vehicle = require('../models/vahicle.model');

exports.readController = (req, res) => {

  const userId = req.params.id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
          error: 'User not found'
      });
    };
    res.json({user});
  });
};

exports.updateController = (req, res) => {
  const userId = req.params.id;
  User.findOneAndUpdate({ _id: userId}, {"$set": req.body} , { new: true}).populate({path: 'vehicles'})
    .exec((error, user) => {
      if (error || !user) {
        return res.status(400).json({
            error: 'User not found'
        });
      }
      res.json({user});
    })
}

exports.setLocationUserController = (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.params.id;
  User.findByIdAndUpdate(userId, { "$set": {
    latitude,
    longitude,
    isActive: true
  } } , {new: true}).populate({path: 'vehicles'}).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    res.status(200).json({user});
  })
}

exports.logoutUser = (req, res) => {
  const userId = req.params.id;
  User.findByIdAndUpdate(userId, {$set: {isActive: false}}, { new: true}, (error, data) => {
    if (error) console.log(error);
    let vehicles = data.vehicles;
    console.log("before",vehicles);
    Vehicle.updateMany({_id: { $in: vehicles}}, { $set: {isActive: false}}, {new: true}, (error, data) => {
      if (error) return res.status(400).json({error: "Disactive ERROR"});
      console.log("after",data);
      res.status(200).send(data);
    });
  })
}

exports.activeUser = (req, res) => {
  const userId = req.params.id;
  User.findByIdAndUpdate(userId, {$set: {isActive: true}}, { new: true}, (error, data) => {
    if (error) console.log(error);
    res.status(200).json(data)
  })
}



