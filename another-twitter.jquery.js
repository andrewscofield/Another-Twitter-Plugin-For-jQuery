/*
*	https://github.com/apotropaic/Another-Twitter-Plugin-For-jQuery/
*/
;(function ( $, window, undefined ) {
	var document = window.document,
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

	function anotherTwitter( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options) ;

		this._defaults = defaults;
		this._name = 'anotherTwitter';

		this.init();
	}

	function timeAgo(dateString) {
		var rightNow = new Date();
		var then = new Date(dateString);

		if ($.browser.msie) {
			then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
		}
		var diff = rightNow - then;
		var second = 1000,
		minute = second * 60,
		hour = minute * 60,
		day = hour * 24,
		week = day * 7;
		if (isNaN(diff) || diff < 0) {
		    return ""; // return blank string if unknown
		}
		if (diff < second * 2) {
			// within 2 seconds
			return "right now";
		}
		if (diff < minute) {
			return Math.floor(diff / second) + " seconds ago";
		}
		if (diff < minute * 2) {
			return "about 1 minute ago";
		}
		if (diff < hour) {
			return Math.floor(diff / minute) + " minutes ago";
		}
		if (diff < hour * 2) {
			return "about 1 hour ago";
		}
		if (diff < day) {
			return  Math.floor(diff / hour) + " hours ago";
		}
		if (diff > day && diff < day * 2) {
			return "yesterday";
		}
		if (diff < day * 365) {
			return Math.floor(diff / day) + " days ago";
		}
		else {
			return "over a year ago";
		}
}

	var ify = {
		link: function(tweet) {
			return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
				var http = m2.match(/w/) ? 'http://' : '';
				return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
			});
		},
		at: function(tweet) {
			return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
				return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
			});
		},
		list: function(tweet) {
			return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
				return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
			});
		},
		hash: function(tweet) {
			return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
				return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
			});
		},
		clean: function(tweet) {
			return this.hash(this.at(this.list(this.link(tweet))));
		}
	}

	anotherTwitter.prototype.init = function () {
		var options = this.options;
		var element = $(this.element);
		var requestUrl = 'http://api.twitter.com/1/statuses/user_timeline.json';
		var requestData = {
			screen_name: options.user,
			include_rts: options.includeRTs,
			count: options.numTweets,
			include_entities: options.includeEntities
		}

		if(options.search.length > 0){
			requestUrl = 'http://search.twitter.com/search.json';
			requestData = {
				q: options.search
			}
		}

		$.ajax({
			url: requestUrl,
			type: 'GET',
			dataType: 'jsonp',
			data: requestData,
			success: function(data, textStatus, xhr){

				for(var i = 0; i < data.length; i++){
					var tweetTemplate = options.tweetTemplate;
					var wrapperTemplate = options.wrapperTemplate;
					var tweetText = data[i].text;
					var tweetTime = data[i].created_at;
					var userAvatar = data[i].user.profile_image_url;
					var screenName = data[i].user.screen_name;

					if(options.linkifyUsers){
						tweetText = ify.at( tweetText );
					}
					if(options.linkifyHashes){
						tweetText = ify.hash( tweetText );
					}
					if(options.linkifyLinks){
						tweetText = ify.link( tweetText );
					}

					var replacedHTML = tweetTemplate.replace('[tweet-text]', tweetText);

					if(options.includeScreenName){
						replacedHTML = replacedHTML.replace('[screen_name]', screen_name);
					}

					if(options.includeTimeAgo){
						replacedHTML = replacedHTML.replace('[time-ago]', timeAgo(tweetTime) );
					}

					if(options.includeAvatar){
						replacedHTML = replacedHTML.replace('[avatar]', userAvatar);
					}

					var newHTML = $(wrapperTemplate).append(replacedHTML);

					if(options.appendTo.length > 0){
						$(options.appendTo).append(newHTML.html);	
					}
					else{
						element.append(newHTML);
					}
				}
			}
		});
	};

	$.fn['anotherTwitter'] = function ( options ) {
	return this.each(function () {
		if (!$.data(this, 'anotherTwitter')) {
			$.data(this, 'anotherTwitter', new anotherTwitter( this, options ));
		}
	});
	}

}(jQuery, window));
