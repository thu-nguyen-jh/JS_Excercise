(function(){let mainPhotoIndex = 1;
let areRunAnimation = false;
const numsImageShow = 3;
const gapBetweenImage = 24; // 1.5 rem

window.addEventListener("load", () => {
	const carousel = document.querySelector(".carousel-container");
	const leftButton = document.querySelector(".left-btn");
	const rightButton = document.querySelector(".right-btn");
	const firstImage = carousel.querySelector(".carousel-item img");

	// Auto get the size of first image by use offsetWidth represent for image width size
	const imageWidth =
		firstImage.offsetWidth +
		parseInt(getComputedStyle(firstImage).marginRight) +
		gapBetweenImage;

	const updateCarousel = () => {
		// Are run animation use to stop click button too much time, make animation maybe overlapped
		// If you not sure about this, can delete if you want
		areRunAnimation = true;
		const items = carousel.querySelectorAll(".carousel-item");
		items.forEach((item, index) => {
			// Animation for images in edge of carousel when out of view
			if (index < mainPhotoIndex - 1 || index > mainPhotoIndex + 1) {
				item.classList.add("fade-out");
			} else {
				item.classList.remove("fade-out");
			}
		});

		// The main animation to slide image
		carousel.style.transform = `translateX(${
			-imageWidth * (mainPhotoIndex - 1)
		}px)`;
		carousel.style.transition = "transform 0.5s ease";
		areRunAnimation = false;
	};

	leftButton.addEventListener("click", () => {
		// Mean the min limit is when mainPhotoIndex = 1, that we can't slide to left
		if (mainPhotoIndex >= numsImageShow - 1 && !areRunAnimation) {
			mainPhotoIndex -= 1;
			updateCarousel();
		}
	});

	rightButton.addEventListener("click", () => {
		// carousel.children.length is the nums total images
		if (
			mainPhotoIndex < carousel.children.length - numsImageShow &&
			!areRunAnimation
		) {
			mainPhotoIndex += 1;
			updateCarousel();
		}
	});
});
})
