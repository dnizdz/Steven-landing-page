const getByPath = (obj, path) => {
  if (!path) return undefined;
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const setTextNodes = (config) => {
  document.querySelectorAll("[data-text]").forEach((node) => {
    const value = getByPath(config, node.dataset.text);
    if (typeof value === "string") {
      node.textContent = value;
    }
  });
};

const setAttributes = (config) => {
  document.querySelectorAll("[data-attr]").forEach((node) => {
    const [attr, path] = node.dataset.attr.split(":");
    const value = getByPath(config, path);
    if (attr && typeof value === "string") {
      node.setAttribute(attr, value);
    }
  });
};

const setLists = (config) => {
  document.querySelectorAll("[data-list]").forEach((list) => {
    const items = getByPath(config, list.dataset.list);
    if (!Array.isArray(items)) return;

    list.innerHTML = "";

    if (list.dataset.list === "nav.links") {
      items.forEach((item) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;
        li.appendChild(a);
        list.appendChild(li);
      });
      return;
    }

    if (list.dataset.list === "features") {
      items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "service-card";
        const title = document.createElement("h3");
        title.textContent = item.title;
        const desc = document.createElement("p");
        desc.textContent = item.description;
        card.appendChild(title);
        card.appendChild(desc);
        list.appendChild(card);
      });
      return;
    }

    if (list.dataset.list === "works.items") {
      items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "work-card";
        card.textContent = item.label;
        list.appendChild(card);
      });
    }
  });
};

const setCtas = (config) => {
  document.querySelectorAll("[data-ctas]").forEach((wrap) => {
    const items = getByPath(config, wrap.dataset.ctas);
    if (!Array.isArray(items)) return;

    wrap.innerHTML = "";
    items.forEach((item) => {
      const a = document.createElement("a");
      a.href = item.link;
      a.textContent = item.text;
      a.className = item.variant === "ghost" ? "is-ghost" : "";
      wrap.appendChild(a);
    });
  });
};

const applyTheme = (theme) => {
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty("--primary-color", theme.primaryColor);
  root.style.setProperty("--secondary-color", theme.secondaryColor);
  root.style.setProperty("--background-color", theme.backgroundColor);
  root.style.setProperty("--font-family", theme.fontFamily);
  root.style.setProperty("--heading-size", theme.headingSize);
  root.style.setProperty("--body-size", theme.bodySize);
};

const setDocumentTitle = (config) => {
  if (config.meta && config.meta.title) {
    document.title = config.meta.title;
  }
};

const setupNavToggle = () => {
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.querySelector(".nav-drawer");
  if (!toggle || !drawer) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    drawer.hidden = isOpen;
  });
};

const init = async () => {
  const response = await fetch("config.json");
  const config = await response.json();

  applyTheme(config.theme);
  setDocumentTitle(config);
  setTextNodes(config);
  setAttributes(config);
  setLists(config);
  setCtas(config);
  setupNavToggle();
};

init();
