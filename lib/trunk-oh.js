function trunkoh(selectorOrElem, options) {

    options = typeof options === 'undefined' ? {} : options;

    // ======================
    // Constants
    // ======================

    // Strings
    var AUTO = 'auto',
        CENTER = 'center',
        DIV = 'div',
        GT = '>',
        LEFT = 'left',
        LT = '<',
        NONE = 'none',
        RIGHT = 'right',
        STRING_EMPTY = '',
        STRING_SPACE = ' ',
        TITLE = 'title';

    var DEFAULTS = {
        fill: '&hellip;',
        lines: 1,
        parseHTML: false,
        side: RIGHT,
        showTooltip: true,
        width: AUTO
    };

    // ======================
    // Object Definition
    // ======================

    var trunkoh = this;
    if(isString(selectorOrElem)){
        var selectedElements = document.querySelectorAll(selectorOrElem);
        for(var i = 0; i < selectedElements.length; i++){
            trunkoh.element = selectedElements[i],
            trunkoh.originalText = trunkoh.element.innerHTML;
            // If not empty string
            if(trunkoh.originalText){
                trunkoh.settings = extend(DEFAULTS, options);
                truncate(trunkoh);
            }
        }


    }else{
        trunkoh.element =selectorOrElem,
        trunkoh.originalText = trunkoh.element.innerHTML,
        trunkoh.settings = extend(DEFAULTS, options);
        truncate(trunkoh);

    }



    // ======================
    // Functions
    // ======================

    function getLineHeight(elem) {
        var elemStyle = elem.style,
            cssFloat = elemStyle.cssFloat,
            body = document.getElementsByTagName('body')[0],
            position = elemStyle.position;

        if(cssFloat !== NONE) {
            elemStyle.cssFloat = NONE;
        }

        if(position === 'absolute') {
            elemStyle.position = 'static';
        }

        var elemClone = elem.cloneNode(true);

        // Set the content to a small single character and wrap
        elemClone.innerHTML = 'i';

        // Calculate the line height by measuring the wrapper
        var wrapper = wrap(elemClone, body),
            lineHeight = wrapper.clientHeight;
        body.removeChild(wrapper);

        return lineHeight;
    }

    function stripHTML(html) {
        var tmp = document.createElement(DIV);
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText;
    }

    function getHtmlArray(s) {
        // Build an array of strings and designated HTML tags around them
        if(stripHTML(s) === s) {
            return s.split(/\s/g);
        }

        var results = [],
            regex = /<([a-z]+)([^<]*)(?:>(.*?(?!<\1>)*)<\/\1>|\s+\/>)(['.?!,]*)|((?:[^<>\s])+['.?!,]*\w?|<br\s?\/?>)/ig,
            fields = regex.exec(s),
            lastIndex;
        while(fields && lastIndex !== regex.lastIndex) {
            lastIndex = regex.lastIndex;
            if(fields[5]) {
                results.push(fields[5]);
            } else if(fields[1]) {
                results.push({
                    tag: fields[1],
                    attribs: fields[2],
                    content: fields[3],
                    after: fields[4]
                });
            }
            fields = regex.exec(s);
        }

        for(var i = 0, resultsLength = results.length; i < resultsLength; i++) {
            var item = results[i],
                itemContent = item.content;
            if(!isString(item) && itemContent) {
                itemContent = getHtmlArray(itemContent);
            }
        }
        return results;
    }

    function rebuildHtmlFromBite(bite, htmlObject, fill) {
        // Take the processed bite after binary-search truncated and re-build the original HTML tags around the processed string.
        bite = bite.replace(fill, STRING_EMPTY);

        var biteHelper = function(contentArr, tagInfo) {
            var retStr = STRING_EMPTY,
                content,
                biteContent,
                biteLength;
            for(var i = 0,contentArrLength = contentArr.length; i < contentArrLength; i++) {
                content = contentArr[i],
                biteTrim = bite.trim(),
                biteLength = biteTrim.split(' ').length;
                if(biteTrim.length) {
                    if(isString(content)) {
                        if(!/<br\s*\/?>/.test(content)) {
                            if(biteLength === 1 && biteTrim.length <= content.length) {
                                content = bite;
                                // We want the fill to go inside of the last HTML element if the element is a container.
                                if(tagInfo === 'p' || tagInfo === DIV) {
                                    content += fill;
                                }
                                bite = STRING_EMPTY;
                            } else {
                                bite = bite.replace(content, STRING_EMPTY);
                            }
                        }
                        retStr += content.trim() + ((i === contentArr.length - 1 || biteLength <= 1) ? STRING_EMPTY : STRING_SPACE);
                    } else {
                        biteContent = biteHelper(content.content, content.tag);
                        if(content.after) bite = bite.replace(content.after, STRING_EMPTY);
                        if(biteContent) {
                            if(!content.after) content.after = STRING_SPACE;
                            retStr += [
                                LT,
                                content.tag,
                                content.attribs,
                                GT,
                                biteContent,
                                LT,
                                '/',
                                content.tag,
                                GT,
                                content.after
                            ].join(STRING_EMPTY);
                        }
                    }
                }
            }
            return retStr;
        },
            htmlResults = biteHelper(htmlObject);

        // Add fill if doesn't exist. This will place it outside the HTML elements.
        if(htmlResults.slice(htmlResults.length - fill.length) === fill) {
            htmlResults += fill;
        }

        return htmlResults;
    }

    function eatStr(str, side, biteSize, fill) {
        var length = str.length,
            halfLength,
            halfBiteSize;

        // Common error handling
        if(!isString(str) || length === 0) {
            console.error('Invalid source string:', str);
        }
        if((biteSize < 0) || (biteSize > length)) {
            console.error('Invalid bite size:', biteSize);
        } else if(biteSize === 0) {
            // No bite should show no truncation
            return str;
        }
        if(!isString(fill + STRING_EMPTY)) {
            console.error('Fill unable to be converted to a string');
        }
        // Compute the result, store it in the cache, and return it
        switch(side) {
            case RIGHT:
                // str...
                return trim(str.substr(0, length - biteSize)) + fill;
                break;
            case LEFT:
                // ...str
                return fill + trim(str.substr(biteSize));
                break;
            case CENTER:
                // Bit-shift to the right by one === Math.floor(x / 2)
                halfLength = length >> 1; // halve the length
                halfBiteSize = biteSize >> 1; // halve the biteSize

                // st...r
                return trim(eatStr(str.substr(0, length - halfLength), RIGHT, biteSize - halfBiteSize, STRING_EMPTY)) + fill + trim(eatStr(str.substr(length - halfLength), LEFT, halfBiteSize, STRING_EMPTY));
                break;
            default:
                console.error('Invalid side:', side);
                break;
        }
    }

    function truncate(truncate) {
        var data = truncate,
            settings = data.settings,
            width = settings.width,
            side = settings.side,
            fill = settings.fill,
            parseHTML = settings.parseHTML,
            element = data.element,
            lineHeight = getLineHeight(element) * settings.lines,
            str = data.originalText,
            html = str,
            escapedText = element.textContent,
            length = str.length,
            maxBite = STRING_EMPTY,
            lower, upper,
            biteSize,
            bite,
            htmlObject;

        // If string has HTML and parse HTML is set, build the data struct to house the tags
        if(parseHTML && stripHTML(str) !== str) {
            htmlObject = getHtmlArray(str);
            str = stripHTML(str);
            length = str.length;
        }

        if(width === AUTO) {
            // Assuming there is no "overflow: hidden"
            if(element.offsetHeight <= lineHeight) {
                // Text is already at the optimal trunkage
                return;

            }

            // Binary search technique for finding the optimal trunkage. Find the maximum bite without overflowing
            lower = 0;
            upper = length - 1;

            while(lower <= upper) {
                biteSize = lower + ((upper - lower) >> 1);
                bite = eatStr(str, side, length - biteSize, fill);
                if(parseHTML && htmlObject) {
                    bite = rebuildHtmlFromBite(bite, htmlObject, fill);
                }
                element.innerHTML = bite;

                // Check for overflow
                if(element.offsetHeight > lineHeight) {
                    upper = biteSize - 1;
                } else {
                    lower = biteSize + 1;
                    // Save the bigger bite
                    maxBite = (maxBite.length > bite.length) ? maxBite : bite;
                }
            }

            // Reset the content to eliminate possible existing scroll bars
            element.innerHTML = STRING_EMPTY;

            // Display the biggest bite
            element.innerHTML = maxBite;

            if(settings.showTooltip) {
                element.setAttribute(TITLE, escapedText);
            }
        } else if(!isNaN(width)) {
            biteSize = length - width;

            bite = eatStr(str, side, biteSize, fill);

            this.html(bite);

            if(settings.showTooltip) {
                element.setAttribute(TITLE, escapedText);
            }
        } else {
            console.error('Invalid width:', width);
        }
    }

    // ======================
    // UTILS
    // ======================

    // http://www.htmlgoodies.com/html5/javascript/extending-javascript-objects-in-the-classical-inheritance-style.html#fbid=BA5suAvQH6F
    function extend(destination, source) {
        for(var p in source) {
            destination[p] = source[p];
        }
        return destination;
    }

    function isString(o) {
        return (typeof o === 'string');
    }

    // http://stackoverflow.com/questions/498970/how-do-i-trim-a-string-in-javascript
    function trim(s) {
        return s.replace(/^\s+|\s+$/g, STRING_EMPTY);
    }

    function wrap(elem, body) {
        var div = document.createElement(DIV);
        div.appendChild(elem);
        body.appendChild(div);
        return div;
    }

    // ======================
    // Function Invocation
    // ======================

}