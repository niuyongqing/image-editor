I will fix the bug where the ruler's selection controls disappear after clicking it to trigger a route jump.

The issue is caused by a race condition in `AdjustRuler.vue`: when the panel expands, it immediately checks for an active ruler. If the selection state hasn't fully propagated (or due to the `activeTab` toggle hack), it incorrectly assumes no ruler is selected and triggers `startDrawMode`, which clears the selection.

**Plan:**

1.  **Modify `src/components/modules/adjust/AdjustRuler.vue`**:
    *   Import `nextTick` from `vue`.
    *   Wrap the `activeObj` check inside `nextTick` within the `isExpanded` watcher. This ensures the check happens after the DOM update and Fabric state are settled.
    *   Keep the logic: if a ruler is selected, do nothing (preserve selection); otherwise, enter draw mode.

2.  **Update `.spec/active-context.md`**:
    *   Update **Current Focus** to include `[x] Fix Ruler Navigation`.
    *   Update **Last Updated** date.
    *   Add a record of this fix in the **Global Navigation System** section.
