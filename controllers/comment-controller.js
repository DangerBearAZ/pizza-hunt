const { Comment, Pizza } = require('../models');

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          //$push method works  the same way that it works in JavaScript—it adds data to an array. 
          { $push: { comments: _id } },
          // because we passed the option of new: true,
          //we're receiving back the updated pizza (the pizza with the new comment included).
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(400).json({ message: 'No pizza found with this ID!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  // adding replys to comment 
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      //if mongoose validators are being used run validators needs to be true
      { new: true, runValidators: true }
    )
    .then(dbPizzaData  => {
      if (!dbPizzaData) {
        res.status(404).json( { message: 'No pizza found with this id!' });
        return;
      }
      res.json(dbPizzaData);
    })
    .catch(err => res.json(err)); 
  },

  // remove reply
removeReply({ params }, res) {
  Comment.findOneAndUpdate(
    { _id: params.commentId },
    //e MongoDB $pull operator to remove the specific reply from the replies array 
    //where the replyId matches the value of params.replyId passed in from the route.
    { $pull: { replies: { replyId: params.replyId } } },
    { new: true }
  )
    .then(dbPizzaData => res.json(dbPizzaData))
    .catch(err => res.json(err));
},



    // remove comment
    removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(deletedComment => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No comment with this id!' });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  }
};

module.exports = commentController;
