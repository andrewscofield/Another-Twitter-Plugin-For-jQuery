Another Twitter Plugin For jQuery
===========================

Let me know what you think and suggestions and ideas!


Example Use
=========================

```
$('.tweet-widget').anotherTwitter({
	user: 'twitter'
});

```

List of all the options along with their defaults
=========================

```
defaults = {
	user: 'twitter',
	search: '', //if search is blank, we'll default to a user timeline query
	numTweets: 5,
	appendTo: '', //if appendTo is blank, we'll add tweets to jQuery element by default
	tweetTemplate: '<div class="tweet">[tweet-text]<div class="time">[time-ago]</div></div>', //you can also user [avatar] if the includeAvatars option is true
	wrapperTemplate: '<div id="tweets"></div>',
	linkifyUsers: true, //finds @username in the tweet and links them to their twitter profile
	linkifyHashes: true, //finds #hashes and links them to twitter search
	linkifyLinks: true, //finds http(s):// links and makes them clickable
	includeRTs: true, //twitter api has an option on whether to include retweets in the timeline you are pulling
	includeEntities: true, //twitter api also has an option to pull entities... come to think of it, not sure why this even an option!
	includeTimeAgo: true, //if you want to have [time-ago] replaced with the number of seconds, minutes, hours or days since the tweet happened
	includeAvatars: false, //if you want to replace [avatar] with the URL of the avatar image. This means your template will need to include something like <img src="[avatar]">
	includeScreenName: false, //if you want to replace [screen-name] with the twitter username of the person tweeting. 

};

```