(() => {
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  const top = document.querySelector(".top");
  const year = document.getElementById("year");
  const nextService = document.getElementById("nextService");

  if (year) year.textContent = String(new Date().getFullYear());

  if (menuBtn && menu) {
    const setOpen = (open) => {
      menu.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    menuBtn.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  if (top) {
    const onScroll = () => top.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (nextService) {
    const schedule = [
      { day: 6, hour: 18, label: "Great Vespers · Saturday 6:00 PM" },
      { day: 0, hour: 10, label: "Divine Liturgy · Sunday 10:00 AM" },
    ];

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Indiana/Indianapolis",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());

    const map = Object.fromEntries(parts.filter((p) => p.type !== "literal").map((p) => [p.type, p.value]));
    const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const weekday = weekdayMap[map.weekday];
    const nowMin = Number(map.hour) * 60 + Number(map.minute);

    let best = null;
    for (let offset = 0; offset < 8; offset += 1) {
      for (const item of schedule) {
        if ((weekday + offset) % 7 !== item.day) continue;
        if (offset === 0 && item.hour * 60 <= nowMin) continue;
        const score = offset * 1440 + item.hour * 60;
        if (!best || score < best.score) best = { score, offset, day: item.day, label: item.label };
      }
    }

    if (!best) {
      nextService.textContent = "Next: Divine Liturgy · Sundays 10:00 AM";
      return;
    }

    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const when = best.offset === 0 ? "Today" : best.offset === 1 ? "Tomorrow" : names[best.day];
    nextService.textContent = `Next · ${when}: ${best.label}`;
  }
})();
