const graph = {
  'Phase 1': { 'Phase 2': 2, 'Phase 5': 4 },
  'Phase 2': { 'Phase 1': 2, 'Phase 3': 3 },
  'Phase 3': { 'Phase 2': 3, 'Phase 7': 6 },
  'Phase 5': { 'Phase 1': 4, 'Phase 6': 5 },
  'Phase 6': { 'Phase 5': 5, 'Phase 7': 2 },
  'Phase 7': { 'Phase 3': 6, 'Phase 6': 2 }
};

const nodePositions = {
  'Phase 1': [100, 100],
  'Phase 2': [250, 100],
  'Phase 3': [400, 100],
  'Phase 5': [100, 250],
  'Phase 6': [250, 250],
  'Phase 7': [400, 250]
};

const phaseImages = {
  "Phase 1": "images/mall.png",
  "Phase 2": "images/hospital.png",
  "Phase 3": "images/school.png",
  "Phase 5": "images/house.png",
  "Phase 6": "images/market.png",
  "Phase 7": "images/busstand.png"
};

function drawGraph(path = []) {
  const canvas = document.getElementById("mapCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  for (const node in graph) {
    for (const neighbor in graph[node]) {
      const [x1, y1] = nodePositions[node];
      const [x2, y2] = nodePositions[neighbor];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      const isPath = path.includes(node) && path.includes(neighbor) &&
        Math.abs(path.indexOf(node) - path.indexOf(neighbor)) === 1;
      ctx.strokeStyle = isPath ? "red" : "#999";
      ctx.lineWidth = isPath ? 4 : 2;
      ctx.stroke();
    }
  }

  // Draw nodes and images
  for (const node in nodePositions) {
    const [x, y] = nodePositions[node];

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#007bff";
    ctx.fill();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();

    if (phaseImages[node]) {
      const img = new Image();
      img.src = phaseImages[node];
      img.onload = () => {
        ctx.drawImage(img, x - 15, y - 65, 30, 30);
      };
    }

    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(node, x, y + 5);
  }
}

function dijkstra(graph, start, end) {
  let distances = {};
  let prev = {};
  let pq = new Set(Object.keys(graph));

  for (let node of pq) distances[node] = Infinity;
  distances[start] = 0;

  while (pq.size) {
    let minNode = [...pq].reduce((a, b) => (distances[a] < distances[b] ? a : b));
    pq.delete(minNode);

    if (minNode === end) break;

    for (let neighbor in graph[minNode]) {
      let alt = distances[minNode] + graph[minNode][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        prev[neighbor] = minNode;
      }
    }
  }

  let path = [], u = end;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }

  return {
    distance: distances[end],
    path
  };
}

function findRoute() {
  const start = document.getElementById("startLocation").value;
  const end = document.getElementById("endLocation").value;
  const resultDiv = document.getElementById("result");

  if (!start || !end) {
    alert("Please select both start and end locations.");
    return;
  }

  if (start === end) {
    resultDiv.classList.remove("d-none");
    resultDiv.innerText = "Start and end locations are the same.";
    drawGraph([]);
    return;
  }

  const { distance, path } = dijkstra(graph, start, end);
  resultDiv.classList.remove("d-none");
  resultDiv.innerText = `Shortest Distance: ${distance}\nPath: ${path.join(" ➝ ")}`;
  drawGraph(path);
}

function openGoogleMaps() {
  const start = document.getElementById("startLocation").value;
  const end = document.getElementById("endLocation").value;

  if (!start || !end || start === end) {
    alert("Please select different start and end locations.");
    return;
  }

  const url = `https://www.google.com/maps/dir/${start.replace(/ /g, "+")}/${end.replace(/ /g, "+")}`;
  window.open(url, '_blank');
}

function resetRoute() {
  document.getElementById("startLocation").selectedIndex = 0;
  document.getElementById("endLocation").selectedIndex = 0;
  document.getElementById("result").classList.add("d-none");
  drawGraph([]);
}

window.onload = drawGraph;
