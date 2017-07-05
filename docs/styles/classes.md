### CSS Classes

Sometimes it may be preferable to use CSS classes rather than inline styles.

You can use the `className` and `overlayClassName` props to specify a given CSS
class for each of those.

You can override the default class that is added to `document.body` when the
modal is open by defining a property `bodyOpenClassName`.

It's required that `bodyOpenClassName` must be `constant string`, otherwise we
would end up with a complex system to manage which class name should appear or
be removed from `document.body` from which modal (if using multiple modals
simultaneously).

`bodyOpenClassName` can support adding multiple classes to `document.body` when
the modal is open. Add as many class names as you desire, delineated by spaces.

Note: If you provide those props all default styles will not be applied, leaving
all styles under control of the CSS class.

The `portalClassName` can also be used however there are no styles by default applied
