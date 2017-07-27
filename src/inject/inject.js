chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			(function () {
				const MODAL_INDEX = { followers: 1, following: 2 };
				var followersList = null;
				var followingList = null;

				chrome.runtime.sendMessage({
					type: 'notification'
				});

				window.addEventListener('keydown', function (event) {

					switch (event.keyCode) {
						case 38: // Up arrow
							document.getElementsByClassName('_tk4ba')[0].click();
							break;
						case 40: // Down arrow
							document.getElementsByClassName('_2hc0g')[0].focus();
							break;
						case 220: // Backslash
							getFollowers();
							break;
						case 221: // closing square bracket
							getFollowingThatAreNotFollowers();
					}
				}, true);

				function closeFollowerFollowingModal() {
					document.getElementsByClassName('_3eajp')[0].click();
				}

				function getFollowingThatAreNotFollowers() {

					// First get followers
					new Promise((resolve, reject) => {
						getFollowers(resolve);
					}).then((followers) => {
						new Promise((resolve, reject) => {
							window.setTimeout(function () {
								getFollowing(resolve);
							}, 500);
						}).then((following) => {

							var nonFollowBackUsers = following.filter(function (user) {
								return followers.indexOf(user) === -1 ? user : null;
							});

							chrome.runtime.sendMessage({
								type: 'copy',
								text: nonFollowBackUsers.join('\n'),
								success: 'Your list of non-followback users has been copied to the clipboard',
								fail: 'Unable to copy your list of non-followback users to the clipboard'
							});

							chrome.runtime.sendMessage({
								type: 'opentab',
								users: nonFollowBackUsers
							});
						});
					});


				}

				function getFollowing(resolve) {
					if (!followingList) {
						var followingCount = document.getElementsByClassName('_bkw5z')[MODAL_INDEX.following].innerText;
						document.getElementsByClassName('_bkw5z')[MODAL_INDEX.following].click();

						window.setTimeout(function () {

							var working = new Promise((resolve, reject) => {
								loadList(resolve, followingCount);
							}).then((listItems) => {
								followingList = listNames(listItems);

								if (resolve) {
									resolve(followingList);
								}

								closeFollowerFollowingModal();
							});

						}, 500);
					}
					else {
						if (resolve) {
							resolve(followingList);
						}
					}
				}

				function getFollowers(resolve) {
					if (!followersList) {
						var followerCount = document.getElementsByClassName('_bkw5z')[MODAL_INDEX.followers].innerText;
						document.getElementsByClassName('_bkw5z')[MODAL_INDEX.followers].click();

						window.setTimeout(function () {

							var working = new Promise((resolve, reject) => {
								loadList(resolve, followerCount);
							}).then((listItems) => {
								followersList = listNames(listItems);

								// If given a resolution func, resolve, if not, copy to clipboard
								if (resolve) {
									resolve(followersList);
								}
								else {
									chrome.runtime.sendMessage({
										type: 'copy',
										text: followersList.join('\n'),
										success: 'Your list of followers has been copied to the clipboard',
										fail: 'Unable to copy your list of followers to the clipboard'
									});
								}

								closeFollowerFollowingModal();
							});

						}, 500);
					}
					else {
						// If given a resolution func, resolve, if not, copy to clipboard
						if (resolve) {
							resolve(followersList);
						}
						else {
							chrome.runtime.sendMessage({
								type: 'copy',
								text: followersList.join('\n')
							});
						}
					}
				}

				function listNames(listItems) {
					var names = [];
					var containers = document.getElementsByClassName('_gzjax');
					for (var i = 0; i < containers.length; i++) {
						names.push(containers[i].children[0].innerText);
					}

					return names;
				}

				function loadList(resolve, count) {
					var listItems = document.getElementsByClassName('_cx1ua');

					if (listItems.length < count) {
						listItems[listItems.length - 1].scrollIntoView();
						window.setTimeout(function () { loadList(resolve, count); }, 200);
					}
					else {
						resolve(listItems);
					}
				}

			})();


		}
	}, 10);
});