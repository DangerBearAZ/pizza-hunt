const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

//adds a comment 
// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// removes a comment 
// /api/comments/<pizzaID>/<commentId>
router.route('/:pizzaId/:commentId').delete(removeComment);


module.exports = router;