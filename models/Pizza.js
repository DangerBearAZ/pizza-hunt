const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const PizzaSchema = new Schema({
  pizzaName: {
    type: String,
    required: 'You need to provide a pizza name!',
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    //this gets a function and adds to model ex format date or you should obsure a name - make sure to call function as a const
    get: (createdAtVal) => dateFormat(createdAtVal)
  },
  size: {
    type: String,
    required: true,
    enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
    default: 'Large'
  },
  toppings: [],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
}, 
{
  toJSON: { 
    virtuals: true,
    //enable to the user of the getter function to do it's thing when being rendered
    getters: true
  }, 
  id: false
}
);


// Mongoose virtuals
// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  //includes all replies as well .reduce() method to tally up the total of every comment with its replies.
  // .reduce() takes two parameters, an accumulator and a currentValue. 
  //Here, the accumulator is total, and the currentValue is comment.
  //.reduce() method is great for calculating a value based off of the accumulation of values in an array.
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);


//export the Pizza model 
module.exports = Pizza;

