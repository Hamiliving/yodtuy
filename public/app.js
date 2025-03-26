document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const closeButtons = document.querySelectorAll('.close');
    const uploadForm = document.getElementById('uploadForm');
    const videosContainer = document.getElementById('videosContainer');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const downloadBtn = document.getElementById('downloadBtn');

    // Load videos on page load
    loadVideos();

    // Modal controls
    uploadBtn.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            uploadModal.style.display = 'none';
            videoPlayerModal.style.display = 'none';
            videoPlayer.pause();
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === uploadModal) uploadModal.style.display = 'none';
        if (e.target === videoPlayerModal) {
            videoPlayerModal.style.display = 'none';
            videoPlayer.pause();
        }
    });

    // Handle video upload
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            if (data.success) {
                uploadModal.style.display = 'none';
                uploadForm.reset();
                loadVideos();
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Failed to upload video. Please try again.');
        }
    });

    // Load videos function
    async function loadVideos() {
        try {
            videosContainer.innerHTML = '<div class="loading"></div>';
            const response = await fetch('/api/videos');
            const videos = await response.json();
            
            videosContainer.innerHTML = videos.map(video => `
                <div class="video-card" data-video="${video.filename}">
                    <video class="video-thumbnail" preload="metadata">
                        <source src="/uploads/${video.filename}" type="video/mp4">
                    </video>
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>${new Date(video.uploadDate).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');

            // Add click handlers to video cards
            document.querySelectorAll('.video-card').forEach(card => {
                card.addEventListener('click', () => playVideo(card.dataset.video));
            });
        } catch (error) {
            console.error('Error loading videos:', error);
            videosContainer.innerHTML = '<p>Error loading videos. Please try again later.</p>';
        }
    }

    // Play video function
    function playVideo(filename) {
        videoPlayer.src = `/uploads/${filename}`;
        const videoCard = document.querySelector(`[data-video="${filename}"]`);
        videoTitle.textContent = videoCard.querySelector('h3').textContent;
        videoDescription.textContent = videoCard.querySelector('p').textContent;
        videoPlayerModal.style.display = 'block';
        
        // Set up download button
        downloadBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = `/uploads/${filename}`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const videoCards = document.querySelectorAll('.video-card');
        
        videoCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
});
