v1.7.3 - Tue, 14 Mar 2017 01:22:00 GMT
--------------------------------------

- [e1df119](../../commit/e1df119) [fixed] remove portal context in timeout (#353)


v1.7.2 - Thu, 09 Mar 2017 03:59:52 GMT
--------------------------------------

- 


v1.7.1 - Thu, 02 Mar 2017 14:49:30 GMT
--------------------------------------

- [a1d29c6](../../commit/a1d29c6) [fixed] rewrite removePortal as es5 function


v1.7.0 - Thu, 02 Mar 2017 03:54:08 GMT
--------------------------------------

- [ea4f37a](../../commit/ea4f37a) [fixed] respect closeTimeoutMS during unmount
- [4232477](../../commit/4232477) [fixed] Enable click to close in iOS (#301) (#304) (#313)


v1.6.5 - Sat, 31 Dec 2016 17:14:28 GMT
--------------------------------------

- [c50f19a](../../commit/c50f19a) [fixed] Add file extention to entry point (#294)
- [08bf920](../../commit/08bf920) [fixed] closeTimeoutMS doesn't work without onRequestClose (#278)


v1.6.4 - Thu, 15 Dec 2016 05:48:59 GMT
--------------------------------------

- [694cb87](../../commit/694cb87) [fixed] updated references from rackt to reactjs. (#244)
- [ad0b071](../../commit/ad0b071) Bumps lodash.assign dependency to version 4.2.0


v1.6.3 - Mon, 12 Dec 2016 14:03:43 GMT
--------------------------------------

- Removes some files that were inadvertently published in 1.6.2 reducing the npm install size.


v1.6.2 - Sun, 11 Dec 2016 17:32:03 GMT
--------------------------------------

- This version only added the `dist/` versions which were omitted from 1.5.2 -> 1.6.1


v1.6.1 - Tue, 06 Dec 2016 17:16:10 GMT
--------------------------------------

- [62d87e1](../../commit/62d87e1) [fixed] Remove arrow function from ES5 source


v1.6.0 - Tue, 06 Dec 2016 15:09:25 GMT
--------------------------------------

- [de14816](../../commit/de14816) [added] Ability for modal to be appended to arbitrary elements (#183)
- [3d8e5a0](../../commit/3d8e5a0) [added] Add contentLabel prop to put aria-label on modal content


v1.5.2 - Sat, 08 Oct 2016 14:29:09 GMT
--------------------------------------

- [d78428b](../../commit/d78428b) [fixed] Remove remaining reference to role dialog


v1.5.1 - Sat, 08 Oct 2016 04:11:39 GMT
--------------------------------------

- This version only added the `dist/` versions which were omitted from 1.4.0 -> 1.5.0


v1.5.0 - Sat, 08 Oct 2016 02:18:52 GMT
--------------------------------------

- [919daa3](../../commit/919daa3) [fixed] Remove the default aria role dialog
- [2e806c7](../../commit/2e806c7) [added] Make modal portal have the dialog role (#223)
- [5429f7c](../../commit/5429f7c) [fixed] Don't steal focus from a descendent when rendering (#222)
- [8e767e9](../../commit/8e767e9) [fixed] Add react-dom as a peer dependency
- [ff09b49](../../commit/ff09b49) [fixed] Close modal when mouseDown and MouseUp happen only on the overlay (#217)
- [6550b87](../../commit/6550b87) Revert "[fixed] Dont change body class if isOpen not change (#201)"
- [8e5f5b7](../../commit/8e5f5b7) [fixed] Fix incorrect details in the README
- [e5b0181](../../commit/e5b0181) [added] ability to change default 'ReactModalPortal' class (#208)
- [1e29e4f](../../commit/1e29e4f) [fixed] Dont change body class if isOpen not change (#201)
- [d347547](../../commit/d347547) [fixed] Updates webpack distribution config to reference the correct externals (#210)


v1.4.0 - Thu, 30 Jun 2016 19:12:02 GMT
--------------------------------------

- [13bd46e](../../commit/13bd46e) [fixed] clear the delayed close timer when modal opens again. (#189)
- [70d91eb](../../commit/70d91eb) [fixed] Add missing envify npm dependency. Closes #193 (#194)


v1.3.0 - Tue, 17 May 2016 16:04:50 GMT
--------------------------------------

- [9089a2d](../../commit/9089a2d) [fixed] Make the modal portal render into body again (#176)


v1.2.1 - Sat, 23 Apr 2016 19:09:46 GMT
--------------------------------------

- [aa66819](../../commit/aa66819) [fixed] Removes unneeded sanitizeProps function (#169)


v1.2.0 - Thu, 21 Apr 2016 22:02:02 GMT
--------------------------------------

- [a10683a](../../commit/a10683a) [fixed] Make the non-minified dist build present again (#164)
- [04db149](../../commit/04db149) [added] Propagate event on close request (#91)


v1.1.2 - Tue, 19 Apr 2016 02:36:05 GMT
--------------------------------------

- [4509133](../../commit/4509133) [fixed] moved sanitizeProps out of the render calls. (#162)


v1.1.1 - Fri, 15 Apr 2016 05:30:45 GMT
--------------------------------------
This release affects only the dist version of the library reducing size immensely.

- [9823bc5](../../commit/9823bc5) Use -p flag in webpack for minification and exclude externals react and react-dom
- [72c8498](../../commit/72c8498) Move to using webpack for building the library


v1.1.0 - Tue, 12 Apr 2016 13:03:08 GMT
--------------------------------------

- [6c03d17](../../commit/6c03d17) [added] trigger onAfterOpen callback when available. (#154)


v1.0.0 - Sat, 09 Apr 2016 05:03:25 GMT
--------------------------------------

- [4e2447a](../../commit/4e2447a) [changed] Updated to add support for React 15  (#152)
- [0d4e600](../../commit/0d4e600) [added] module for default style
- [cb53bca](../../commit/cb53bca) [fixed] Remove ReactModal__Body--open class when unmounting Modal
- [63bee72](../../commit/63bee72) [fixed] Custom classnames override default styles


v0.6.1 - Fri, 23 Oct 2015 18:03:54 GMT
--------------------------------------

- 


v0.6.0 - Wed, 21 Oct 2015 21:39:48 GMT
--------------------------------------

- 


v0.5.0 - Tue, 22 Sep 2015 19:19:44 GMT
--------------------------------------

- [4d25989](../../commit/4d25989) [added] Inline CSS for modal and overlay as well as props to override. [changed] injectCSS has been changed to a warning message in preparation for a future removal. lib/components/Modal.js [changed] setAppElement method is now optional. Defaults to document.body and now allows for a css selector to be passed in rather than the whole element.
- [02cf2c3](../../commit/02cf2c3) [fixed] Clear the closeWithTimeout timer before unmounting


v0.3.0 - Wed, 15 Jul 2015 06:17:24 GMT
--------------------------------------

- [adecf62](../../commit/adecf62) [added] Class name on body when modal is open


v0.2.0 - Sat, 09 May 2015 05:16:40 GMT
--------------------------------------

- [f5fe537](../../commit/f5fe537) [added] Ability to specify style for the modal contents


v0.1.1 - Tue, 31 Mar 2015 15:56:47 GMT
--------------------------------------

- [f86de0a](../../commit/f86de0a) [fixed] shift+tab closes #23


v0.1.0 - Thu, 26 Feb 2015 17:14:27 GMT
--------------------------------------

- [1b8e2d0](../../commit/1b8e2d0) [fixed] ModalPortal's componentWillReceiveProps
- [28dbc63](../../commit/28dbc63) [added] Supporting custom overlay className closes #14
- [6626dae](../../commit/6626dae) [fixed] erroneous alias in webpack build


v0.0.7 - Sat, 03 Jan 2015 06:44:47 GMT
--------------------------------------

- 


v0.0.6 - Wed, 03 Dec 2014 21:24:45 GMT
--------------------------------------

- [28dbc63](../../commit/28dbc63) [added] Supporting custom overlay className closes #14
- [6626dae](../../commit/6626dae) [fixed] erroneous alias in webpack build


v0.0.5 - Thu, 13 Nov 2014 18:55:47 GMT
--------------------------------------

- [b15aa82](../../commit/b15aa82) [added] Supporting custom className
- [b7a38de](../../commit/b7a38de) [fixed] Warning caused by trying to focus null element closes #11


v0.0.4 - Tue, 11 Nov 2014 16:08:14 GMT
--------------------------------------

- [e57bab5](../../commit/e57bab5) [fixed] Issue with focus being lost - closes #9


v0.0.3 - Fri, 31 Oct 2014 19:25:20 GMT
--------------------------------------

- 


v0.0.2 - Thu, 25 Sep 2014 02:36:47 GMT
--------------------------------------

- 


v0.0.1 - Wed, 24 Sep 2014 22:26:40 GMT
--------------------------------------

- 


v0.0.0 - Wed, 24 Sep 2014 22:25:00 GMT
--------------------------------------

- 


