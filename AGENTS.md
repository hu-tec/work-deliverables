# Workspace rules

## Accessibility size lock

- `01_화면_디자인/디자인시스템/accessibility_check.html` is the approved accessibility reference page.
- Never change its rendered typography, control sizes, target sizes, spacing, line heights, or layout dimensions.
- Never change `01_화면_디자인/디자인시스템/layout.css` rules in a way that alters the effective rendered sizes of `.a11y-*` elements.
- This size lock is permanent and applies even when a later request broadly asks to shrink, densify, restyle, or normalize every design-system page.
- Other design-system documentation may be made denser, but accessibility examples must retain their current recommended sizes exactly.
