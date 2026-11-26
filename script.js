const slidesData = [
    {title: "card 1", image: "/img1.jpg"},
    {title: "card 2", image: "/img2.jpg"},
    {title: "card 3", image: "/img3.jpg"},
    {title: "card 4", image: "/img4.jpg"},
    {title: "card 5", image: "/img5.jpg"},
    {title: "card 6", image: "/img6.jpg"},
];

const wheel = 0.0015;
const ease = 0.05;

const stage = document.querySelector(".stage");
const titleEl = document.querySelector(".slider-title");
const slideCount = slidesData.length;

let scroll = 0;
let scrollTarget = 0;
let activeSlide = -1;

const slides = slidesData.map((data) => {
  const slide = document.createElement("div");
  slide.className = "slide";

  const image = document.createElement("div");
  image.className = "slide-media";
  image.style.backgroundImage = `url(${data.image})`;

  slide.appendChild(image);
  stage.appendChild(slide);

  return {slide, image, imageScale: 1.25};
});

function lerp(start, end, amount) {
  return start + (end - start) * amount;
};

function updateSlider() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    slides.forEach((item, slideIndex) => {
        const {slide, image} = item;

        let slideOffset = scroll - slideIndex;
        slideOffset -= slideCount * Math.floor(slideOffset / slideCount);
        if (slideOffset >= slideCount - 1) slideOffset -= slideCount;

        let imageTarget = 1.25;
        if (slideOffset > -1 && slideOffset < 0) {
            imageTarget = lerp(1.25, 1, slideOffset + 1);
        };
        if (slideOffset >= 0 && slideOffset < 1) imageTarget = 1;

        item.imageScale = lerp(item.imageScale, imageTarget, ease);
        image.style.transform = `scale(${item.imageScale})`;

        if (slideOffset <= -1 || slideOffset >= 1) {
            slide.style.zIndex = 0;
            slide.style.transform = "translate3d(0, 0, -2000px) scale(0.01)";
            return;
        };

        slide.style.zIndex = 
          Math.round((1 - Math.abs(slideOffset)) * 20) + (slideOffset > 0 ? 10 : 0);
        
        if (slideOffset <= 0){
            const enterProcess = slideOffset + 1;
            slide.style.transformOrigin = "center";
            slide.style.transform = `translate3d(0, 0, ${
                lerp(-700, 0, enterProcess)}px) scale(${lerp(0.4, 1, enterProcess)})`;
                return;
        };
        const dir = slideIndex % 2 === 0 ? -1 : 1;

        slide.style.transformOrigin = dir < 0 ? "top left" : "top right";
        slide.style.transform = `
          translate3d(${dir * vw * 0.3 * slideOffset}px, ${-vh * 0.75 *         slideOffset}px, ${300 * slideOffset}px)
          rotateX(${40 * slideOffset}deg)
          rotateY(${dir * 50 * slideOffset}deg)
          rotateZ(${-dir * 20 * slideOffset}deg)
          scale(${1 + 0.5 * slideOffset})
        `;
    });

    const currentIndex = 
      ((Math.round(scroll) % slideCount) + slideCount) % slideCount;

    if (currentIndex !== activeSlide) {    
        activeSlide = currentIndex;
        titleEl.textContent = slidesData[activeSlide].title;
    };
};
window.addEventListener(
    "wheel", 
    (e) => {
        e.preventDefault();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        scrollTarget += delta * wheel;
    },
    {passive: false},
);

function animate() {
    scroll = lerp(scroll, scrollTarget, ease);
    updateSlider();
    requestAnimationFrame(animate);
};

animate();