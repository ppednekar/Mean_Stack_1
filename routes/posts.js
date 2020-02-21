const express = require("express");
const router = express.Router();

//in-memory local store 
let store = {
    post: [

    ]
}


//create new post
router.post('/', (req, res) => {
    console.log(req.body);

    const postBody = req.body
    postBody.id = Date.now();
    store.post.push(postBody);
    res.json(postBody)

})

//get All Posts
router.get('/', (req, res) => {
    res.json(store.post);
});

//delete post by id
router.delete('/:id', (req, res) => {
    console.log("delete", req.params.id);
    const deletePostId = req.params.id;

    const deleteIndex = store.post.findIndex(
        item => deletePostId == item.id
    );

    console.log("deleteIndex", deleteIndex);

    if (deleteIndex > -1) {
        store.post.splice(deleteIndex, 1);
        res.status(200).send('Post deleted sucessfuly');

    }
    else {
        res.status(404).send('Something went wrong');
    }

    res.json(store.posts);

});

//get post by id
router.get('/:id', (req, res) => {

    const postId = req.params.id;
    const index = store.post.findIndex(
        item => postId == item.id
    );

    if (index > -1) {
        res.json(store.post[index]);
    }
    else {
        res.status(404).send('Something went wrong');
    }
});


//update post by id
router.put('/:id', (req, res) => {

    const updatePostId = req.params.id;
    const postBody = req.body;

    const index = store.post.findIndex(
        item => updatePostId == item.id
    );

    console.log("updatePostIndex", index);

    if (index > -1) {
        let post = store.post[index];

        post.name = postBody.name;
        post.url = postBody.url;
        post.text = postBody.text;
        post.comments = postBody.comments;

        store.post[index] = post;
        res.json(post);
    }
    else {
        res.status(404).send('Something went wrong');
    }
});


//get comments for post by id
router.get('/:id/comments', (req, res) => {

    const id = req.params.id;

    const index = store.post.findIndex(
        item => id == item.id
    );

    if (index > -1) {

        let comments = store.post[index].comments;
        console.log("comments", comments);

        res.json((comments || comments == undefined) ? [] : comments);

    } else {
        res.status(404).send('Something went wrong');
    }
});

//adding comments to post
router.post('/:id/comments', (req, res) => {
    const id = req.params.id;


    const index = store.post.findIndex(
        item => id == item.id
    );

    if (index > -1) {

        let post = store.post[index];
        let commentArr = req.body;

        commentArr.map(item => {
            let comment = {};
            comment.id = Date.now();
            comment.text = item.text;

            post.comments = post.comments ? post.comments : [];
            post.comments.push(comment);

        });

        store.post.map(item => {
            if (item.postId === post.id) {
                return post;
            }
            return item;
        });


        res.json(post);

    } else {
        res.status(404).send('Something went wrong');
    }

});

//update comment by id and comments id
router.put('/:id/comments/:commentId', (req, res) => {

    let commentText = req.body.text;
    const id = req.params.id;
    const commentId = req.params.commentId;


    const index = store.post.findIndex(
        item => id == item.id
    );

    console.log("Update comment index ", index);
    if (index > -1) {

        let post = store.post[index];
        let existingComments = post.comments;

        console.log("Update comment post ", post);
        console.log("Update comment existingComments ", existingComments);

        existingComments.map(item => {
            if (item.commentId == commentId) {
                item.text = commentText;
                return item;
            }
            return item;
        });

        console.log("Update comment existingComments2 ", existingComments);

        store.post.map(postItem => {
            if (postItem.id == id) {
                postItem.comments = existingComments;
                return postItem;
            }
            return postItem;
        });

        console.log("Update comment post 2 ", store.post[index]);
        res.json(store.post[index]);


    } else {
        res.status(404).send('Something went wrong');
    }
});

//delete comment by ID and Comment Id
router.delete('/:id/comments/:commentId', (req, res) => {

    const id = req.params.id;
    const commentId = req.params.commentId;

    const index = store.post.findIndex(
        item => id == item.id
    );

    if (index > -1) {

        let post = store.post[index];
        const deleteIndex = post.comments.findIndex(
            item => id == item.id
        );
        post.comments.splice(deleteIndex, 1);

        store.post.map(item => {
            if (item.postId === post.postId) {
                return post;
            }
            return item;
        });
        res.json(post);
    }
    else {
        res.status(404).send('Something went wrong');
    }

    var filterdComments = post['comments'].filter(com => {
        if (com.commentId != commentId) {
            return true;
        }
        return false;
    });

    post['comments'] = filterdComments;
    store.posts.map(b => {
        if (b.postId === post.postId) {
            return post;
        }
        return b;
    });
    res.json(post);
});

module.exports = router;