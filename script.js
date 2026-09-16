fetch("/api/images")
  .then(res => res.json())
  .then(images => {
    const gallery = document.querySelector(".gallery-grid");

    images.forEach(img => {
      const imageElement = document.createElement("img");
      imageElement.src = `images/${img}`;
      imageElement.alt = img;
      imageElement.classList.add("gallery-photo");
      gallery.appendChild(imageElement);
    });
  })
  .catch(err => console.error("Error loading images:", err));



