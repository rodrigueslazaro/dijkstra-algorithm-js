const spots = document.getElementsByTagName("div");
let tag = 1;
let phase = 0;
let count = 0;
let edges = [];

for (let i = 0; i < 192; i++) {
  spots[i].addEventListener("click", function () {
    if (phase === 0) {
      spots[i].classList.toggle("selected");
      if (spots[i].classList.contains("selected")) {
        spots[i].textContent = tag;
        tag += 1;
      } else {
        spots[i].textContent = "";
        tag -= 1;
      }
    } else if (phase === 1) {
      if (count < 2) {
        if (spots[i].classList.contains("selected")) {
          spots[i].classList.toggle("selected");
          spots[i].classList.toggle("selected-node");
          count += 1;
        }
      } else if (spots[i].classList.contains("selected-node")) {
        spots[i].classList.toggle("selected-node");
        spots[i].classList.toggle("selected");
        count -= 1;
      }
    }
  });
}

const selectNodesButton = document.getElementById("nodes-button");
selectNodesButton.addEventListener("click", function () {
  for (let i = 0; i < 192; i++) {
    if (!spots[i].classList.contains("selected")) {
      spots[i].classList.add("erase");
    }
  }
  phase += 1;
});

const addEdgeButton = document.getElementById("edges-button");
addEdgeButton.addEventListener("click", function() {
  for (let i = 0; i < 192; i++) {
    if (spots[i].classList.contains("selected-node")) {
      edges.push(spots[i])
    }
  }
  const rect1 = edges[0].getBoundingClientRect();
  const rect2 = edges[1].getBoundingClientRect();
  const x1 = rect1.left + rect1.width / 2; // X-coordinate of the center of element1.
  const y1 = rect1.top + rect1.height / 2; // Y-coordinate of the center of element1.
  const x2 = rect2.left + rect2.width / 2; // X-coordinate of the center of element2.
  const y2 = rect2.top + rect2.height / 2; // Y-coordinate of the center of element2.
  const svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  svgLine.setAttribute("x1", x1);
  svgLine.setAttribute("y1", y1+40);
  svgLine.setAttribute("x2", x2);
  svgLine.setAttribute("y2", y2+40);
  svgLine.setAttribute("stroke", "black"); // You can set the line color here.
  svgLine.setAttribute("stroke-width", "5"); // You can set the line color here.
  document.querySelector("svg").appendChild(svgLine);
  edges = [];
})

const confirmButton = document.getElementById("confirm");
confirmButton.addEventListener("click", function () {
  for (let i = 0; i < 192; i++) {
    if (spots[i].classList.contains("selected-node") || spots[i].classList.contains("selected") ) {
      spots[i].classList = "confirmed-node"
    }
  }
})