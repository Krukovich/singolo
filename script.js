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
        headerBlock.style.zIndex = "3";
    };

    const removeHeaderFixed = () => {
        const headerBlock = document.getElementById("header");
        headerBlock.style.position= "static";
        headerBlock.style.width = "100%";
        headerBlock.style.zIndex = "3";
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
    let slideIndex = 1;
    showSlides(slideIndex, null);

    try {
        const nextBtn = document.getElementById("nextBtn");
        const prevBtn = document.getElementById("prevBtn");

        nextBtn.addEventListener("click", () => {
            const flag = "right"
            changeBackgroundColor();
            showSlides(slideIndex += 1, flag);
        });

        prevBtn.addEventListener("click", () => {
            const flag = "left"
            changeBackgroundColor();
            showSlides(slideIndex -= 1, flag);
        });
    } catch (error) {
        console.log(error);        
    }

    const changeBackgroundColor = () => {
        const slider = document.getElementById("slider");
        if (slider.classList.contains("slider_change")) {
            slider.classList.remove("slider_change");
        } else {
            slider.classList.add("slider_change");
        }
    };

    function showSlides(count, flag) {
        const slides = document.getElementsByClassName("image-wrapper");

        if (count > slides.length) {
            slideIndex = 1
        }
        if (count < 1) {
            slideIndex = slides.length
        }

        if (flag === "right") {
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.transform = "translateX(200%)";
                slides[i].style.transition = "1s";
            }
            slides[slideIndex - 1].style.transform = "translateX(0)";
            slides[slideIndex - 1].style.transition = "1s";
        }

        if (flag === "left") {
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.transform = "translateX(-200%)";
                slides[i].style.transition = "1s";
            }
            slides[slideIndex - 1].style.transform = "translateX(0)";
            slides[slideIndex - 1].style.transition = "1s";
        }

        if (flag === null) {
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.transform = "translateX(200%)";
                slides[i].style.transition = "1s";
            }
            slides[slideIndex - 1].style.transform = "translateX(0)";
            slides[slideIndex - 1].style.transition = "1s";
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

            document.getElementById("modal-close").addEventListener("click", () => {
                [...document.getElementsByClassName("modal")][0].classList.remove("modal_show");
                elementsForm.forEach(item => {
                    if (item.type !== "submit") item.value = "";
                });
            });
        });
    } catch (error) {
        console.log(error);   
    }

    const fixLengthLine = (line) => {
        return line.substr(0, 256);
    };

    // show and hidden mobile menu 
    try {
        const menu = [...document.getElementsByClassName("mobile-menu_hidden")][0];
        document.getElementById("mobile-menu").addEventListener("click", () => {
            menu.classList.add("mobile-menu_show");
            [...document.getElementsByTagName("body")][0].style.overflow = "hidden";
            document.getElementById("body").classList.add("fixed");
        });
        document.getElementById("mobile-menu-close").addEventListener("click", () => {
            if (menu.classList.contains("mobile-menu_show")) {
                menu.classList.remove("mobile-menu_show");
                [...document.getElementsByTagName("body")][0].style.overflow = "scroll";
                document.getElementById("body").classList.remove("fixed");
            }
        });
    } catch (error) {
        console.log(error);
    }

    // light link on scroll wheel
    try {
        const points = [];
        const links = [...document.getElementsByClassName("navigation-list__item")];
        links.forEach(nav => {
            points.push(document.getElementById(nav.href.replace(/[^#]*(.*)/, "$1").slice(1)).offsetTop);
        });
        document.addEventListener("wheel", () => {
            if (window.pageYOffset + 300 >= points[1]) {
                removeLightLink(links);
                links[1].classList.add("navigation-list__item_active");
            }

            if (window.pageYOffset + 300 >= points[2]) {
                removeLightLink(links);
                links[2].classList.add("navigation-list__item_active");
            }

            if (window.pageYOffset + 300 >= points[3]) {
                removeLightLink(links);
                links[3].classList.add("navigation-list__item_active");
            }

            if (window.pageYOffset + 300 >= points[4]) {
                removeLightLink(links);
                links[4].classList.add("navigation-list__item_active");
            }

            if (window.pageYOffset === 0) {
                removeLightLink(links);
                links[0].classList.add("navigation-list__item_active");
            }
        });
    } catch (error) {
        console.log(error);
    } 
};

