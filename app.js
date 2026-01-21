// ============================================================
// CONFIGURATION
// ============================================================
const SUPABASE_URL = 'https://ryhopyvzareqomjamzjo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5aG9weXZ6YXJlcW9tamFtempvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NjU4OTMsImV4cCI6MjA4MDI0MTg5M30.db-AI3xivMWK5PajXWDgUvXCMr6R5RD_LuvXkBLHjN8';

// ============================================================
// TRACKING
// ============================================================
let timeSpent = 0;
let lastVisibilityChange = Date.now();
const pagesVisited = new Set();
pagesVisited.add(window.location.pathname);

function initTracking() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            timeSpent += Date.now() - lastVisibilityChange;
        } else {
            lastVisibilityChange = Date.now();
        }
    });
}

async function getIpAndLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            ip: data.ip,
            country: data.country_name,
            city: data.city,
            region: data.region,
            latitude: data.latitude,
            longitude: data.longitude
        };
    } catch (error) {
        console.error('Error fetching IP/location:', error);
        return {
            ip: 'unknown',
            country: 'unknown',
            city: 'unknown',
            region: 'unknown',
            latitude: null,
            longitude: null
        };
    }
}

function getOSInfo() {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let version = 'Unknown';
    
    if (ua.indexOf('Win') !== -1) {
        os = 'Windows';
        if (ua.indexOf('Windows NT 10.0') !== -1) version = '10/11';
        else if (ua.indexOf('Windows NT 6.3') !== -1) version = '8.1';
        else if (ua.indexOf('Windows NT 6.2') !== -1) version = '8';
        else if (ua.indexOf('Windows NT 6.1') !== -1) version = '7';
    } else if (ua.indexOf('Mac') !== -1) {
        os = 'macOS';
        const match = ua.match(/Mac OS X ([\d_]+)/);
        if (match) version = match[1].replace(/_/g, '.');
    } else if (ua.indexOf('X11') !== -1 || ua.indexOf('Linux') !== -1) {
        os = 'Linux';
    } else if (ua.indexOf('Android') !== -1) {
        os = 'Android';
        const match = ua.match(/Android ([\d.]+)/);
        if (match) version = match[1];
    } else if (ua.indexOf('like Mac') !== -1) {
        os = 'iOS';
        const match = ua.match(/OS ([\d_]+)/);
        if (match) version = match[1].replace(/_/g, '.');
    }
    
    return { os, version };
}

function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';
    
    if (ua.indexOf('Firefox') !== -1) {
        browser = 'Firefox';
        const match = ua.match(/Firefox\/([\d.]+)/);
        if (match) version = match[1];
    } else if (ua.indexOf('Edg') !== -1) {
        browser = 'Edge';
        const match = ua.match(/Edg\/([\d.]+)/);
        if (match) version = match[1];
    } else if (ua.indexOf('Chrome') !== -1) {
        browser = 'Chrome';
        const match = ua.match(/Chrome\/([\d.]+)/);
        if (match) version = match[1];
    } else if (ua.indexOf('Safari') !== -1) {
        browser = 'Safari';
        const match = ua.match(/Version\/([\d.]+)/);
        if (match) version = match[1];
    } else if (ua.indexOf('Opera') !== -1 || ua.indexOf('OPR') !== -1) {
        browser = 'Opera';
        const match = ua.match(/(?:Opera|OPR)\/([\d.]+)/);
        if (match) version = match[1];
    }
    
    return { browser, version };
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'Mobile';
    }
    return 'Desktop';
}

function getNetworkType() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        return {
            type: connection.effectiveType || 'unknown',
            downlink: connection.downlink || 'unknown',
            rtt: connection.rtt || 'unknown',
            saveData: connection.saveData || false
        };
    }
    return { type: 'unknown', downlink: 'unknown', rtt: 'unknown', saveData: false };
}

function getStorageInfo() {
    let localStorage = false;
    let sessionStorage = false;
    let cookies = false;
    
    try {
        window.localStorage.setItem('test', 'test');
        window.localStorage.removeItem('test');
        localStorage = true;
    } catch (e) {}
    
    try {
        window.sessionStorage.setItem('test', 'test');
        window.sessionStorage.removeItem('test');
        sessionStorage = true;
    } catch (e) {}
    
    cookies = navigator.cookieEnabled;
    
    return { localStorage, sessionStorage, cookies };
}

async function getDeviceInfo() {
    const osInfo = getOSInfo();
    const browserInfo = getBrowserInfo();
    const networkInfo = getNetworkType();
    const storageInfo = getStorageInfo();
    const ipLocation = await getIpAndLocation();
    
    const currentTimeSpent = document.hidden ? 
        timeSpent : 
        timeSpent + (Date.now() - lastVisibilityChange);
    
    return {
        ip_address: ipLocation.ip,
        country: ipLocation.country,
        city: ipLocation.city,
        region: ipLocation.region,
        latitude: ipLocation.latitude,
        longitude: ipLocation.longitude,
        device_type: getDeviceType(),
        os: osInfo.os,
        os_version: osInfo.version,
        browser: browserInfo.browser,
        browser_version: browserInfo.version,
        user_agent: navigator.userAgent,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        screen_orientation: screen.orientation?.type || 'unknown',
        color_depth: window.screen.colorDepth,
        pixel_ratio: window.devicePixelRatio || 1,
        language: navigator.language,
        languages: navigator.languages?.join(', ') || navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezone_offset: new Date().getTimezoneOffset(),
        network_type: networkInfo.type,
        network_downlink: networkInfo.downlink,
        network_rtt: networkInfo.rtt,
        network_save_data: networkInfo.saveData,
        touch_support: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        max_touch_points: navigator.maxTouchPoints || 0,
        local_storage_enabled: storageInfo.localStorage,
        session_storage_enabled: storageInfo.sessionStorage,
        cookies_enabled: storageInfo.cookies,
        referrer: document.referrer || 'direct',
        current_page: window.location.pathname,
        pages_visited: Array.from(pagesVisited),
        time_spent_seconds: Math.round(currentTimeSpent / 1000),
        hardware_concurrency: navigator.hardwareConcurrency || 'unknown',
        device_memory: navigator.deviceMemory || 'unknown',
        timestamp: new Date().toISOString(),
        local_time: new Date().toString()
    };
}

// ============================================================
// THEME
// ============================================================
function initTheme() {
    const themeDropdown = document.getElementById('theme');
    const themes = {
        'orange-dark': { accent: '#F9501B', light: 'rgba(249, 80, 27, 0.1)', mode: 'dark' },
        'orange-light': { accent: '#F9501B', light: 'rgba(249, 80, 27, 0.1)', mode: 'light' },
        'red-dark': { accent: '#E53935', light: 'rgba(229, 57, 53, 0.1)', mode: 'dark' },
        'red-light': { accent: '#E53935', light: 'rgba(229, 57, 53, 0.1)', mode: 'light' },
        'blue-dark': { accent: '#1E88E5', light: 'rgba(30, 136, 229, 0.1)', mode: 'dark' },
        'blue-light': { accent: '#1E88E5', light: 'rgba(30, 136, 229, 0.1)', mode: 'light' },
        'green-dark': { accent: '#43A047', light: 'rgba(67, 160, 71, 0.1)', mode: 'dark' },
        'green-light': { accent: '#43A047', light: 'rgba(67, 160, 71, 0.1)', mode: 'light' },
        'purple-dark': { accent: '#8E24AA', light: 'rgba(142, 36, 170, 0.1)', mode: 'dark' },
        'purple-light': { accent: '#8E24AA', light: 'rgba(142, 36, 170, 0.1)', mode: 'light' }
    };

    themeDropdown.addEventListener('change', (e) => {
        const theme = themes[e.target.value];
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        document.documentElement.style.setProperty('--accent-color-light', theme.light);
        
        if (theme.mode === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    });
}

// ============================================================
// UI INTERACTIONS
// ============================================================
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const wasActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });
            
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.product-grid, .process-grid, .faq-grid').forEach(grid => {
        const items = grid.querySelectorAll('.stagger-item');
        
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                    staggerObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        staggerObserver.observe(grid);
    });
}

function initUI() {
    initFAQ();
    initSmoothScroll();
    initAnimations();
}

// ============================================================
// CHAT
// ============================================================
function initChat() {
    const chatButton = document.getElementById('chatButton');
    
    chatButton.addEventListener('click', () => {
        window.open('./chat.html', 'H-Fin Customer Support', 'width=450,height=700,left=100,top=100');
    });
}

// ============================================================
// INITIALIZATION
// ============================================================
initUI();
initTheme();
initTracking();
initChat();

// ============================================================
// CONTACT FORM
// ============================================================
document.querySelector('.contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    const deviceInfo = await getDeviceInfo();
    
    const formData = {
        name: `${form.firstName.value} ${form.lastName.value}`,
        email: form.email.value,
        phone: form.phone.value,
        intro: form.message.value,
        device_info: deviceInfo
    };
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/loan`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Thank you for your message! We will contact you within 24 hours.');
            form.reset();
        } else {
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your request. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});