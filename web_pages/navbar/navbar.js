const MANAGER_MENU_URL = buildUrlWithContextPath('web_pages/navbar/manager_navbar.html');
const USER_MENU_URL = buildUrlWithContextPath('web_pages/navbar/user_navbar.html');
const LOGOUT_URL = buildUrlWithContextPath("logout");

async function handleLogout() {
    const response = await fetch(LOGOUT_URL, {method: 'post'});

    if (response.redirected) {
        window.location.href = response.url;
    } else {
        const responseText = await response.text();
    }
}

(function () {
    "use strict";

    /**
     * Easy selector helper function
     */
    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
        let selectEl = select(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }

    /**
     * Easy on scroll event listener
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }

    /**
     * Scrolls to an element with header offset
     */
    const scrollto = (el) => {
        let header = select('#header')
        let offset = header.offsetHeight

        let elementPos = select(el).offsetTop
        window.scrollTo({
            top: elementPos - offset,
            behavior: 'smooth'
        })
    }

    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                selectHeader.classList.add('header-scrolled')
            } else {
                selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }

    async function buildMenu() {
        const user = await getUser();
        const url = (user && user.memberType === 'MANAGER') ? MANAGER_MENU_URL : USER_MENU_URL;
        const response = await fetch(url);
        document.getElementById('header').innerHTML = await response.text();
        buildLinks();
    }

    function buildLinks() {
        document.querySelectorAll('.clickable-link').forEach((linkEl) => {
            linkEl.setAttribute('href', buildUrlWithContextPath(linkEl.dataset.href));
        });
    }

    async function init(event) {
        await buildMenu();
        await pullNotifications();

        document.getElementById('logoutLink').addEventListener('click', handleLogout);

        navbarlinksActive(event);
        onscroll(document, navbarlinksActive);

        /**
         * Mobile nav toggle
         */
        on('click', '.mobile-nav-toggle', function (e) {
            select('#navbar').classList.toggle('navbar-mobile')
            this.classList.toggle('bi-list')
            this.classList.toggle('bi-x')
        });

        /**
         * Mobile nav dropdowns activate
         */
        on('click', '.navbar .dropdown > a', function (e) {
            if (select('#navbar').classList.contains('navbar-mobile')) {
                e.preventDefault()
                this.nextElementSibling.classList.toggle('dropdown-active')
            }
        }, true);

        /**
         * Scrool with ofset on links with a class name .scrollto
         */
        on('click', '.scrollto', function (e) {
            if (select(this.hash)) {
                e.preventDefault()

                let navbar = select('#navbar')
                if (navbar.classList.contains('navbar-mobile')) {
                    navbar.classList.remove('navbar-mobile')
                    let navbarToggle = select('.mobile-nav-toggle')
                    navbarToggle.classList.toggle('bi-list')
                    navbarToggle.classList.toggle('bi-x')
                }
                scrollto(this.hash)
            }
        }, true);

        /**
         * Scroll with ofset on page load with hash links in the url
         */
        if (window.location.hash) {
            if (select(window.location.hash)) {
                scrollto(window.location.hash)
            }
        }

        /**
         * Animation on scroll
         */
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    window.addEventListener('load', init);

})()