
/signup

{
	"email": "final1@email.com",
	"password": "123456",
	"confirmPassword": "123456",
	"handle": "final1"
}

/login

{
	"email": "final1@email.com",
	"password": "123456"
}

/user AUTH

{
	"bio": "Hi! I am final 1",
	"website": "www.google.com",
	"location": "New Delhi"
}

/user/image AUTH

{
    "form-data in body. key=image"
}

/user GET AUTH

{
    "All the details"
}

/posts GET

{
	"Get all posts"
}

/posts AUTH

{
	"body": "This is my post! Like, Share, Comment!"
}

/posts/postId GET

{
    "Gets particular post without login and show comments too"
}

/posts/postId/comment AUTH

{
    "body": "Great post! Will do (by Final 1)"
}



