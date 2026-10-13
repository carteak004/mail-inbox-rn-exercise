# Mobile notes

Keep this to roughly one page. Short, specific answers beat long general ones.

## Platform and setup
- Platform used (iOS / Android) and simulator/emulator model + OS version:
- Anything you had to do to get the starter running that is worth knowing:

## Dependencies added
One line per package: `package` — what it is used for — why this one over the alternatives.

-
-

## Key decisions
- List component and how you keep scrolling smooth (item layout, memoisation, window/batch settings, …):
- Gesture / swipe approach, including how the drag is kept off the JS thread and how "only one open row" is enforced:
- State / caching approach for pages, read flags and optimistic actions with revert:
- How the read state stays consistent between the inbox row and the message screen:
- How you restore the scroll offset when returning from a message:

## Platform-specific notes
- How your left-edge swipe coexists with the system back gesture (Android) or the navigation edge-swipe (iOS):
- Anything else that would differ on the other platform:

## Trade-offs, assumptions and what you would do with more time
-

## AI usage
- Tools used:
- Roughly which parts were AI-generated:
- At least two suggestions you changed or rejected, and why:
