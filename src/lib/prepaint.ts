// Inline scripts that run before first paint. Plain module (no "use client")
// so the root layout — a server component — can read the strings.

export const PREFS_STORAGE_KEY = "afosh:prefs"

/** Apply the stored slime skin to <html data-skin> before React hydrates. */
export const PREFS_PREPAINT = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(
  PREFS_STORAGE_KEY,
)})||"{}");if(p&&typeof p.skin==="string")document.documentElement.dataset.skin=p.skin;}catch(e){}})();`
