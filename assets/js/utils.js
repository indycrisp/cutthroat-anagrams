define([
], function(
) {
	return {
		cloneAndAnimateMove: function(source, targetContainer, cloneClass, newEl, letterCount, letterPos) {
			var sourceClone = source.clone();
			sourceClone.width(source.width());
			sourceClone.height(source.height());
			sourceClone.addClass(cloneClass);
	
			targetContainer.append(sourceClone);
			var translateX = source.offset().left - sourceClone.offset().left;
			if (letterPos) {
				translateX += letterPos * sourceClone.outerWidth();
			}

			var translateY = source.offset().top - sourceClone.offset().top;
			sourceClone.css({ left: translateX, top: translateY });
	
			var scale = targetContainer.height() / source.height();
			var leftOffset = 0;
			if (letterCount) leftOffset += letterCount * targetContainer.height();
			return new Promise(function(resolve) {
				sourceClone.velocity({
					left: leftOffset,
					top: 0,
					height: targetContainer.height(),
					width: targetContainer.height(),
					fontSize: targetContainer.css('font-size')
				}, {
					duration: 500,
					easing: "easeInOutCubic",
					complete: function() {
						var $newEl = $(newEl);
						$newEl.css('left', leftOffset);
						sourceClone.replaceWith($newEl);
						resolve();
					}	
				});
			});
		},

		animateMove: function(source, letterCount) {
			return new Promise(function(resolve) {
				source.velocity({
					left: letterCount * source.outerWidth(),
					top: 0
				}, {
					duration: 500,
					easing: "easeInOutCubic",
					complete: function() {
						resolve();
					}
				});
			});
		}
	};
});
