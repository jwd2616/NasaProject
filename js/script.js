// NASA APOD API key (demo key for beginners)
const API_KEY = 'DEMO_KEY';

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get the gallery container and button
const gallery = document.getElementById('gallery');
const getImagesBtn = document.getElementById('getImagesBtn');

// Array of fun space facts for beginners
const spaceFacts = [
  "Did you know? The Sun is 400 times larger than the Moon but also 400 times farther away from Earth.",
  "Did you know? One day on Venus is longer than one year on Venus.",
  "Did you know? Neutron stars can spin at a rate of 600 times per second.",
  "Did you know? There are more stars in the universe than grains of sand on Earth.",
  "Did you know? Jupiter has 92 known moons.",
  "Did you know? The footprints on the Moon will remain for millions of years.",
  "Did you know? Saturn could float in water because it is mostly made of gas.",
  "Did you know? A spoonful of a neutron star would weigh about a billion tons.",
  "Did you know? The largest volcano in the solar system is on Mars.",
  "Did you know? Space is completely silent."
];

// Show a random space fact above the gallery
function showRandomFact() {
  // Pick a random fact from the array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  const fact = spaceFacts[randomIndex];
  // Create a div for the fact
  let factDiv = document.getElementById('spaceFact');
  if (!factDiv) {
    factDiv = document.createElement('div');
    factDiv.id = 'spaceFact';
    factDiv.style.margin = '20px auto';
    factDiv.style.maxWidth = '700px';
    factDiv.style.background = 'rgba(0,0,0,0.7)';
    factDiv.style.color = '#fff';
    factDiv.style.fontSize = '18px';
    factDiv.style.padding = '16px';
    factDiv.style.borderRadius = '8px';
    factDiv.style.textAlign = 'center';
    // Insert above the gallery
    const container = document.querySelector('.container');
    container.insertBefore(factDiv, gallery);
  }
  factDiv.textContent = fact;
}

// Call this once when the page loads
showRandomFact();

// This function gets images from NASA's APOD API using the selected date range
async function fetchSpaceImages(startDate, endDate) {
  // NASA API key and endpoint
  const apiKey = 'j7bOghg2ayokNW3wyp9Vch7R2bV3cmDT787wdpWY';
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from NASA
  const response = await fetch(url);
  const data = await response.json();
  return data; // Returns an array of image objects
}

// Helper function to check if a URL is a YouTube video
function isYouTube(url) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Helper function to check if a URL is a Vimeo video
function isVimeo(url) {
  return url.includes('vimeo.com');
}

// This function displays the gallery of images and videos
function displayGallery(items) {
  gallery.innerHTML = '';

  items.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    if (item.media_type === 'image') {
      div.innerHTML = `
        <img src="${item.url}" alt="${item.title}" class="gallery-img zoom-effect" />
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
      div.addEventListener('click', () => openModal(item));
    } else if (item.media_type === 'video') {
      if (isYouTube(item.url)) {
        // Embed YouTube video in gallery
        div.innerHTML = `
          <div class="video-container">
            <iframe src="${item.url.replace('watch?v=', 'embed/')}" frameborder="0" allowfullscreen class="gallery-video"></iframe>
          </div>
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;
        div.addEventListener('click', () => openModal(item));
      } else if (isVimeo(item.url)) {
        // Embed Vimeo video in gallery
        // Extract Vimeo video ID
        const vimeoId = item.url.split('/').pop();
        div.innerHTML = `
          <div class="video-container">
            <iframe src="https://player.vimeo.com/video/${vimeoId}" frameborder="0" allowfullscreen class="gallery-video"></iframe>
          </div>
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;
        div.addEventListener('click', () => openModal(item));
      } else {
        // Non-YouTube/Vimeo video: show a link
        div.innerHTML = `
          <div class="video-thumb" style="padding:10px;">
            <a href="${item.url}" target="_blank" style="color:#90caf9;text-decoration:underline;font-size:18px;">
              ▶️ Watch: ${item.title}
            </a>
          </div>
          <p>${item.date}</p>
        `;
      }
    }
    gallery.appendChild(div);
  });
}

// Get DOM elements for the modal
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

// Add a starry background to the page
function createStars(numStars = 120) {
  // Create a container for stars
  const starryBg = document.createElement('div');
  starryBg.className = 'starry-bg';
  // Create stars at random positions
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    // Random position and animation delay
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    starryBg.appendChild(star);
  }
  document.body.appendChild(starryBg);
}

// Call this once when the page loads
createStars();

// Function to open the modal with image or video details
function openModal(item) {
  // If image, show image
  if (item.media_type === 'image') {
    modalImg.style.display = 'block';
    modalImg.src = item.url;
    let modalVideo = document.getElementById('modalVideo');
    if (modalVideo) modalVideo.style.display = 'none';
  } else if (item.media_type === 'video' && isYouTube(item.url)) {
    modalImg.style.display = 'none';
    let modalVideo = document.getElementById('modalVideo');
    if (!modalVideo) {
      modalVideo = document.createElement('iframe');
      modalVideo.id = 'modalVideo';
      modalVideo.className = 'modal-video';
      modalVideo.frameBorder = '0';
      modalVideo.allowFullscreen = true;
      modalVideo.style.width = '100%';
      modalVideo.style.height = '320px';
      modalImg.parentNode.insertBefore(modalVideo, modalImg);
    }
    modalVideo.src = item.url.replace('watch?v=', 'embed/');
    modalVideo.style.display = 'block';
  } else if (item.media_type === 'video' && isVimeo(item.url)) {
    modalImg.style.display = 'none';
    let modalVideo = document.getElementById('modalVideo');
    if (!modalVideo) {
      modalVideo = document.createElement('iframe');
      modalVideo.id = 'modalVideo';
      modalVideo.className = 'modal-video';
      modalVideo.frameBorder = '0';
      modalVideo.allowFullscreen = true;
      modalVideo.style.width = '100%';
      modalVideo.style.height = '320px';
      modalImg.parentNode.insertBefore(modalVideo, modalImg);
    }
    // Extract Vimeo video ID
    const vimeoId = item.url.split('/').pop();
    modalVideo.src = `https://player.vimeo.com/video/${vimeoId}`;
    modalVideo.style.display = 'block';
  } else if (item.media_type === 'video') {
    modalImg.style.display = 'none';
    let modalVideo = document.getElementById('modalVideo');
    if (modalVideo) modalVideo.style.display = 'none';
    modalExplanation.innerHTML = `<a href="${item.url}" target="_blank" style="color:#90caf9;text-decoration:underline;font-size:18px;">▶️ Watch Video</a><br><br>${item.explanation}`;
  } else {
    modalImg.style.display = 'none';
    let modalVideo = document.getElementById('modalVideo');
    if (modalVideo) modalVideo.style.display = 'none';
  }
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  if (item.media_type !== 'video' || isYouTube(item.url) || isVimeo(item.url)) {
    modalExplanation.textContent = item.explanation;
  }
  modal.style.display = 'block';
  document.body.classList.add('modal-open');
}

// Function to close the modal
closeModal.onclick = function() {
  modal.style.display = 'none';
  // Remove class from body to slow twinkle
  document.body.classList.remove('modal-open');
};

// Also close modal when clicking outside modal content
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
};

// When the button is clicked, get images and show them
getImagesBtn.addEventListener('click', async () => {
  // Get the selected dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Show loading message before fetching images
  gallery.innerHTML = '<p style="text-align:center;font-size:18px;">🔄 Loading space photos…</p>';

  // Fetch images and display them
  const images = await fetchSpaceImages(startDate, endDate);
  displayGallery(images);
});