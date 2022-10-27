// The purpose of this script is to change the color of the navbar according the scroll position
// The navbar's color should always match the color of the last #cover or .stripe element to touch it

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('#navbar');
    const navbarHeight = navbar.offsetHeight;

    const cover = document.querySelector('#cover');
    const stripes = document.querySelectorAll('.stripe');

    function onScroll() {
        const scrollPosition = window.scrollY;

        if (scrollPosition < cover.offsetHeight - navbarHeight) {
            navbar.classList.remove('navbar-dark');
            navbar.classList.remove('theme-dark');
            navbar.classList.remove('bg-success');
            navbar.classList.add('navbar-light');
            navbar.classList.add('theme-light');
        } else {
            for (let i = 0; i < stripes.length; i++) {
                const stripe = stripes[i];
                const stripeHeight = stripe.offsetHeight;
                const stripePosition = stripe.offsetTop;

                if (scrollPosition >= stripePosition - navbarHeight && scrollPosition < stripePosition + stripeHeight - navbarHeight) {
                    
                    if (stripe.classList.contains('theme-light')) {
                        navbar.classList.remove('navbar-dark');
                        navbar.classList.remove('theme-dark');
                        navbar.classList.remove('bg-success');
                        navbar.classList.add('navbar-light');
                        navbar.classList.add('theme-light');
                    } else if(stripe.classList.contains('theme-dark')) {
                        navbar.classList.remove('navbar-light');
                        navbar.classList.remove('theme-light');
                        navbar.classList.remove('bg-success');
                        navbar.classList.remove('navbar-dark');
                        navbar.classList.add('navbar-dark');
                        navbar.classList.add('theme-dark');
                    } else {
                        navbar.classList.remove('navbar-light');
                        navbar.classList.remove('theme-light');
                        navbar.classList.remove('navbar-dark');
                        navbar.classList.remove('theme-dark');
                        navbar.classList.add('bg-success');
                        navbar.classList.add('navbar-dark');
                    }
                }
            }
        }
    }

    document.onscroll = onScroll;
    onScroll();
});