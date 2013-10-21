Trunkoh
=======

About
-----
Trunkoh.js is an intelligent text truncation JavaScript Library created by the MDC UX Team. Trunkoh.js is a library based on pure JavaScript, Trunkoh.js maximizes the amount of text visible in a selected container, without wrapping or overflowing. When applied to a text container, trunkoh will calculate the dimensions of the container and based on 

Usage
-----

**Default Settings**
```js
trunkoh('.foo'); // Lorem ipsum dolor sit amet, consect…
```

By default, trunkoh will add an ellipsis (`&hellip;`) after the truncated text.

**Custom Settings**
```js
trunkoh('.foo',{
    fill: '[snip]',
    side: 'center'
}); // Lorem ipsum dol[snip]id est laborum.
```

You may change the settings at any time by passing an object to trunkoh. In the example above, the filler text is overwritten from an ellipsis to a custom string and the placement of the truncation is overwritten from the right side to the center. Continue reading the section below for a full list of customizable settings.

Settings
--------

* **fill** _(Default: '`&hellip;`')_ The string to insert in place of the omitted text. This value may include HTML.
* **lines** _(Default: `1`)_ The number of lines of text-wrap to tolerate before truncating. This value must be an integer greater than or equal to 1.
* **side** _(Default: `'right'`)_ The side of the text from which to truncate. Valid values include `'center'`, `'left'`, and `'right'`.
* **tooltip** _(Default: `true`)_ When true, the `title` attribute of the targeted HTML element will be set to the original, untruncated string. Valid values include `true` and `false`.

Public Methods
-------

**[Constructor]**
Initializes the settings and immediately truncates the targeted HTML element. This method is called when arguments are omitted and when the first argument is an object. When supplied with an object, trunk8 will merge the user-defined settings with the predefined settings object and immediately truncate the targeted HTML element with the custom settings.

```js
/* default settings */
trunkoh('.foo');

/* custom settings */
trunkoh('.foo',{
   lines: 2
});
```

The MIT License (MIT)
-------
Copyright (c) 2013 mdc-ux-team

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
