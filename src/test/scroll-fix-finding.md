# Technical Finding: Lenis & ScrollTrigger Modal Conflict

## Issue
When using Lenis (smooth-scroll) with GSAP `ScrollTrigger` horizontal pinning, opening a fixed-position modal with vertical overflow results in a "static grid." The background `ScrollTrigger` continues to intercept scroll events, preventing the modal from scrolling despite the scrollbar moving.

## Solution
1. **Body Lock**: Use `document.body.style.overflow = "hidden"` AND `document.body.style.position = "fixed"`.
2. **Prevent Lenis**: Apply the `data-lenis-prevent` attribute to the scrollable container inside the modal.
3. **Disable Triggers**: Call `ScrollTrigger.getAll().forEach(t => t.disable())` when the modal is active and `t.enable()` + `ScrollTrigger.refresh()` on close.

## Implementation (Next.js)
```tsx
useEffect(() => {
  if (isModalOpen) {
    ScrollTrigger.getAll().forEach(t => t.disable());
    document.documentElement.classList.add("lenis-stopped");
  } else {
    ScrollTrigger.getAll().forEach(t => t.enable());
    ScrollTrigger.refresh();
    document.documentElement.classList.remove("lenis-stopped");
  }
}, [isModalOpen]);
```
