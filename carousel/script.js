import config from "./config.js";

let mainPhotoIndex = 1;
let isRunAnimation = false;
const numsImageShow = config.NUM_IMG_SHOW;
const gapBetweenImage = config.GAP_IMAGE;

const {
    CAROUSEL_CONTAINER_SELECTOR,
    LEFT_BUTTON_SELECTOR,
    RIGHT_BUTTON_SELECTOR,
    FIRST_IMG_SELECTOR,
    CAROUSEL_ITEM_SELECTOR,
    CAROUSEL_UNDISPLAY_CLASSNAME,
    CAROUSEL_TRANSITION_STYLE
} = config;

const carousel = document.querySelector(CAROUSEL_CONTAINER_SELECTOR);
const leftButton = document.querySelector(LEFT_BUTTON_SELECTOR);
const rightButton = document.querySelector(RIGHT_BUTTON_SELECTOR);
const firstImage = carousel.querySelector(FIRST_IMG_SELECTOR);


const updateCarousel = (imageWidth) => {
    // isRunAnimation use to stop click button too much time, avoid overlapping
    isRunAnimation = true;
    const items = carousel.querySelectorAll(CAROUSEL_ITEM_SELECTOR);
    items.forEach((item, index) => {
        // Animation for images in edge of carousel when out of view
        if (index < mainPhotoIndex - 1 || index > mainPhotoIndex + 1) {
            item.classList.add(CAROUSEL_UNDISPLAY_CLASSNAME);
        } else {
            item.classList.remove(CAROUSEL_UNDISPLAY_CLASSNAME);
        }
    });

    // The main animation to slide image
    carousel.style.transform = `translateX(${
  -imageWidth * (mainPhotoIndex - 1)
}px)`;
    carousel.style.transition = CAROUSEL_TRANSITION_STYLE;
    isRunAnimation = false;
};

window.addEventListener("load", () => {

    const firstImageMarginRight = parseInt(
        getComputedStyle(firstImage).marginRight
    );
    // Auto get the size of first image by use offsetWidth represent for image width size
    const imageWidth =
        firstImage.offsetWidth + firstImageMarginRight + gapBetweenImage;

    leftButton.addEventListener("click", () => {
        // Mean the min limit is when mainPhotoIndex = 1, that we can't slide to left
        if (mainPhotoIndex >= numsImageShow - 1 && !isRunAnimation) {
            mainPhotoIndex -= 1;
            updateCarousel(imageWidth);
        }
    });

    rightButton.addEventListener("click", () => {
        // carousel.children.length is the nums total images
        if (
            mainPhotoIndex <= carousel.children.length - numsImageShow &&
            !isRunAnimation
        ) {
            mainPhotoIndex += 1;
            updateCarousel(imageWidth);
        }
    });
});