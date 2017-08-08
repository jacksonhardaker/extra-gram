chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			(function () {
				
				const MODAL_INDEX = {
					followers: 1,
					following: 2
				};
				const INSTAGRAM_CLASS_NAMES = {
					userListItem : '_6e4x5', // li element inside modal
					userName: '_2g7d5', // link element inside modal
					metaItems: '_t98z6', // link element
					closeButton: '_dcj9f', // link element
					commentTextArea: '_bilrf', // Textarea element
					upvoteButton: '_eszkz' // link element
				};
				var followersList = null;
				var followingList = null;

				chrome.runtime.sendMessage({
					type: 'notification'
				});

				window.addEventListener('keydown', function (event) {

					switch (event.keyCode) {
						case 38: // Up arrow
							var button = document.getElementsByClassName(INSTAGRAM_CLASS_NAMES.upvoteButton)[0];
							if (button) {
								button.click();
							}
							break;
						case 40: // Down arrow
							var textarea = document.getElementsByClassName(INSTAGRAM_CLASS_NAMES.commentTextArea)[0];
							if (textarea) {
								textarea.focus();
							}
							break;
						case 220: // Backslash
							getFollowers();
							break;
						case 221: // closing square bracket
							getFollowingThatAreNotFollowers();
					}
				}, true);

				function closeFollowerFollowingModal() {
					document.getElementsByClassName(INSTAGRAM_CLASS_NAMES.closeButton)[0].click();
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
					var followingItem = document.getElementsByClassName(INSTAGRAM_CLASS_NAMES.metaItems)[MODAL_INDEX.following];
					if (followingItem) {
						if (!followingList) {
							var followingCount = followingItem.children[0].innerText;
							followingItem.click();

							window.setTimeout(function () {

								var working = new Promise((resolve, reject) => {
									loadList(resolve, followingCount, 0, 0);
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
				}

				function getFollowers(resolve) {
					var followersItem = document.getElementsByClassName(INSTAGRAM_CLASS_NAMES.metaItems)[MODAL_INDEX.followers];

					if (followersItem) {
						if (!followersList) {
							var followerCount = followersItem.children[0].innerText;
							followersItem.click();

							window.setTimeout(function () {

								var working = new Promise((resolve, reject) => {
									loadList(resolve, followerCount, 0, 0);
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
				}

				function listNames(listItems) {
					var names = [];
					var containers = document.getElementsByClassName(INSTAGRAM_CLASS_NAMES.userName);
					for (var i = 0; i < containers.length; i++) {
						names.push(containers[i].innerText);
					}

					return names;
				}

				function loadList(resolve, count, previouslistItemsLength, attemptCount) {
					var listItems = document.getElementsByClassName(INSTAGRAM_CLASS_NAMES.userListItem);
					var listItemsLength = listItems.length;
					
					// Increase attempt count?
					if (previouslistItemsLength === listItems.length) {
						attemptCount += 1;
					}
					else {
						attemptCount = 0;
					}

					if (listItemsLength < count & attemptCount < 20) {
						listItems[listItemsLength - 1].scrollIntoView();
						window.setTimeout(function () { loadList(resolve, count, listItemsLength, attemptCount); }, 350);
					}
					else {
						resolve(listItems);
					}
				}

			})();


		}
	}, 10);
});