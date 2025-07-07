// Some cool tips to help the Earth
const tips = [
  "Bring a bottle you can use again.",
  "Use both sides of your paper.",
  "Unplug your charger when done.",
  "Join an eco club at school!",
  "Turn off water when brushing teeth."
];

// Show one tip
function showTip() {
  let tip = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById("dailyTip").textContent = tip;
}

// Save stories and scores
let stories = JSON.parse(localStorage.getItem("stories")) || [];
let scores = JSON.parse(localStorage.getItem("scores")) || {};

let form = document.getElementById("storyForm");
let storyPlace = document.getElementById("stories");
let leaderboard = document.getElementById("leaderboardList");
let message = document.getElementById("awardMessage");
let photoBox = document.getElementById("photo");
let photoShow = document.getElementById("photoPreview");

// Show the photo before saving
photoBox.addEventListener("change", function () {
  let file = photoBox.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      photoShow.src = e.target.result;
      photoShow.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    photoShow.style.display = "none";
    photoShow.src = "";
  }
});

// When someone writes a story
form.addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let story = document.getElementById("story").value.trim();
  let photo = document.getElementById("photo").files[0];

  if (!name || !story || !photo) return;

  let reader = new FileReader();
  reader.onload = function () {
    let newStory = {
      name: name,
      text: story,
      image: reader.result,
      time: new Date().toISOString()
    };

    stories.push(newStory);
    localStorage.setItem("stories", JSON.stringify(stories));

    // Add points
    if (!scores[name]) {
      scores[name] = 0;
    }
    scores[name]++;
    localStorage.setItem("scores", JSON.stringify(scores));

    message.innerHTML = "🏅 You got an Eco Hero Award!";
    form.reset();
    photoShow.style.display = "none";
    showStories();
    showLeaderboard();
  };

  reader.readAsDataURL(photo);
});

// Show all the stories
function showStories() {
  storyPlace.innerHTML = "";
  stories.slice().reverse().forEach(function (s) {
    let box = document.createElement("div");
    box.className = "story-card";
    box.innerHTML = `
      <h3>🌱 ${s.name}</h3>
      <p>${s.text}</p>
      <img src="${s.image}" alt="photo" />
      <small>🕒 ${new Date(s.time).toLocaleString()}</small>
    `;
    storyPlace.appendChild(box);
  });
}

// Show top people
function showLeaderboard() {
  let top = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  leaderboard.innerHTML = "";
  top.forEach(function ([name, points], i) {
    let item = document.createElement("li");
    item.textContent = (i + 1) + ". " + name + " - " + points + " stories";
    leaderboard.appendChild(item);
  });
}

// When the page starts
showStories();
showLeaderboard();