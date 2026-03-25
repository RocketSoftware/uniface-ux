/* global chai, describe, it, beforeEach, afterEach */

/**
 * Unit tests for the Layout web component — direction-aware alignment methods.
 *
 * Scope: individual method behaviour, not end-to-end computed styles.
 * Each describe block targets one private method by exercising it through its
 * public trigger (setAttribute / connectedCallback) and asserting the resulting
 * classes on the element or its in-scope light-DOM descendants.
 *
 *   #setLayoutClass         → tested via layout-type attribute changes
 *   #syncAlignmentClasses   → tested via layout-type / h-align / v-align attributes
 *   #syncDescendants        → tested via parent attribute changes propagating to children
 *
 * Light-DOM nesting is used throughout so that closest() and querySelectorAll()
 * traverse the tree correctly — matching the production code's assumptions.
 */

(function () {
  "use strict";

  const expect = chai.expect;

  const ALL_LT = ["u-layout-type-hs", "u-layout-type-hw", "u-layout-type-vs", "u-layout-type-vw"];

  /** Creates a connected uf-layout element and appends it to document.body. */
  function mkLayout() {
    const el = document.createElement("uf-layout");
    document.body.appendChild(el);
    return el;
  }

  /** Removes one or more elements from the DOM. */
  function cleanup(...els) {
    els.forEach((el) => el?.remove());
  }

  /** Returns every u-jc-* and u-ai-* class currently on el. */
  function alignClasses(el) {
    return [...el.classList].filter((c) => c.startsWith("u-jc-") || c.startsWith("u-ai-"));
  }

  // ===========================================================================
  // #setLayoutClass
  // Called by connectedCallback and on every layout-type attribute change.
  // Responsibility: keep exactly one u-layout-type-* class that matches the current value.
  // ===========================================================================
  describe("Layout#setLayoutClass", function () {
    let layout;

    beforeEach(function () {
      layout = mkLayout();
    });

    afterEach(function () {
      cleanup(layout);
    });

    it("adds u-layout-type-hs for 'horizontal-scroll'", function () {
      layout.setAttribute("layout-type", "horizontal-scroll");
      expect(layout.classList.contains("u-layout-type-hs")).to.be.true;
    });

    it("adds u-layout-type-hw for 'horizontal-wrap'", function () {
      layout.setAttribute("layout-type", "horizontal-wrap");
      expect(layout.classList.contains("u-layout-type-hw")).to.be.true;
    });

    it("adds u-layout-type-vs for 'vertical-scroll'", function () {
      layout.setAttribute("layout-type", "vertical-scroll");
      expect(layout.classList.contains("u-layout-type-vs")).to.be.true;
    });

    it("adds u-layout-type-vw for 'vertical-wrap'", function () {
      layout.setAttribute("layout-type", "vertical-wrap");
      expect(layout.classList.contains("u-layout-type-vw")).to.be.true;
    });

    it("adds exactly one u-layout-type-* class for a valid layout-type", function () {
      layout.setAttribute("layout-type", "horizontal-scroll");
      const count = ALL_LT.filter((c) => layout.classList.contains(c)).length;
      expect(count).to.equal(1);
    });

    it("adds no u-layout-type-* class for 'auto'", function () {
      layout.setAttribute("layout-type", "auto");
      ALL_LT.forEach((c) => expect(layout.classList.contains(c)).to.be.false);
    });

    it("adds no u-layout-type-* class for an unknown value", function () {
      layout.setAttribute("layout-type", "diagonal-scroll");
      ALL_LT.forEach((c) => expect(layout.classList.contains(c)).to.be.false);
    });

    it("has no u-layout-type-* class before any layout-type is set", function () {
      ALL_LT.forEach((c) => expect(layout.classList.contains(c)).to.be.false);
    });

    it("removes the previous u-lt-* class when layout-type changes", function () {
      layout.setAttribute("layout-type", "horizontal-scroll");
      expect(layout.classList.contains("u-layout-type-hs")).to.be.true;

      layout.setAttribute("layout-type", "vertical-wrap");
      expect(layout.classList.contains("u-layout-type-hs")).to.be.false;
      expect(layout.classList.contains("u-layout-type-vw")).to.be.true;
    });

    it("removes u-layout-type-* class when layout-type attribute is removed", function () {
      layout.setAttribute("layout-type", "vertical-scroll");
      expect(layout.classList.contains("u-layout-type-vs")).to.be.true;

      layout.removeAttribute("layout-type");
      expect(layout.classList.contains("u-layout-type-vs")).to.be.false;
    });

    it("cycles through all four valid values without leaving stale classes", function () {
      const seq = ["horizontal-scroll", "vertical-scroll", "horizontal-wrap", "vertical-wrap"];
      const cls = ["u-layout-type-hs", "u-layout-type-vs", "u-layout-type-hw", "u-layout-type-vw"];
      seq.forEach((val, i) => {
        layout.setAttribute("layout-type", val);
        // Current class present.
        expect(layout.classList.contains(cls[i])).to.be.true;
        // No other lt-class present.
        cls.filter((_, j) => j !== i).forEach((c) => expect(layout.classList.contains(c)).to.be.false);
      });
    });
  });

  // ===========================================================================
  // #syncAlignmentClasses
  // Called after every layout-type / horizontal-align / vertical-align change
  // and on connectedCallback. Responsibility: add exactly the right u-jc-* and
  // u-ai-* classes by resolving direction and alignment from the DOM tree.
  // ===========================================================================
  describe("Layout#syncAlignmentClasses", function () {
    let layout;

    beforeEach(function () {
      layout = mkLayout();
    });

    afterEach(function () {
      cleanup(layout);
    });

    // ── Fully-auto early-return ──────────────────────────────────────────────
    describe("Fully-auto: no direction and no explicit alignment", function () {
      it("produces no u-jc-* or u-ai-* classes with no attributes set", function () {
        expect(alignClasses(layout)).to.be.empty;
      });

      it("produces no u-jc-* or u-ai-* classes when layout-type='auto' and both aligns are 'auto'", function () {
        layout.setAttribute("layout-type", "auto");
        layout.setAttribute("horizontal-align", "auto");
        layout.setAttribute("vertical-align", "auto");
        expect(alignClasses(layout)).to.be.empty;
      });

      it("produces no u-jc-* or u-ai-* classes when only layout-type is set (no explicit aligns)", function () {
        layout.setAttribute("layout-type", "horizontal-scroll");
        expect(alignClasses(layout)).to.be.empty;
      });
    });

    // ── Own horizontal direction ─────────────────────────────────────────────
    describe("Own horizontal direction: h-align → main axis (u-jc-*), v-align → cross axis (u-ai-*)", function () {
      beforeEach(function () {
        layout.setAttribute("layout-type", "horizontal-scroll");
      });

      it("maps h-align='start' to u-jc-start", function () {
        layout.setAttribute("horizontal-align", "start");
        expect(layout.classList.contains("u-jc-start")).to.be.true;
      });

      it("maps h-align='center' to u-jc-center", function () {
        layout.setAttribute("horizontal-align", "center");
        expect(layout.classList.contains("u-jc-center")).to.be.true;
      });

      it("maps h-align='end' to u-jc-end", function () {
        layout.setAttribute("horizontal-align", "end");
        expect(layout.classList.contains("u-jc-end")).to.be.true;
      });

      it("maps h-align='stretch' to u-jc-stretch", function () {
        layout.setAttribute("horizontal-align", "stretch");
        expect(layout.classList.contains("u-jc-stretch")).to.be.true;
      });

      it("maps h-align='space-between' to u-jc-space-between", function () {
        layout.setAttribute("horizontal-align", "space-between");
        expect(layout.classList.contains("u-jc-space-between")).to.be.true;
      });

      it("maps h-align='space-around' to u-jc-space-around", function () {
        layout.setAttribute("horizontal-align", "space-around");
        expect(layout.classList.contains("u-jc-space-around")).to.be.true;
      });

      it("maps h-align='space-evenly' to u-jc-space-evenly", function () {
        layout.setAttribute("horizontal-align", "space-evenly");
        expect(layout.classList.contains("u-jc-space-evenly")).to.be.true;
      });

      it("maps v-align='start' to u-ai-start (cross axis)", function () {
        layout.setAttribute("vertical-align", "start");
        expect(layout.classList.contains("u-ai-start")).to.be.true;
      });

      it("maps v-align='center' to u-ai-center (cross axis)", function () {
        layout.setAttribute("vertical-align", "center");
        expect(layout.classList.contains("u-ai-center")).to.be.true;
      });

      it("maps v-align='end' to u-ai-end (cross axis)", function () {
        layout.setAttribute("vertical-align", "end");
        expect(layout.classList.contains("u-ai-end")).to.be.true;
      });

      it("maps v-align='stretch' to u-ai-stretch (cross axis)", function () {
        layout.setAttribute("vertical-align", "stretch");
        expect(layout.classList.contains("u-ai-stretch")).to.be.true;
      });

      it("falls back to u-ai-start for v-align='space-between' on the cross axis", function () {
        layout.setAttribute("vertical-align", "space-between");
        expect(layout.classList.contains("u-ai-start")).to.be.true;
      });

      it("falls back to u-ai-start for v-align='space-around' on the cross axis", function () {
        layout.setAttribute("vertical-align", "space-around");
        expect(layout.classList.contains("u-ai-start")).to.be.true;
      });

      it("falls back to u-ai-start for v-align='space-evenly' on the cross axis", function () {
        layout.setAttribute("vertical-align", "space-evenly");
        expect(layout.classList.contains("u-ai-start")).to.be.true;
      });

      it("sets both u-jc-* and u-ai-* when both align attributes are present", function () {
        layout.setAttribute("horizontal-align", "center");
        layout.setAttribute("vertical-align", "end");
        expect(layout.classList.contains("u-jc-center")).to.be.true;
        expect(layout.classList.contains("u-ai-end")).to.be.true;
      });

      it("keeps exactly one u-jc-* class after h-align is changed", function () {
        layout.setAttribute("horizontal-align", "start");
        layout.setAttribute("horizontal-align", "end");
        const jcClasses = [...layout.classList].filter((c) => c.startsWith("u-jc-"));
        expect(jcClasses).to.have.lengthOf(1);
        expect(jcClasses[0]).to.equal("u-jc-end");
      });

      it("removes u-jc-* class when h-align is updated to 'auto'", function () {
        layout.setAttribute("horizontal-align", "center");
        expect(layout.classList.contains("u-jc-center")).to.be.true;
        layout.setAttribute("horizontal-align", "auto");
        expect(layout.classList.contains("u-jc-center")).to.be.false;
      });
    });

    // ── Own vertical direction ───────────────────────────────────────────────
    describe("Own vertical direction: v-align → main axis (u-jc-*), h-align → cross axis (u-ai-*)", function () {
      beforeEach(function () {
        layout.setAttribute("layout-type", "vertical-scroll");
      });

      it("maps v-align='start' to u-jc-start (main axis)", function () {
        layout.setAttribute("vertical-align", "start");
        expect(layout.classList.contains("u-jc-start")).to.be.true;
      });

      it("maps v-align='center' to u-jc-center (main axis)", function () {
        layout.setAttribute("vertical-align", "center");
        expect(layout.classList.contains("u-jc-center")).to.be.true;
      });

      it("maps v-align='end' to u-jc-end (main axis)", function () {
        layout.setAttribute("vertical-align", "end");
        expect(layout.classList.contains("u-jc-end")).to.be.true;
      });

      it("maps v-align='space-between' to u-jc-space-between (space-* is valid on the main axis)", function () {
        layout.setAttribute("vertical-align", "space-between");
        expect(layout.classList.contains("u-jc-space-between")).to.be.true;
      });

      it("maps h-align='center' to u-ai-center (cross axis)", function () {
        layout.setAttribute("horizontal-align", "center");
        expect(layout.classList.contains("u-ai-center")).to.be.true;
      });

      it("maps h-align='end' to u-ai-end (cross axis)", function () {
        layout.setAttribute("horizontal-align", "end");
        expect(layout.classList.contains("u-ai-end")).to.be.true;
      });

      it("falls back to u-ai-start for h-align='space-between' on the cross axis", function () {
        layout.setAttribute("horizontal-align", "space-between");
        expect(layout.classList.contains("u-ai-start")).to.be.true;
      });

      it("sets both u-jc-* and u-ai-* when both align attributes are present", function () {
        layout.setAttribute("vertical-align", "end");
        layout.setAttribute("horizontal-align", "stretch");
        expect(layout.classList.contains("u-jc-end")).to.be.true;
        expect(layout.classList.contains("u-ai-stretch")).to.be.true;
      });

      it("horizontal-wrap direction also uses the vertical mapping (v-align → main)", function () {
        layout.setAttribute("layout-type", "vertical-wrap");
        layout.setAttribute("vertical-align", "center");
        expect(layout.classList.contains("u-jc-center")).to.be.true;
      });
    });

    // ── Direction inherited from ancestor ────────────────────────────────────
    describe("Inherited direction: closest() resolves direction from nearest ancestor", function () {
      let parent;

      beforeEach(function () {
        parent = mkLayout();
        parent.setAttribute("layout-type", "horizontal-scroll");
        parent.appendChild(layout);
      });

      afterEach(function () {
        cleanup(parent);
      });

      it("uses parent's horizontal direction when child has no layout-type", function () {
        // Horizontal context: h-align → main axis.
        layout.setAttribute("vertical-align", "start"); // force resolution (not fully auto)
        layout.setAttribute("horizontal-align", "center");
        expect(layout.classList.contains("u-jc-center")).to.be.true;
        expect(layout.classList.contains("u-ai-start")).to.be.true;
      });

      it("own layout-type overrides parent direction for axis mapping", function () {
        layout.setAttribute("layout-type", "vertical-scroll");
        layout.setAttribute("horizontal-align", "end");
        // Own vertical direction: h-align → cross axis → u-ai-end.
        expect(layout.classList.contains("u-ai-end")).to.be.true;
        expect(layout.classList.contains("u-jc-end")).to.be.false;
      });

      it("inherits h-align value from nearest non-auto ancestor via closest()", function () {
        parent.setAttribute("horizontal-align", "start");
        layout.setAttribute("vertical-align", "stretch"); // forces resolution
        // Horizontal context; nearest h-align = parent "start" → u-jc-start.
        expect(layout.classList.contains("u-jc-start")).to.be.true;
      });

      it("own h-align shadows the ancestor's h-align in the closest() walk", function () {
        parent.setAttribute("horizontal-align", "start");
        layout.setAttribute("vertical-align", "stretch");
        layout.setAttribute("horizontal-align", "end"); // closer → shadows parent
        // u-jc-end, not u-jc-start.
        expect(layout.classList.contains("u-jc-end")).to.be.true;
        expect(layout.classList.contains("u-jc-start")).to.be.false;
      });

      it("resolves each axis independently: each finds its nearest non-auto ancestor", function () {
        parent.setAttribute("horizontal-align", "center");
        parent.setAttribute("vertical-align", "start");
        // layout overrides v-align only; h-align falls through to parent.
        layout.setAttribute("vertical-align", "stretch");
        // Horizontal context:
        //   main (h-align): parent's "center" → u-jc-center.
        //   cross (v-align): layout's "stretch" is closer than parent's "start" → u-ai-stretch.
        expect(layout.classList.contains("u-jc-center")).to.be.true;
        expect(layout.classList.contains("u-ai-stretch")).to.be.true;
      });

      it("treats h-align='auto' as absent; closest() continues up to ancestor", function () {
        parent.setAttribute("horizontal-align", "end");
        layout.setAttribute("layout-type", "auto"); // no direction class
        layout.setAttribute("horizontal-align", "auto"); // auto = not a value
        layout.setAttribute("vertical-align", "start"); // force resolution
        // auto h-align is skipped; closest() finds parent's "end" → u-jc-end.
        expect(layout.classList.contains("u-jc-end")).to.be.true;
      });
    });
  });

  // ===========================================================================
  // #syncDescendants
  // Called after every layout-type / horizontal-align / vertical-align change on
  // a parent. Responsibility: walk light-DOM descendants and call
  // #syncAlignmentClasses on those whose classes depend on the changed attribute,
  // stopping at elements that form a boundary for that attribute.
  // ===========================================================================
  describe("Layout#syncDescendants", function () {
    let parent, child;

    beforeEach(function () {
      parent = mkLayout();
      child  = mkLayout();
      parent.setAttribute("layout-type", "horizontal-scroll");
      parent.appendChild(child);
    });

    afterEach(function () {
      cleanup(parent);
    });

    // ── horizontal-align propagation ─────────────────────────────────────────
    describe("Test horizontal-align propagation", function () {
      it("re-syncs a child that has its own direction but no own h-align", function () {
        child.setAttribute("layout-type", "vertical-scroll");
        parent.setAttribute("horizontal-align", "center");
        // Vertical context on child: h-align = cross axis → u-ai-center.
        expect(child.classList.contains("u-ai-center")).to.be.true;
      });

      it("re-syncs a child that has explicit v-align but no own h-align", function () {
        child.setAttribute("vertical-align", "stretch");
        parent.setAttribute("horizontal-align", "end");
        // Horizontal context (from parent): h-align = main axis → u-jc-end.
        expect(child.classList.contains("u-jc-end")).to.be.true;
      });

      it("does not re-sync a child that has its own explicit h-align (child is a boundary)", function () {
        child.setAttribute("layout-type", "vertical-scroll");
        child.setAttribute("horizontal-align", "center"); // child shadows parent
        parent.setAttribute("horizontal-align", "end");
        // Child's own h-align "center" on the cross axis → u-ai-center must remain.
        expect(child.classList.contains("u-ai-center")).to.be.true;
        expect(child.classList.contains("u-ai-end")).to.be.false;
      });

      it("does not treat h-align='auto' as an explicit value; child with auto h-align IS re-synced", function () {
        child.setAttribute("layout-type", "vertical-scroll");
        child.setAttribute("horizontal-align", "auto"); // auto ≠ explicit
        parent.setAttribute("horizontal-align", "start");
        // auto is skipped; parent's "start" is inherited → cross axis on child → u-ai-start.
        expect(child.classList.contains("u-ai-start")).to.be.true;
      });

      it("stops at a child-boundary and does not re-sync the grandchild behind it", function () {
        const grandchild = mkLayout();
        child.appendChild(grandchild);
        child.setAttribute("horizontal-align", "end");   // child is the boundary
        grandchild.setAttribute("layout-type", "horizontal-scroll");

        parent.setAttribute("horizontal-align", "center");
        // grandchild is behind the boundary; parent's h-align change must not reach it.
        // grandchild resolves h-align from child's "end" (its own closest non-auto) → u-jc-end.
        expect(grandchild.classList.contains("u-jc-end")).to.be.true;
        expect(grandchild.classList.contains("u-jc-center")).to.be.false;
      });

      it("re-syncs grandchild when the intermediate child has no own h-align", function () {
        const grandchild = mkLayout();
        child.appendChild(grandchild);
        child.setAttribute("vertical-align", "stretch"); // child qualifies but is not a boundary
        grandchild.setAttribute("layout-type", "horizontal-scroll");

        parent.setAttribute("horizontal-align", "start");
        // No h-align boundary between grandchild and parent; grandchild is re-synced.
        // Horizontal context (own): h-align from parent "start" → main axis → u-jc-start.
        expect(grandchild.classList.contains("u-jc-start")).to.be.true;
      });
    });

    // ── vertical-align propagation ───────────────────────────────────────────
    describe("Test vertical-align propagation", function () {
      it("re-syncs a child that has its own direction but no own v-align", function () {
        child.setAttribute("layout-type", "vertical-scroll");
        parent.setAttribute("vertical-align", "start");
        // Vertical context on child: v-align = main axis → u-jc-start.
        expect(child.classList.contains("u-jc-start")).to.be.true;
      });

      it("re-syncs a child that has explicit h-align but no own v-align", function () {
        child.setAttribute("horizontal-align", "end");
        parent.setAttribute("vertical-align", "stretch");
        // Horizontal context (from parent): v-align = cross axis → u-ai-stretch.
        expect(child.classList.contains("u-ai-stretch")).to.be.true;
      });

      it("does not re-sync a child that has its own explicit v-align (child is a boundary)", function () {
        child.setAttribute("layout-type", "horizontal-scroll");
        child.setAttribute("vertical-align", "start"); // child shadows parent
        parent.setAttribute("vertical-align", "center");
        // Child's own v-align "start" on the cross axis (horizontal context) → u-ai-start must remain.
        expect(child.classList.contains("u-ai-start")).to.be.true;
        expect(child.classList.contains("u-ai-center")).to.be.false;
      });

      it("stops at a child-boundary and does not re-sync the grandchild behind it", function () {
        const grandchild = mkLayout();
        child.appendChild(grandchild);
        child.setAttribute("vertical-align", "start");   // child is the v-align boundary
        grandchild.setAttribute("layout-type", "vertical-scroll");

        parent.setAttribute("vertical-align", "center");
        // grandchild inherits v-align from child "start" (its nearest non-auto), not parent "center".
        // Vertical context (own): v-align = main axis → u-jc-start.
        expect(grandchild.classList.contains("u-jc-start")).to.be.true;
        expect(grandchild.classList.contains("u-jc-center")).to.be.false;
      });
    });

    // ── layout-type propagation ──────────────────────────────────────────────
    describe("Test layout-type propagation", function () {
      it("re-syncs a child with explicit aligns but no own direction when parent direction changes", function () {
        child.setAttribute("horizontal-align", "center"); // no own direction
        // Parent direction: horizontal-scroll → vertical-scroll.
        parent.setAttribute("layout-type", "vertical-scroll");
        // Child re-synced: new vertical context, h-align = cross axis → u-ai-center.
        expect(child.classList.contains("u-ai-center")).to.be.true;
        expect(child.classList.contains("u-jc-center")).to.be.false;
      });

      it("does not re-sync a child that has its own direction (child is a direction boundary)", function () {
        child.setAttribute("layout-type", "vertical-scroll");
        child.setAttribute("horizontal-align", "end");
        // Vertical context on child before parent changes: h-align = cross → u-ai-end.
        expect(child.classList.contains("u-ai-end")).to.be.true;

        parent.setAttribute("layout-type", "vertical-wrap"); // parent direction changes
        // Child has own direction → is a boundary → not re-synced → class unchanged.
        expect(child.classList.contains("u-ai-end")).to.be.true;
      });

      it("does not re-sync a fully-auto child (no direction, no explicit aligns)", function () {
        // child has no attributes at all — it is fully auto.
        parent.setAttribute("layout-type", "vertical-scroll");
        // Fully-auto child never materialises alignment classes; CSS variable inheritance
        // propagates the parent's resolved values without any JS involvement.
        expect(alignClasses(child)).to.be.empty;
      });
    });
  });

})();
