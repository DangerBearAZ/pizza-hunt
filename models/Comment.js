const { Schema, model, Types} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// replies go before comment beacuse they are nested 
const ReplySchema = new Schema(
    {
        // this is using the mongoose types object to set custome ID to avid confusion with parent comment _id
        replyID: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody: {
            type: String
        },
        writtenBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal =>(createdAtVal)
        }
    },
    {
        toJSON: {
          // using out side functions must set the getter to true 
            getters: true 
        }
    }
);



const CommentSchema = new Schema(
    {
    writtenBy: {
        type: String
    },
    commentBody: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    // use ReplySchema to validate data for a reply
    replies: [ReplySchema]
},
{
    toJSON: {
        // this set to true lets us use moongoose virtuals with out it virtuals will not work
        virtuals: true,
        getters: true
    },
    id: false
}
);

// this is getting a count using a mongoose virtual 
CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
}); 

const Comment = model('Comment', CommentSchema);

module.exports = Comment;

