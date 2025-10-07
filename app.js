// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const candleElements = document.querySelectorAll('.candle');
const blowCandlesBtn = document.getElementById('blow-candles');
const loveButton = document.getElementById('love-button');
const musicToggle = document.getElementById('music-toggle');
const scrollIndicator = document.querySelector('.scroll-indicator');

// State management
let litCandles = 0;
let isPlaying = false;
let audioContext;
let currentTone;

// Loading screen animation
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Start floating hearts animation
        startFloatingHearts();
        // Play welcome sound
        playWelcomeSound();
    }, 3000);
});

// Floating hearts animation
function startFloatingHearts() {
    const hearts = document.querySelectorAll('.floating-hearts .heart');
    hearts.forEach((heart, index) => {
        setTimeout(() => {
            heart.style.animation = `floatUp 8s infinite linear`;
            heart.style.animationDelay = `${index * 1.5}s`;
        }, index * 1000);
    });
}

// Scroll indicator click
scrollIndicator.addEventListener('click', () => {
    document.getElementById('gallery').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Smooth scrolling for all internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Interactive Birthday Cake
candleElements.forEach((candle, index) => {
    candle.addEventListener('click', () => {
        if (!candle.classList.contains('lit')) {
            lightCandle(candle, index);
        }
    });
    
    // Add hover effect
    candle.addEventListener('mouseenter', () => {
        if (!candle.classList.contains('lit')) {
            candle.style.transform = 'scale(1.1)';
        }
    });
    
    candle.addEventListener('mouseleave', () => {
        if (!candle.classList.contains('lit')) {
            candle.style.transform = 'scale(1)';
        }
    });
});

function lightCandle(candle, index) {
    candle.classList.add('lit');
    litCandles++;
    
    // Play lighting sound
    playTone(440 + (index * 110), 0.3, 'sine');
    
    // Add sparkle effect
    createSparkles(candle);
    
    // Check if all candles are lit
    if (litCandles === candleElements.length) {
        setTimeout(() => {
            showCelebration();
        }, 500);
    }
}

function createSparkles(element) {
    const sparkleCount = 8;
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '1rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '10';
        
        const rect = element.getBoundingClientRect();
        sparkle.style.left = (rect.left + rect.width/2) + 'px';
        sparkle.style.top = (rect.top + rect.height/2) + 'px';
        
        document.body.appendChild(sparkle);
        
        // Animate sparkle
        const angle = (i / sparkleCount) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const endX = rect.left + rect.width/2 + Math.cos(angle) * distance;
        const endY = rect.top + rect.height/2 + Math.sin(angle) * distance;
        
        sparkle.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 1 },
            { transform: `translate(${endX - rect.left - rect.width/2}px, ${endY - rect.top - rect.height/2}px) scale(1)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }
}

function showCelebration() {
    // Show congratulations message
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉 All candles are lit! Make a wish! 🎉';
    celebration.style.position = 'fixed';
    celebration.style.top = '50%';
    celebration.style.left = '50%';
    celebration.style.transform = 'translate(-50%, -50%)';
    celebration.style.background = 'var(--color-primary)';
    celebration.style.color = 'var(--color-btn-primary-text)';
    celebration.style.padding = '20px 40px';
    celebration.style.borderRadius = '15px';
    celebration.style.fontSize = '1.5rem';
    celebration.style.fontFamily = '"Dancing Script", cursive';
    celebration.style.zIndex = '1000';
    celebration.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    celebration.style.animation = 'bounce 0.6s ease-out';
    
    document.body.appendChild(celebration);
    
    // Play celebration sound
    playCelebrationMelody();
    
    // Remove after 3 seconds
    setTimeout(() => {
        celebration.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => celebration.remove(), 500);
    }, 3000);
}

// Blow out candles functionality
blowCandlesBtn.addEventListener('click', () => {
    candleElements.forEach((candle, index) => {
        if (candle.classList.contains('lit')) {
            setTimeout(() => {
                candle.classList.remove('lit');
                playTone(220 - (index * 30), 0.2, 'sawtooth');
            }, index * 100);
        }
    });
    
    litCandles = 0;
    
    // Show message
    showTemporaryMessage('💨 Wishes have been sent to the universe! 💫');
});

function showTemporaryMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = message;
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '20%';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translate(-50%, -50%)';
    msgDiv.style.background = 'var(--color-surface)';
    msgDiv.style.color = 'var(--color-text)';
    msgDiv.style.padding = '15px 30px';
    msgDiv.style.borderRadius = '25px';
    msgDiv.style.fontSize = '1.2rem';
    msgDiv.style.fontFamily = '"Poppins", sans-serif';
    msgDiv.style.zIndex = '1000';
    msgDiv.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    msgDiv.style.border = '2px solid var(--color-primary)';
    msgDiv.style.animation = 'slideInDown 0.5s ease-out';
    
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.style.animation = 'slideOutUp 0.5s ease-out forwards';
        setTimeout(() => msgDiv.remove(), 500);
    }, 2500);
}

// Love button functionality
loveButton.addEventListener('click', () => {
    // Create heart explosion
    createHeartExplosion(loveButton);
    
    // Change button text temporarily
    const originalText = loveButton.innerHTML;
    loveButton.innerHTML = '💕 Love Sent! 💕';
    loveButton.disabled = true;
    
    // Play love sound
    playLoveMelody();
    
    // Show floating message
    showFloatingMessage('Your love has filled my heart completely! 💖');
    
    setTimeout(() => {
        loveButton.innerHTML = originalText;
        loveButton.disabled = false;
    }, 3000);
});

function createHeartExplosion(element) {
    const heartEmojis = ['💖', '💕', '💗', '💓', '💝', '🌹', '❤️'];
    const heartCount = 15;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.position = 'fixed';
        heart.style.fontSize = (1 + Math.random()) + 'rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        heart.style.left = (rect.left + rect.width/2) + 'px';
        heart.style.top = (rect.top + rect.height/2) + 'px';
        
        document.body.appendChild(heart);
        
        // Animate heart explosion
        const angle = (i / heartCount) * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const endX = rect.left + rect.width/2 + Math.cos(angle) * distance;
        const endY = rect.top + rect.height/2 + Math.sin(angle) * distance - 50;
        
        heart.animate([
            { 
                transform: 'translate(0, 0) scale(0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translate(${endX - rect.left - rect.width/2}px, ${endY - rect.top - rect.height/2}px) scale(1) rotate(360deg)`, 
                opacity: 0 
            }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'ease-out'
        }).onfinish = () => heart.remove();
    }
}

function showFloatingMessage(message) {
    const floatingMsg = document.createElement('div');
    floatingMsg.innerHTML = message;
    floatingMsg.style.position = 'fixed';
    floatingMsg.style.top = '30%';
    floatingMsg.style.left = '50%';
    floatingMsg.style.transform = 'translate(-50%, -50%)';
    floatingMsg.style.background = 'var(--color-bg-7)';
    floatingMsg.style.color = 'var(--color-text)';
    floatingMsg.style.padding = '20px 30px';
    floatingMsg.style.borderRadius = '20px';
    floatingMsg.style.fontSize = '1.3rem';
    floatingMsg.style.fontFamily = '"Dancing Script", cursive';
    floatingMsg.style.zIndex = '1000';
    floatingMsg.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    floatingMsg.style.border = '2px solid var(--color-primary)';
    floatingMsg.style.maxWidth = '80%';
    floatingMsg.style.textAlign = 'center';
    
    document.body.appendChild(floatingMsg);
    
    // Animate floating message
    floatingMsg.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -60%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -70%) scale(0.8)', opacity: 0 }
    ], {
        duration: 4000,
        easing: 'ease-in-out'
    }).onfinish = () => floatingMsg.remove();
}

// Audio functionality
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playTone(frequency, duration, type = 'sine') {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
}

function playWelcomeSound() {
    // Play a pleasant welcome melody
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99]; // C5, D5, E5, F5, G5
    notes.forEach((note, index) => {
        setTimeout(() => {
            playTone(note, 0.5, 'sine');
        }, index * 200);
    });
}

function playCelebrationMelody() {
    const melody = [
        {freq: 523.25, duration: 0.3}, // C5
        {freq: 659.25, duration: 0.3}, // E5
        {freq: 783.99, duration: 0.3}, // G5
        {freq: 1046.5, duration: 0.6}, // C6
        {freq: 783.99, duration: 0.3}, // G5
        {freq: 1046.5, duration: 0.9}  // C6
    ];
    
    let delay = 0;
    melody.forEach(note => {
        setTimeout(() => {
            playTone(note.freq, note.duration, 'sine');
        }, delay * 1000);
        delay += note.duration;
    });
}

function playLoveMelody() {
    const loveMelody = [
        {freq: 440, duration: 0.4},    // A4
        {freq: 523.25, duration: 0.4}, // C5
        {freq: 659.25, duration: 0.4}, // E5
        {freq: 783.99, duration: 0.6}, // G5
        {freq: 659.25, duration: 0.4}, // E5
        {freq: 523.25, duration: 0.8}  // C5
    ];
    
    let delay = 0;
    loveMelody.forEach(note => {
        setTimeout(() => {
            playTone(note.freq, note.duration, 'sine');
        }, delay * 1000);
        delay += note.duration * 0.8;
    });
}

// Music toggle functionality
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        stopBackgroundMusic();
    } else {
        startBackgroundMusic();
    }
});

function startBackgroundMusic() {
    const ctx = initAudioContext();
    isPlaying = true;
    musicToggle.classList.add('playing');
    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Play a gentle background melody loop
    playBackgroundLoop();
}

function stopBackgroundMusic() {
    isPlaying = false;
    musicToggle.classList.remove('playing');
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    
    if (currentTone) {
        currentTone.stop();
        currentTone = null;
    }
}

function playBackgroundLoop() {
    if (!isPlaying) return;
    
    const backgroundMelody = [
        523.25, 587.33, 659.25, 587.33, // C D E D
        523.25, 493.88, 523.25, 587.33, // C B C D
        659.25, 698.46, 659.25, 587.33, // E F E D
        523.25, 493.88, 440, 493.88     // C B A B
    ];
    
    let noteIndex = 0;
    
    function playNextNote() {
        if (!isPlaying) return;
        
        playTone(backgroundMelody[noteIndex], 0.8, 'sine');
        noteIndex = (noteIndex + 1) % backgroundMelody.length;
        
        setTimeout(playNextNote, 1000);
    }
    
    playNextNote();
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effects to memory cards
document.querySelectorAll('.memory-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Enhanced timeline interactivity
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    // Add cursor pointer to indicate interactivity
    item.style.cursor = 'pointer';
    
    // Add click functionality with enhanced visual feedback
    item.addEventListener('click', () => {
        const content = item.querySelector('.timeline-content');
        const icon = item.querySelector('.timeline-icon');
        
        // Add pulsing animation and background change
        content.style.background = 'var(--color-bg-3)';
        content.style.transform = 'scale(1.05)';
        content.style.boxShadow = '0 10px 30px rgba(33, 128, 141, 0.3)';
        
        // Animate icon
        icon.style.transform = 'translateX(-50%) scale(1.2)';
        icon.style.background = 'var(--color-primary)';
        icon.style.color = 'var(--color-btn-primary-text)';
        
        // Play a soft chime
        playTone(523.25 + (index * 65), 0.4, 'sine');
        
        // Create floating particles
        createTimelineParticles(item);
        
        // Show appreciation message
        showTimelineMessage(index);
        
        // Reset styles after animation
        setTimeout(() => {
            content.style.background = 'var(--color-surface)';
            content.style.transform = 'scale(1)';
            content.style.boxShadow = 'var(--shadow-sm)';
            
            icon.style.transform = 'translateX(-50%) scale(1)';
            icon.style.background = 'var(--color-surface)';
            icon.style.color = 'initial';
        }, 800);
    });
    
    // Add hover effects
    item.addEventListener('mouseenter', () => {
        const content = item.querySelector('.timeline-content');
        content.style.transform = 'scale(1.02)';
        content.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
    });
    
    item.addEventListener('mouseleave', () => {
        const content = item.querySelector('.timeline-content');
        if (!content.style.background.includes('var(--color-bg-3)')) {
            content.style.transform = 'scale(1)';
            content.style.boxShadow = 'var(--shadow-sm)';
        }
    });
});

function createTimelineParticles(timelineItem) {
    const particles = ['✨', '💕', '🌟', '💖'];
    const particleCount = 6;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
        particle.style.position = 'fixed';
        particle.style.fontSize = '1.2rem';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const rect = timelineItem.getBoundingClientRect();
        particle.style.left = (rect.left + rect.width/2) + 'px';
        particle.style.top = (rect.top + rect.height/2) + 'px';
        
        document.body.appendChild(particle);
        
        // Animate particles
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        const endX = rect.left + rect.width/2 + Math.cos(angle) * distance;
        const endY = rect.top + rect.height/2 + Math.sin(angle) * distance - 30;
        
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translate(${endX - rect.left - rect.width/2}px, ${endY - rect.top - rect.height/2}px) scale(1) rotate(360deg)`, 
                opacity: 0 
            }
        ], {
            duration: 1500 + Math.random() * 500,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

function showTimelineMessage(index) {
    const messages = [
        "💝 Those childhood memories are treasures I hold dear",
        "🌟 Your wisdom continues to guide me every day",
        "🎉 You made every celebration magical and special",
        "🤗 Your support means everything to me"
    ];
    
    const message = messages[index] || "💖 Thank you for this beautiful memory";
    
    const msgElement = document.createElement('div');
    msgElement.innerHTML = message;
    msgElement.style.position = 'fixed';
    msgElement.style.top = '25%';
    msgElement.style.left = '50%';
    msgElement.style.transform = 'translate(-50%, -50%)';
    msgElement.style.background = 'var(--color-surface)';
    msgElement.style.color = 'var(--color-text)';
    msgElement.style.padding = '15px 25px';
    msgElement.style.borderRadius = '20px';
    msgElement.style.fontSize = '1.1rem';
    msgElement.style.fontFamily = '"Dancing Script", cursive';
    msgElement.style.zIndex = '1000';
    msgElement.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
    msgElement.style.border = '2px solid var(--color-primary)';
    msgElement.style.maxWidth = '90%';
    msgElement.style.textAlign = 'center';
    
    document.body.appendChild(msgElement);
    
    // Animate message
    msgElement.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -60%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -70%) scale(0.9)', opacity: 0 }
    ], {
        duration: 3000,
        easing: 'ease-in-out'
    }).onfinish = () => msgElement.remove();
}

// Add dynamic styles for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, -50%); opacity: 1; }
    }
    
    @keyframes slideOutUp {
        from { transform: translate(-50%, -50%); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        to { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle animations to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.memory-card, .quality-item, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add keyboard shortcuts for accessibility
document.addEventListener('keydown', (e) => {
    // Space bar to light candles
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        const unlitCandle = document.querySelector('.candle:not(.lit)');
        if (unlitCandle) {
            unlitCandle.click();
        }
    }
    
    // Enter to send love
    if (e.code === 'Enter' && e.target === loveButton) {
        loveButton.click();
    }
});

// Error handling for audio
window.addEventListener('error', (e) => {
    if (e.target && e.target.tagName === 'AUDIO') {
        console.log('Audio playback not available, continuing without sound');
    }
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    document.querySelectorAll('.candle, .timeline-item').forEach(element => {
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            element.click();
        });
    });
}
