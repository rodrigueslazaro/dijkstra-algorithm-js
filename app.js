const spots = document.getElementsByTagName("div");
let tag = 1;
let phase = 0;
let count = 0;
let edges = [];
const graph = {};

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
    } else if (phase === 2) {
      count = 0;
      if (spots[i].classList.contains("confirmed-node") && count == 0) {
        spots[i].classList.toggle("confirmed-node");
        spots[i].classList.toggle("root");
        count += 1;
      } else if (spots[i].classList.contains("root") && count == 1) {
        spots[i].classList.toggle("root");
        spots[i].classList.toggle("confirmed-node");
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

function addEdge(node1, node2) {
  // Initialize the nodes if they don't exist in the graph
  graph[node1] = graph[node1] || {};
  graph[node2] = graph[node2] || {};

  // Add edges between nodes
  graph[node1][node2] = 1;
  graph[node2][node1] = 1;
}

const addEdgeButton = document.getElementById("edges-button");
addEdgeButton.addEventListener("click", function() {
  for (let i = 0; i < 192; i++) {
    if (spots[i].classList.contains("selected-node")) {
      edges.push(spots[i])
    }
  }
  const rect1 = edges[0].getBoundingClientRect();
  const rect2 = edges[1].getBoundingClientRect();
  //graph[edges[0].textContent] = { [edges[1].textContent]: 1 };
  //graph[edges[1].textContent] = { [edges[0].textContent]: 1 };
  addEdge(edges[0].textContent, edges[1].textContent);
  console.log(graph);
  const x1 = rect1.left + rect1.width / 2; // X-coordinate of the center of element1.
  const y1 = rect1.top + rect1.height / 2; // Y-coordinate of the center of element1.
  const x2 = rect2.left + rect2.width / 2; // X-coordinate of the center of element2.
  const y2 = rect2.top + rect2.height / 2; // Y-coordinate of the center of element2.
  const svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  svgLine.setAttribute("x1", x1);
  svgLine.setAttribute("y1", y1);
  svgLine.setAttribute("x2", x2);
  svgLine.setAttribute("y2", y2);
  svgLine.setAttribute("stroke", "black"); // You can set the line color here.
  svgLine.setAttribute("stroke-width", "5"); // You can set the line color here.
  document.querySelector("svg").appendChild(svgLine);
  edges = [];
})

const confirmButton = document.getElementById("confirm");
confirmButton.addEventListener("click", function () {
  for (let i = 0; i < 192; i++) {
    if (spots[i].classList.contains("selected-node") || spots[i].classList.contains("selected") ) {
      spots[i].classList = "confirmed-node";
    }
  }
  phase += 1;
})

function dijkstra(graph, startNode) {
  const distances = {};
  const visited = {};
  const queue = [];

  // Initialize distances with Infinity, except for the startNode
  for (let node in graph) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  // Start with the initial node
  queue.push(startNode);

  while (queue.length) {
    // Sort nodes in the queue by distance
    queue.sort((a, b) => distances[a] - distances[b]);
    const currentNode = queue.shift();

    if (visited[currentNode]) continue;

    visited[currentNode] = true;

    for (let neighbor in graph[currentNode]) {
      const distance = distances[currentNode] + graph[currentNode][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        queue.push(neighbor);
      }
    }
  }

  return distances;
}

const runDjikstra = document.getElementById("run-algorithm");
runDjikstra.addEventListener("click", function() {
  for (let i = 0; i < 192; i++) {
    if (spots[i].classList.contains("root")) {
      startNode = spots[i].textContent;
    }
  }
  const shortestDistances = dijkstra(graph, startNode);
  const dijkstra_result = document.getElementById("djikstra-result");
  let lines = [];
  for (const key in shortestDistances) {
    if (shortestDistances.hasOwnProperty(key)) {
      lines.push(`${startNode}-${key}: d${shortestDistances[key]}.`);
    }
  }
  const output = lines.join("\n\n");
  dijkstra_result.textContent = output;
})
