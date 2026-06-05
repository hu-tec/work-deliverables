const MODULES = {
  "header-full": {
    type: "header-full",
    label: "헤더 full",
    level: "full",
    children: [
      { type: "logo", label: "Logo" },
      { type: "nav-strip", label: "Nav 4" },
      { type: "actions", label: "Actions" }
    ]
  },
  "grid-1": {
    type: "grid",
    label: "1단 grid",
    columns: 1,
    children: [{ type: "slot", label: "1단" }]
  },
  "grid-2": {
    type: "grid",
    label: "2단 grid",
    columns: 2,
    children: [
      { type: "slot", label: "1" },
      { type: "slot", label: "2" }
    ]
  },
  "grid-3": {
    type: "grid",
    label: "3단 grid",
    columns: 3,
    children: [
      { type: "slot", label: "1" },
      { type: "slot", label: "2" },
      { type: "slot", label: "3" }
    ]
  },
  "grid-4": {
    type: "grid",
    label: "4단 grid",
    columns: 4,
    children: [
      { type: "slot", label: "1" },
      { type: "slot", label: "2" },
      { type: "slot", label: "3" },
      { type: "slot", label: "4" }
    ]
  },
  block: {
    type: "block",
    label: "Block",
    children: [
      { type: "chip", label: "Title" },
      { type: "chip", label: "State" }
    ]
  },
  metric: {
    type: "metric",
    label: "Metric",
    children: [
      { type: "chip", label: "Label" },
      { type: "value", label: "128" },
      { type: "chip", label: "Badge" }
    ]
  },
  list: {
    type: "list",
    label: "List",
    children: [
      { type: "row-item", label: "Item" },
      { type: "row-item", label: "Item" },
      { type: "row-item", label: "Item" }
    ]
  },
  table: {
    type: "table",
    label: "Table",
    children: [
      { type: "table-row", label: "Header" },
      { type: "table-row", label: "Row" },
      { type: "table-row", label: "Row" }
    ]
  }
};

const state = {
  root: [],
  selectedId: null,
  draggedNodeId: null,
  draggedModuleType: null
};

const els = {
  canvas: document.querySelector("#canvas"),
  deleteButton: document.querySelector("#deleteButton"),
  resetButton: document.querySelector("#resetButton"),
  selectedInfo: document.querySelector("#selectedInfo"),
  selectedPreview: document.querySelector("#selectedPreview"),
  moduleCards: [...document.querySelectorAll(".module-card")]
};

let idSeed = 0;

function nextId() {
  idSeed += 1;
  return `node-${idSeed}`;
}

function cloneModule(moduleType) {
  const template = MODULES[moduleType];
  return hydrateNode(template);
}

function hydrateNode(template) {
  return {
    id: nextId(),
    type: template.type,
    label: template.label,
    columns: template.columns || null,
    children: (template.children || []).map(hydrateNode)
  };
}

function resetCanvas() {
  idSeed = 0;
  state.root = [
    cloneModule("header-full"),
    cloneModule("grid-4")
  ];
  state.selectedId = null;
  render();
}

function render() {
  els.canvas.innerHTML = "";

  if (!state.root.length) {
    const empty = document.createElement("div");
    empty.className = "empty-canvas";
    empty.textContent = "오른쪽 모듈을 이곳으로 끌어오세요.";
    els.canvas.append(empty);
  }

  state.root.forEach((node) => {
    els.canvas.append(renderNode(node));
  });

  updateInspector();
}

function renderNode(node) {
  const el = document.createElement("div");
  el.className = `node node-${node.type}`;
  el.dataset.nodeId = node.id;
  el.draggable = true;

  if (node.id === state.selectedId) {
    el.classList.add("is-selected");
  }

  const label = document.createElement("div");
  label.className = "node-label";
  el.append(label);

  if (node.type === "header-full") {
    el.append(renderHeader(node));
  } else if (node.type === "grid") {
    el.append(renderGrid(node));
  } else if (node.type === "block" || node.type === "metric" || node.type === "list" || node.type === "table") {
    el.append(renderFill(node));
  } else if (node.children.length) {
    el.append(renderFill(node));
  } else {
    el.append(renderAtom(node));
  }

  bindNodeEvents(el, node);
  return el;
}

function renderHeader(node) {
  const wrap = document.createElement("div");
  wrap.className = "header-full";
  node.children.forEach((child) => {
    const part = document.createElement("div");
    part.className = `header-part part-${child.type}`;
    part.textContent = child.label;
    wrap.append(part);
  });
  return wrap;
}

function renderGrid(node) {
  const grid = document.createElement("div");
  grid.className = `grid-shell grid-${node.columns}`;
  grid.dataset.dropZoneId = node.id;

  node.children.forEach((child) => {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.dataset.dropZoneId = child.id;
    cell.append(renderNode(child));
    bindDropZone(cell, child.id);
    grid.append(cell);
  });

  bindDropZone(grid, node.id);
  return grid;
}

function renderFill(node) {
  const wrap = document.createElement("div");
  wrap.className = `fill fill-${node.type}`;
  node.children.forEach((child) => {
    wrap.append(renderNode(child));
  });
  bindDropZone(wrap, node.id);
  return wrap;
}

function renderAtom(node) {
  const atom = document.createElement("div");
  atom.className = `atom atom-${node.type}`;
  atom.textContent = node.label;
  return atom;
}

function bindNodeEvents(el, node) {
  el.addEventListener("click", (event) => {
    event.stopPropagation();
    state.selectedId = node.id;
    render();
  });

  el.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    state.draggedNodeId = node.id;
    state.draggedModuleType = null;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-node-id", node.id);
    el.classList.add("is-dragging");
  });

  el.addEventListener("dragend", () => {
    state.draggedNodeId = null;
    document.querySelectorAll(".is-dragging, .is-drop-target").forEach((target) => {
      target.classList.remove("is-dragging", "is-drop-target");
    });
  });

  bindDropZone(el, node.id);
}

function bindDropZone(el, targetId) {
  el.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation();
    el.classList.add("is-drop-target");
  });

  el.addEventListener("dragleave", () => {
    el.classList.remove("is-drop-target");
  });

  el.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    el.classList.remove("is-drop-target");

    const moduleType = event.dataTransfer.getData("application/x-module-type");
    const nodeId = event.dataTransfer.getData("application/x-node-id");

    if (moduleType) {
      addModule(moduleType, targetId);
      return;
    }

    if (nodeId) {
      moveNode(nodeId, targetId);
    }
  });
}

function addModule(moduleType, targetId = null) {
  const node = cloneModule(moduleType);
  const target = targetId ? findNode(targetId) : null;

  if (!target) {
    state.root.push(node);
  } else if (target.type === "slot") {
    target.children.push(node);
  } else if (canContain(target)) {
    target.children.push(node);
  } else {
    const parent = findParent(target.id);
    if (parent) {
      parent.children.push(node);
    } else {
      state.root.push(node);
    }
  }

  state.selectedId = node.id;
  render();
}

function canContain(node) {
  return ["grid", "slot", "block", "metric", "list", "table"].includes(node.type);
}

function moveNode(nodeId, targetId) {
  if (nodeId === targetId) return;
  const node = removeNode(nodeId);
  const target = findNode(targetId);
  if (!node || !target || isDescendant(node, targetId)) {
    if (node) state.root.push(node);
    render();
    return;
  }

  if (canContain(target)) {
    target.children.push(node);
  } else {
    const parent = findParent(target.id);
    if (parent) parent.children.push(node);
    else state.root.push(node);
  }

  state.selectedId = node.id;
  render();
}

function removeNode(nodeId, nodes = state.root) {
  const index = nodes.findIndex((node) => node.id === nodeId);
  if (index >= 0) {
    return nodes.splice(index, 1)[0];
  }

  for (const node of nodes) {
    const removed = removeNode(nodeId, node.children);
    if (removed) return removed;
  }

  return null;
}

function findNode(nodeId, nodes = state.root) {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    const found = findNode(nodeId, node.children);
    if (found) return found;
  }
  return null;
}

function findParent(nodeId, nodes = state.root, parent = null) {
  for (const node of nodes) {
    if (node.id === nodeId) return parent;
    const found = findParent(nodeId, node.children, node);
    if (found) return found;
  }
  return null;
}

function isDescendant(node, targetId) {
  return node.children.some((child) => child.id === targetId || isDescendant(child, targetId));
}

function deleteSelected() {
  if (!state.selectedId) return;
  removeNode(state.selectedId);
  state.selectedId = null;
  render();
}

function updateInspector() {
  const selected = state.selectedId ? findNode(state.selectedId) : null;
  if (!selected) {
    els.selectedInfo.textContent = "없음";
    els.selectedPreview.textContent = "캔버스에서 영역을 선택하세요.";
    return;
  }

  els.selectedInfo.textContent = "선택됨";
  els.selectedPreview.textContent = "선택한 영역에 오른쪽 모듈을 클릭하거나 끌어 넣을 수 있습니다.";
}

els.moduleCards.forEach((card) => {
  card.addEventListener("dragstart", (event) => {
    state.draggedModuleType = card.dataset.moduleType;
    state.draggedNodeId = null;
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/x-module-type", card.dataset.moduleType);
  });

  card.addEventListener("click", () => {
    addModule(card.dataset.moduleType, state.selectedId);
  });
});

els.canvas.addEventListener("click", () => {
  state.selectedId = null;
  render();
});

els.canvas.addEventListener("dragover", (event) => {
  event.preventDefault();
  els.canvas.classList.add("is-drop-target");
});

els.canvas.addEventListener("dragleave", () => {
  els.canvas.classList.remove("is-drop-target");
});

els.canvas.addEventListener("drop", (event) => {
  event.preventDefault();
  els.canvas.classList.remove("is-drop-target");
  const moduleType = event.dataTransfer.getData("application/x-module-type");
  if (moduleType) addModule(moduleType);
});

els.deleteButton.addEventListener("click", deleteSelected);
els.resetButton.addEventListener("click", resetCanvas);

resetCanvas();
