(function () {
  const cfg = window.LINKHUB;
  if (!cfg) {
    document.body.innerHTML = "<p style='padding:16px'>Config não encontrada (config.js).</p>";
    return;
  }

  const ICONS = {
    whatsapp: {
      color: "#25D366",
      bg: "rgba(37,211,102,.14)",
      svg: `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.04 2C6.55 2 2.09 6.46 2.09 11.95c0 1.94.56 3.83 1.62 5.46L2 22l4.72-1.66a9.86 9.86 0 0 0 5.32 1.56h.01c5.49 0 9.95-4.46 9.95-9.95S17.53 2 12.04 2Zm0 18.11h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.8.98.94-2.73-.2-.31a8.23 8.23 0 0 1-1.26-4.78c0-4.56 3.72-8.27 8.29-8.27 4.56 0 8.27 3.71 8.27 8.27 0 4.57-3.71 8.29-8.27 8.29Zm4.8-6.2c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.17.26-.67.85-.82 1.02-.15.17-.31.2-.57.07-.26-.13-1.1-.41-2.1-1.3-.78-.7-1.31-1.56-1.46-1.82-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.17-.26.26-.44.09-.17.04-.33-.02-.46-.07-.13-.58-1.39-.8-1.91-.21-.5-.42-.43-.58-.44h-.5c-.17 0-.44.07-.67.33-.22.26-.86.84-.86 2.06 0 1.22.88 2.4 1 2.57.13.17 1.74 2.65 4.22 3.72.59.25 1.04.4 1.4.51.59.19 1.13.16 1.56.1.48-.07 1.54-.63 1.75-1.23.22-.6.22-1.12.15-1.23-.06-.11-.24-.17-.5-.3Z"/>
      </svg>`
    },

    facebook: {
      color: "#1877F2",
      bg: "rgba(24,119,242,.12)",
      svg: `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3H13.5V9.1c0-.87.24-1.46 1.5-1.46h1.6V5a22 22 0 0 0-2.3-.12c-2.28 0-3.84 1.39-3.84 3.94V11H8v3h2.46v8h3.04Z"/>
      </svg>`
    },

    github: {
      color: "#111827",
      bg: "rgba(17,24,39,.10)",
      svg: `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.52 1.03 1.52 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0 1 12 6.8a9.5 9.5 0 0 1 2.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.39.2 2.42.1 2.67.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.73c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/>
      </svg>`
    },

    email: {
      color: "#0a78c6",
      bg: "rgba(10,120,198,.12)",
      svg: `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/>
      </svg>`
    },

    tool: {
      color: "#0b5faa",
      bg: "rgba(11,95,170,.12)",
      svg: `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.7 6.3a4 4 0 0 0-5.5 5.5L3 18v3h3l6.2-6.2a4 4 0 0 0 5.5-5.5l-2.1 2.1-2.2-.6-.6-2.2 1.9-2.3Z"/>
      </svg>`
    },

    school: {
      color: "#22c55e",
      bg: "rgba(34,197,94,.12)",
      svg: `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm0 13L3.2 11.2 12 6.4l8.8 4.8L12 16Zm-6 2v-5l6 3 6-3v5h-2v-3l-4 2-4-2v3H6Z"/>
      </svg>`
    },

    cv: {
      color: "#2563eb",
      bg: "rgba(37,99,235,.12)",
      svg: `<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 2h9l3 3v17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V6h2.5L14 3.5ZM7 9h8v2H7V9Zm0 4h8v2H7v-2Zm0 4h5v2H7v-2Z"/>
      </svg>`
    },

    // Instagram com degradê no próprio SVG (100% offline)
    instagram: {
      gradient: true,
      bg: "rgba(214,41,118,.10)",
      svg: (gid) => `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="${gid}" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stop-color="#feda75"/>
            <stop offset="0.25" stop-color="#fa7e1e"/>
            <stop offset="0.55" stop-color="#d62976"/>
            <stop offset="0.78" stop-color="#962fbf"/>
            <stop offset="1" stop-color="#4f5bd5"/>
          </linearGradient>
        </defs>
        <path fill="url(#${gid})" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Z"/>
        <path fill="#fff" d="M12 8.2A3.8 3.8 0 1 1 8.2 12 3.81 3.81 0 0 1 12 8.2Zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2ZM17.6 6.4a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9Z"/>
      </svg>`
    }
  };

  function iconFor(key) {
    const base = ICONS[key];
    if (!base) {
      return {
        color: "#0a78c6",
        bg: "rgba(10,120,198,.10)",
        svg: `<svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.6-3.6a3 3 0 1 1 4.2 4.2l-2 2a1 1 0 0 1-1.4-1.4l2-2a1 1 0 0 0-1.4-1.4l-3.6 3.6a1 1 0 0 1-1.4 0Zm2.8-2.8a1 1 0 0 1 0 1.4l-3.6 3.6a3 3 0 1 1-4.2-4.2l2-2a1 1 0 1 1 1.4 1.4l-2 2a1 1 0 0 0 1.4 1.4l3.6-3.6a1 1 0 0 1 1.4 0Z"/>
        </svg>`
      };
    }
    return base;
  }

  // ====== Profile / Banner ======
  const p = cfg.profile || {};

  const avatar = document.getElementById("avatar");
  if (avatar) avatar.src = p.avatarUrl || "";

  const line1 = document.querySelector(".banner-title .line1");
  const line2 = document.querySelector(".banner-title .line2");

  if (line1) line1.textContent = p.bannerLine1 || "Prof: Robinson";
  if (line2) line2.textContent = p.bannerLine2 || "Informática";

  // Footer text (se existir no teu HTML)
  const footerText = document.getElementById("footerText");
  if (footerText && p.footerText) footerText.textContent = p.footerText;

  // ====== Sections ======
  const sectionsWrap = document.getElementById("sections");
  if (!sectionsWrap) return;
  sectionsWrap.innerHTML = "";

  (cfg.sections || []).forEach((sec) => {
    const block = document.createElement("section");
    block.className = "block card";

    const h2 = document.createElement("h2");
    h2.textContent = sec.title || "Links";
    block.appendChild(h2);

    const links = document.createElement("div");
    links.className = "links";

    (sec.links || []).forEach((l) => {
      if (!l.url) return;

      const a = document.createElement("a");
      a.className = "link";
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";

      const left = document.createElement("div");
      left.className = "link-left";

      const ico = document.createElement("div");
      ico.className = "ico";

      const ic = iconFor(l.iconKey);
      ico.style.background = ic.bg || "";
      ico.style.color = ic.color || "#0a78c6";

      if (ic.gradient) {
        const gid = "iggrad_" + Math.random().toString(16).slice(2);
        ico.innerHTML = ic.svg(gid);
      } else {
        ico.innerHTML = ic.svg;
        // garante currentColor
        ico.querySelectorAll("path").forEach((path) => {
          if (!path.getAttribute("fill")) path.setAttribute("fill", "currentColor");
        });
      }

      const texts = document.createElement("div");
      texts.className = "texts";

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = l.title || "Link";

      const sub = document.createElement("div");
      sub.className = "subtitle";
      sub.textContent = l.subtitle || "";

      texts.appendChild(title);
      if (l.subtitle) texts.appendChild(sub);

      left.appendChild(ico);
      left.appendChild(texts);

      a.appendChild(left);

      if (l.tag) {
        const tag = document.createElement("span");
        tag.className = "pill";
        tag.textContent = l.tag;
        a.appendChild(tag);
      }

      links.appendChild(a);
    });

    block.appendChild(links);
    sectionsWrap.appendChild(block);
  });
})();
