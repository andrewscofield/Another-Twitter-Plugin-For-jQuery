Another Twitter Plugin For jQuery
===========================

Let me know what you think and suggestions and ideas!


Example Use
=========================

```
$('.tweet-widget').anotherTwitter({
	user: 'twitter',
	numTweets: 5,
	tweetTemplate: '<li><div class="tweet">[tweet-text]</tweet><div class="time">[time-ago]</div></li>',
	wrapperTemplate: '<ul class="unstyled"></ul>',
	linkifyLinks: false

});

```