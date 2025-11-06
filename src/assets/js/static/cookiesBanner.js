export const cookieBannerModule = {
    cookieBanner: {
        init: function() {
            const banner = document.getElementById('cookieBanner')
            if (banner) {
                if (document.cookie.indexOf('cookieBanner=') === -1) {
                    banner.classList.add('active');
                    banner.style.display = 'block';
                }
        
                document.addEventListener('click', function (event) {
                    if (event.target && event.target.matches('#cookieBanner #agreement')) {
                        banner.classList.remove('active');
                        banner.style.display = 'none';
                        document.cookie = 'cookieBanner=true; path=/; expires=' + new Date(new Date().getTime() + 31 * 24 * 60 * 60 * 1000).toUTCString();
                        event.preventDefault();
                    }
                })
            }
        }
    },
    init: function() {
        this.cookieBanner.init();
    }
};