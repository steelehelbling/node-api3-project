const express = require("express");
const User = require("./userDb");
const Post = require("../posts/postDb");
const router = express.Router();

router.post("/", validateUser, (req, res) => {
  User.insert(req.body)
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "cant make a new user" });
    });
});

router.post("/:id/posts", validatePost, (req, res) => {
  Post.insert(req.body)
    .then((userPost) => {
      res.status(201).json(userPost);
    })
    .catch((err) => {
      res.status(500).json({ message: "cant add new post to post array" });
    });
});

router.get("/", (req, res) => {
  // do your magic!
  User.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => { 
      res.status(500).json({ message: "cant get users." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  User.getById(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: "cant get user by id" });
    });
});

router.get("/:id/posts", (req, res) => {
  Post.getById(req.params.id)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "cant get posts" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  User.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "cant delete user" });
      } else {
        res.status(404).json({ message: "cant find user" });
      }
    })
    .catch((err) => {
     
      res.status(500).json({
        message: "Delete does not work",
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  User.update(req.params.id, req.body)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch((err) => {
     
      res.status(500).json({
        message: " updating does not work",
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  User.getById(req.params.id).then((user) => {
    if (user) {
      req.user = user;
    } else {
      res.status(400).json({ message: "user id does not connect to any data" });
    }
  });
  next();
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (req.body.name === "") {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (req.body.name === "") {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
