"use strict"

window.onload = () => {

    //scroll page
    const linkNav = [...document.getElementsByClassName("navigation-list__item")];
    linkNav.forEach(nav => {
        nav.addEventListener("click", (event) => {
            event.preventDefault();

            headerFixed();
            removeLightLink(linkNav);

            event.target.classList.add("navigation-list__item_active");

            const speed = 0.5;
            const len = window.pageYOffset;
            const link = nav.href.replace(/[^#]*(.*)/, "$1");

            if (link === "#header") removeHeaderFixed();
            const bouding = document.querySelector(link).getBoundingClientRect().top;
            let start = null;

            requestAnimationFrame(step);
                function step(time) {
                if (start === null) start = time;
                const progress = time - start;
                const move = ( bouding < 0 ? Math.max(len - progress/speed, len + bouding) : Math.min(len + progress/speed, len + bouding));
                window.scrollTo(0, move);
                if (move != len + bouding) requestAnimationFrame(step);
            }
        });
    });

    const removeLightLink = (linkNav) => {
        linkNav.forEach(link => {
            if (link.classList.contains("navigation-list__item_active")) {
                link.classList.remove("navigation-list__item_active");
            } else if (link.classList.contains("portfolio-nav__item_active")) {
                link.classList.remove("portfolio-nav__item_active");
            } else if (link.classList.contains("portfolio-cards__item_active")) {
                link.classList.remove("portfolio-cards__item_active");
            } else {
                return;
            }
        });
    };

    const headerFixed = () => {
        const headerBlock = document.getElementById("header");
        headerBlock.style.position= "fixed";
        headerBlock.style.width = "100%";
        headerBlock.style.zIndex = "1";
    };

    const removeHeaderFixed = () => {
        const headerBlock = document.getElementById("header");
        headerBlock.style.position= "static";
        headerBlock.style.width = "100%";
        headerBlock.style.zIndex = "1";
    };

    // fixed position header when user mousewheel
    try {
        document.addEventListener("wheel", () => {
            if (document.getElementById("slider").getBoundingClientRect().top > -100) {
                removeHeaderFixed();
            } else {
                headerFixed();
            }
        });
    } catch (error) {
        console.log(error);
    }

    // move slider
    try {
        const nextBtn = document.getElementById("nextBtn");
        nextBtn.addEventListener("click", () => {
            changeSlider();
        });
        const prevBtn = document.getElementById("prevBtn");
        prevBtn.addEventListener("click", () => {
            changeSlider();
        });
    } catch (error) {
        console.log(error);        
    }

    const changeSlider = () => {
        const imgArray = [...document.getElementsByClassName("image-wrapper")];
        if (!document.getElementById("slider").classList.contains("slider_change")) {
            imgArray.forEach(img =>{
                img.style.display = "none"
            });
            document.getElementById("slider").classList.add("slider_change");
        } else {
            imgArray.forEach(img =>{
                img.style.display = "block";
            });
            document.getElementById("slider").classList.remove("slider_change");
        }
    };

    // toggle mobile display
    try {
        const mobiles = [...document.getElementsByClassName("first-phone"), ...document.getElementsByClassName("second-phone")];
        mobiles.forEach(mobile => {
            mobile.addEventListener("click", event => {
                const tagName = event.target.nextElementSibling.className;
                toggleMobileDisplay(tagName);
            });
        });
    } catch (error) {
        console.log(error);
    }

    const toggleMobileDisplay = (tagName) => {
        (document.getElementsByClassName(`${tagName}`)[0].style.opacity === "1") ? 
        document.getElementsByClassName(`${tagName}`)[0].style.opacity = "0" : 
        document.getElementsByClassName(`${tagName}`)[0].style.opacity = "1";
    };

    // toggle portfolio tabs and change images order
    try {
        const tabs = [...document.getElementsByClassName("portfolio-nav__item")];
        tabs.forEach(tab => {
            tab.addEventListener("click", (event) => {
                const images = [...document.getElementsByClassName("portfolio-cards__item")];
                changeImagesOrder(images);
                removeLightLink(tabs);
                event.target.classList.add("portfolio-nav__item_active");
            });
        });
    } catch (error) {
        console.log(error);
    }

    const changeImagesOrder = (images) => {
        const srcArray = images.map(img => img.src);
        const temp = srcArray.shift();
        srcArray.push(temp);

        images.forEach((img, index) => {
            img.src = srcArray[index];
        });
    };

    // toggle border on images in portfolio 
    try {
        const images = [...document.getElementsByClassName("portfolio-cards__item")];
        images.forEach(img => {
            img.addEventListener("click", (event) => {
                removeLightLink(images);
                event.target.classList.add("portfolio-cards__item_active");
            });
        });
    } catch (error) {
        console.log(error);
    }

    // show popup
    try {
        document.getElementById("submit-btn").addEventListener("click", (event) => {
            const result = {};
            const form = document.forms.quote;

            if (!form.checkValidity()) {
                return
            } 

            const elementsForm = [...form.elements];
            elementsForm.forEach(item => {
                if (item.name === "subject") {
                    (item.value === "") ? result.subject = "Без темы" : result.subject = item.value;
                } else if (item.name === "describe") {
                    (item.value === "") ?  result.describe = "Без описания" : result.describe = item.value;
                }
            });

            document.getElementById("subject").innerHTML = result.subject;
            document.getElementById("describe").innerHTML = fixLengthLine(result.describe);
            [...document.getElementsByClassName("modal")][0].classList.add("modal_show");

            event.preventDefault();
        });
        document.getElementById("modal-close").addEventListener("click", () => {
            [...document.getElementsByClassName("modal")][0].classList.remove("modal_show");
        });
    } catch (error) {
        console.log(error);   
    }

    const fixLengthLine = (line) => {
        return line.substr(0, 256);
    };
};

