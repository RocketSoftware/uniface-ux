/* global chai, describe, it, before, after, beforeEach, afterEach, sinon, umockup */

// No direct imports from "@fluentui/web-components" — bare-specifier imports
// fail in CI where node_modules is not served.  Instead, tests verify
// application.js behavior through the CSS custom property that the FAST
// design token sets on document.documentElement when setValueFor / deleteValueFor
// is called by the bundle's application.js.

(function () {
  "use strict";

  const expect = chai.expect;
  const asyncRun = umockup.asyncRun;
  const DARK_LUMINANCE = 0.15;
  const CSS_LUMINANCE = "--base-layer-luminance";

  /**
   * Reads the current --base-layer-luminance CSS custom property from document.documentElement.
   * Returns the string value (e.g. "0.15") or "" when the property is not set.
   */
  function getLuminance() {
    return document.documentElement.style.getPropertyValue(CSS_LUMINANCE);
  }

  // Sets html data-u-color-mode and waits for the MutationObserver callback to fully deliver.
  // The second asyncRun guarantees the observer (which fires between animation frames)
  // has executed before this function returns.
  async function setMode(mode) {
    await asyncRun(function () {
      document.documentElement.dataset.uColorMode = mode;
    });
    await asyncRun(function () {});
  }

  // Removes html data-u-color-mode and flushes pending observer delivery.
  async function removeMode() {
    await asyncRun(function () {
      delete document.documentElement.dataset.uColorMode;
    });
    await asyncRun(function () {});
  }

  describe("Application", function () {

    let listener;

    before(function () {
      listener = sinon.fake();
      document.documentElement.addEventListener("color-mode-change", listener);
    });

    after(function () {
      document.documentElement.removeEventListener("color-mode-change", listener);
    });

    beforeEach(async function () {
      await removeMode();
      listener.resetHistory();
    });

    afterEach(async function () {
      await removeMode();
      sinon.restore();
    });

    it("should set dark luminance and dispatch dark event", async function () {
      await setMode("light");
      listener.resetHistory();

      await setMode("dark");

      expect(getLuminance(), "Dark mode should set --base-layer-luminance to 0.15.").to.equal(String(DARK_LUMINANCE));
      expect(listener.called, "Dark transition should dispatch color-mode-change event.").to.equal(true);
      expect(listener.lastCall.args[0].detail.resolvedMode, "Resolved mode should be dark.").to.equal("dark");
    });

    it("should set dark luminance for uppercase 'DARK'", async function () {
      await setMode("light");
      listener.resetHistory();

      await setMode("DARK");

      expect(getLuminance(), "Uppercase DARK should set dark luminance.").to.equal(String(DARK_LUMINANCE));
      expect(listener.called, "Uppercase DARK should dispatch color-mode-change event.").to.equal(true);
      expect(listener.lastCall.args[0].detail.resolvedMode, "Resolved mode should be dark.").to.equal("dark");
    });

    it("should clear luminance and dispatch light event", async function () {
      await setMode("dark");
      listener.resetHistory();

      await setMode("light");

      expect(getLuminance(), "Light mode should remove --base-layer-luminance.").to.equal("");
      expect(listener.called, "Light transition should dispatch color-mode-change event.").to.equal(true);
      expect(listener.lastCall.args[0].detail.resolvedMode, "Resolved mode should be light.").to.equal("light");
    });

    it("should clear luminance for mixed-case 'Light'", async function () {
      await setMode("dark");
      listener.resetHistory();

      await setMode("Light");

      expect(getLuminance(), "Mixed-case Light should clear luminance.").to.equal("");
      expect(listener.called, "Mixed-case Light should dispatch color-mode-change event.").to.equal(true);
      expect(listener.lastCall.args[0].detail.resolvedMode, "Resolved mode should be light.").to.equal("light");
    });

    it("should not re-apply or dispatch when mode is unchanged", async function () {
      await setMode("light");
      await setMode("dark");
      listener.resetHistory();

      await setMode("dark");

      expect(getLuminance(), "Duplicate dark mode should not change luminance.").to.equal(String(DARK_LUMINANCE));
      expect(listener.called, "Same resolved mode should not dispatch color-mode-change event.").to.equal(false);
    });

    it("should not re-apply or dispatch for case-only change", async function () {
      await setMode("dark");
      listener.resetHistory();

      await setMode("DARK");

      expect(getLuminance(), "Case-only change should not alter luminance.").to.equal(String(DARK_LUMINANCE));
      expect(listener.called, "Case-only change should not dispatch event.").to.equal(false);
    });

    it("should fall back to light for invalid mode", async function () {
      await setMode("dark");
      listener.resetHistory();

      await setMode("Invalid-value");

      expect(getLuminance(), "Invalid mode should fall back to light and clear luminance.").to.equal("");
      expect(listener.called, "Invalid mode fallback should dispatch color-mode-change event.").to.equal(true);
      expect(listener.lastCall.args[0].detail.resolvedMode, "Resolved mode should be light for invalid value.").to.equal("light");
    });

    it("should fall back to light for empty data-u-color-mode value", async function () {
      await setMode("dark");
      listener.resetHistory();

      await setMode("");

      expect(getLuminance(), "Empty mode should fall back to light and clear luminance.").to.equal("");
      expect(listener.called, "Empty mode fallback should dispatch color-mode-change event.").to.equal(true);
      expect(listener.lastCall.args[0].detail.resolvedMode, "Resolved mode should be light for empty value.").to.equal("light");
    });

    it("should fall back to light for repeated invalid values", async function () {
      await setMode("dark");
      listener.resetHistory();

      await setMode("nope");
      const firstCallCount = listener.callCount;
      await setMode("nope");

      expect(getLuminance(), "Repeated invalid value should keep light mode.").to.equal("");
      expect(firstCallCount, "First invalid value should dispatch event.").to.equal(1);
      expect(listener.callCount, "Second identical invalid value should not dispatch (no mode change).").to.equal(1);
    });

    it("should handle valid case variants correctly", async function () {
      await setMode("Dark");
      expect(getLuminance(), "Mixed-case Dark should set dark luminance.").to.equal(String(DARK_LUMINANCE));

      await setMode("LIGHT");
      expect(getLuminance(), "Uppercase LIGHT should clear luminance.").to.equal("");

      await setMode("Auto");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        expect(getLuminance(), "Mixed-case Auto should resolve to system preference.").to.equal(String(DARK_LUMINANCE));
      } else {
        expect(getLuminance(), "Mixed-case Auto should resolve to system preference.").to.equal("");
      }
    });

    it("should fall back to light when attribute is removed", async function () {
      await setMode("dark");
      listener.resetHistory();

      await removeMode();

      expect(getLuminance(), "Removing attribute should clear luminance.").to.equal("");
      expect(listener.called, "Removing attribute should dispatch light event.").to.equal(true);
      expect(listener.lastCall.args[0].detail.resolvedMode, "Resolved mode should be light after removal.").to.equal("light");
    });

    describe("Auto mode", function () {

      it("should resolve based on system preference and dispatch event", async function () {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          await setMode("light");
        } else {
          await setMode("dark");
        }
        listener.resetHistory();

        await setMode("auto");

        if (prefersDark) {
          expect(getLuminance(), "Auto mode on dark system should set dark luminance.").to.equal(String(DARK_LUMINANCE));
        } else {
          expect(getLuminance(), "Auto mode on light system should clear luminance.").to.equal("");
        }
        expect(listener.called, "Auto transition should dispatch color-mode-change event.").to.equal(true);
        expect(listener.lastCall.args[0].detail.resolvedMode, "Auto mode should resolve to system preference.").to.equal(prefersDark ? "dark" : "light");
      });

      it("should stop reacting to system changes after switching to dark", async function () {
        await setMode("auto");
        await setMode("dark");
        listener.resetHistory();

        window.matchMedia("(prefers-color-scheme: dark)").dispatchEvent(new window.Event("change"));
        await asyncRun(function () {});

        expect(listener.called, "System color change should not dispatch event after switching to dark.").to.equal(false);
      });

      it("should stop reacting to system changes after switching to light", async function () {
        await setMode("auto");
        await setMode("light");
        listener.resetHistory();

        window.matchMedia("(prefers-color-scheme: dark)").dispatchEvent(new window.Event("change"));
        await asyncRun(function () {});

        expect(listener.called, "System color change should not dispatch event after switching to light.").to.equal(false);
      });

      it("should stop reacting to system changes after attribute removal", async function () {
        await setMode("auto");
        await removeMode();
        listener.resetHistory();

        window.matchMedia("(prefers-color-scheme: dark)").dispatchEvent(new window.Event("change"));
        await asyncRun(function () {});

        expect(listener.called, "System color change should not dispatch event after attribute removal.").to.equal(false);
      });

      it("should resolve uppercase 'AUTO' based on system preference", async function () {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          await setMode("light");
        } else {
          await setMode("dark");
        }
        listener.resetHistory();

        await setMode("AUTO");

        if (prefersDark) {
          expect(getLuminance(), "Uppercase AUTO on dark system should set dark luminance.").to.equal(String(DARK_LUMINANCE));
        } else {
          expect(getLuminance(), "Uppercase AUTO on light system should clear luminance.").to.equal("");
        }
        expect(listener.called, "Uppercase AUTO should dispatch color-mode-change event.").to.equal(true);
        expect(listener.lastCall.args[0].detail.resolvedMode, "Uppercase AUTO should resolve to system preference.").to.equal(prefersDark ? "dark" : "light");
      });

    });

  });
})();
