/* Site behaviour: theme toggle, active nav, scroll reveals, current year. */

(function () {
  "use strict";

  /* --- Theme ------------------------------------------------------------- */
  // The inline script in <head> sets data-theme before paint to avoid a flash.
  var toggle = document.querySelector(".theme-toggle");

  function currentTheme() {
    var stored = document.documentElement.getAttribute("data-theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* private mode — fine, just don't persist */
      }
      toggle.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    });
  }

  /* --- Active nav link --------------------------------------------------- */
  // Direct children only — the wrapped .lang-switch links point at same-named
  // files in the other language and must not be matched here.
  var here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav > a[href]").forEach(function (link) {
    var target = link.getAttribute("href").split("/").pop();
    if (target === here) link.setAttribute("aria-current", "page");
  });

  /* --- Mobile menu ------------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (navToggle && nav) {
    var setMenu = function (open) {
      navToggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };

    navToggle.addEventListener("click", function () {
      setMenu(navToggle.getAttribute("aria-expanded") !== "true");
    });

    // Following a link should close the panel behind you.
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });

    // Widening past the breakpoint reveals the links anyway — drop the state
    // so the button doesn't come back reading "expanded".
    var wide = window.matchMedia("(min-width: 761px)");
    var onWide = function (e) {
      if (e.matches) setMenu(false);
    };
    if (wide.addEventListener) wide.addEventListener("change", onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* --- Reveal on scroll -------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* --- Footer year ------------------------------------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
