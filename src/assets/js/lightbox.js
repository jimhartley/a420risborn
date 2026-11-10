// Photo viewer for .gallery: opens a clicked thumbnail full screen, with
// previous/next, close, keyboard (← → Esc) and swipe on phones.
// Without JavaScript the thumbnails still link straight to the full-size image.
(() => {
  const galleries = document.querySelectorAll(".gallery");
  if (!galleries.length) return;

  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.innerHTML = `
    <button class="lb-close" aria-label="Close">✕</button>
    <button class="lb-prev" aria-label="Previous photo">‹</button>
    <figure><img alt=""><figcaption></figcaption></figure>
    <button class="lb-next" aria-label="Next photo">›</button>
    <div class="lb-count"></div>`;
  document.body.append(dlg);

  const img = dlg.querySelector("img");
  const cap = dlg.querySelector("figcaption");
  const count = dlg.querySelector(".lb-count");
  let items = [];
  let index = 0;

  function show(i) {
    index = (i + items.length) % items.length;
    const a = items[index];
    const thumb = a.querySelector("img");
    img.src = a.href;
    img.alt = thumb ? thumb.alt : "";
    cap.textContent = a.closest("figure")?.querySelector("figcaption")?.textContent || "";
    count.textContent = `${index + 1} / ${items.length}`;
  }

  galleries.forEach((g) => {
    const links = [...g.querySelectorAll("figure > a")];
    links.forEach((a, i) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        items = links;
        show(i);
        dlg.showModal();
      })
    );
  });

  const close = () => dlg.close();
  dlg.querySelector(".lb-close").addEventListener("click", close);
  dlg.querySelector(".lb-prev").addEventListener("click", () => show(index - 1));
  dlg.querySelector(".lb-next").addEventListener("click", () => show(index + 1));
  // Click on the dark background (not the photo or buttons) closes it.
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.tagName === "FIGURE") close(); });
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  dlg.addEventListener("close", () => img.removeAttribute("src"));

  let startX = null;
  dlg.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
