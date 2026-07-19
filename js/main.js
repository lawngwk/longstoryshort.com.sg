document.addEventListener("DOMContentLoaded", () => {
    // Configuration for the image sequences IN EXACT ORDER requested
    const sequences = [
        {
            canvasId: "canvas-tamba",
            sectionId: "hero-tamba",
            folder: "assets/sequences/LSS_Tamba_Sequence",
            prefix: "ezgif-frame-",
            frameCount: 252
        },
        {
            canvasId: "canvas-march",
            sectionId: "hero-march",
            folder: "assets/sequences/LSS_March_Sequence",
            prefix: "ezgif-frame-",
            frameCount: 179
        },
        {
            canvasId: "canvas-cooking",
            sectionId: "hero-cooking",
            folder: "assets/sequences/LSS_Cooking_Sequence",
            prefix: "ezgif-frame-",
            frameCount: 186
        }
    ];

    const currentFrame = (folder, prefix, index) => (
        `${folder}/${prefix}${index.toString().padStart(3, '0')}.jpg`
    );

    const initSequence = (config) => {
        const canvas = document.getElementById(config.canvasId);
        if (!canvas) return;
        
        const context = canvas.getContext("2d");
        const section = document.getElementById(config.sectionId);
        
        const images = [];
        let loadedCount = 0;
        
        const img = new Image();
        img.src = currentFrame(config.folder, config.prefix, 1);
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
        };
        images[1] = img;

        for (let i = 2; i <= config.frameCount; i++) {
            const preImg = new Image();
            preImg.src = currentFrame(config.folder, config.prefix, i);
            images[i] = preImg;
        }

        const updateFrame = () => {
            const rect = section.getBoundingClientRect();
            const scrollDistance = -rect.top;
            
            const maxScroll = rect.height - window.innerHeight;
            
            let scrollFraction = scrollDistance / maxScroll;
            scrollFraction = Math.max(0, Math.min(1, scrollFraction));

            const frameIndex = Math.min(
                config.frameCount,
                Math.max(1, Math.floor(scrollFraction * config.frameCount))
            );

            if (images[frameIndex]) {
                requestAnimationFrame(() => {
                    context.drawImage(images[frameIndex], 0, 0);
                });
            }
        };

        window.addEventListener('scroll', () => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                updateFrame();
            }
        });
        
        updateFrame();
    };

    sequences.forEach(seq => initSequence(seq));

    // Video Modal Logic
    const showreelBtn = document.querySelector('.showreel-trigger');
    const modal = document.getElementById('video-modal');
    const closeBtn = document.querySelector('.close-btn');
    const player = document.getElementById('youtube-player');

    if (showreelBtn && modal) {
        showreelBtn.addEventListener('click', () => {
            modal.classList.add('active');
            // Try standard embed URL without autoplay/origin to avoid configuration errors on local files
            player.src = "https://www.youtube.com/embed/K6qXupz5dJo?rel=0";
        });

        // Close when clicking the X
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            player.src = ""; // Stop playing
        });

        // Close when clicking outside the video
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                player.src = ""; // Stop playing
            }
        });
    }
});
