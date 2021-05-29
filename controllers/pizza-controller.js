const { Pizza } = require('../models');

const pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    Pizza.find({})
    // below is how we link comments to specific pizzas it is the key 
      .populate({
        path: 'comments',
        select: '-__v'
      })
      // - is removing info 
      .select('-__v')
      // sorting newest to oldest
      .sort({_id: -1 })
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },


  // get one pizza by id
 // get one pizza by id
getPizzaById({ params }, res) {
  Pizza.findOne({ _id: params.id })
    .populate({
      path: 'comments',
      select: '-__v'
    })
    .select('-__v')
    .then(dbPizzaData => {
      if (!dbPizzaData) {
        res.status(404).json({ message: 'No pizza found with this id!' });
        return;
      }
      res.json(dbPizzaData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
},


  // createPizza
  createPizza({ body }, res) {
    Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err));
  },

  // update pizza by id
  updatePizza({ params, body }, res) {
    //If we don't set that third parameter, { new: true }, it will return the original document.
    // By setting the parameter to true, we're instructing Mongoose to return the new version of the document.
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete pizza
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  }


}

module.exports = pizzaController;