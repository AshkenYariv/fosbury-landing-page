/**
 * Which machine this is.
 *
 * One question, asked once, and the answer written onto the document as
 * `data-os`. Everything that wants it reads it from there rather than asking
 * again: `styles/home.css` shows the one install note that applies, this file
 * marks the build that matches, and `scripts/track.js` puts it on every event
 * so a download page finally has the one dimension it always needed.
 *
 * Only the three platforms there are builds for are ever written down. A phone,
 * a tablet, a Chromebook or anything unrecognised leaves the attribute off
 * entirely, and the page then does the honest thing on its own — no build is
 * singled out and all three notes are shown. **Unknown is a real answer here**,
 * and guessing at it would put "Download for Mac" in front of somebody holding
 * an Android phone.
 */
(() => {
'use strict';

/**
 * The name of this machine, or nothing.
 *
 * `userAgentData` is the question actually asked of the browser rather than
 * inferred from a string it only still sends for compatibility, so it goes
 * first. Where there is none — every Safari and Firefox at the time of writing
 * — the platform string and then the user agent, in that order, because
 * `navigator.platform` is short and unambiguous where it exists at all.
 */
function machine() {
  const said = navigator.userAgentData?.platform || navigator.platform || '';
  const agent = navigator.userAgent || '';
  const both = `${said} ${agent}`;

  /* A touch screen calling itself a Mac is an iPad: iPadOS has asked to be
     served desktop pages since 13, and there is no build here it could run.
     Two touch points rather than one — a Mac with a trackpad reports some. */
  if (/iPhone|iPad|iPod/i.test(both)) return null;
  if (/Mac/i.test(both) && navigator.maxTouchPoints > 2) return null;

  /* Android before Linux, and both before anything else: an Android user agent
     says "Linux" in it, and answering that with an AppImage helps nobody. */
  if (/Android/i.test(both)) return null;
  if (/CrOS/i.test(both)) return null;

  if (/Mac/i.test(both)) return 'macos';
  if (/Win/i.test(both)) return 'windows';
  if (/Linux|X11|BSD/i.test(both)) return 'linux';
  return null;
}

const os = machine();
if (os) document.documentElement.dataset.os = os;

/* The build for this machine, moved to the front of the three and said to be
   the one — see `.get[data-yours]` in home.css. Nothing is hidden: somebody
   downloading the Windows build from a Mac is doing it for a colleague, and a
   page that only offers what it detected cannot serve them. */
if (os) {
  const yours = document.querySelector(`.get[data-os="${os}"]`);
  if (yours) yours.setAttribute('data-yours', '');
}
})();
