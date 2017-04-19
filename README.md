# whenTransitionEnd

The most accuracy jQuery plugin to detect `transitionEnd` event.
Plugin takes first jQuery object from collection and check if there's some information about transition.
Then, it analazy it and set listener to call callback function when `transitionEnd` event occure. There's also setTimeout fallback to ensure callback will trigger for sure.

---

## Syntax

`$(el).whenTransitionEnd(func[, options])`

### Parameters

- `func` - A function to be executed when transition ends
- `options` [*Optional*] - An object with additional parameters.
   - `timeout` [*default: true*] - Determine if setTimeout fallback should be set.
 When value is Integer plugin sets setTimeouts' timer on this value.
   - `timeoutDelay` [*default: 100*] - Additional time to wait before setTimeout fallback (in milliseconds).
   - `endOnFirst` [*default: false*] - If *true* plugin will call callback function when first transition occure.

### Return value

`jQuery collection`

---

## Examples

### #1

```
$(el).whenTransitionEnd(function(){
	console.log('done');
}).addClass('on');
```
&nbsp;
```
$(el).css({
	opacity: 0
}).whenTransitionEnd(function(){
	console.log('done');
});
```

Order of methods in queue doesn't matter. Of course, transition property must be set in CSS. Otherwise callback will trigger immediately.

### #2

```
$(el).whenTransitionEnd(function(ev){
	console.log(ev.type);
}).addClass('on');
```

`ev.type` may be:

 - `"transitionend"` - browsers' event name
 - `"timeout"` - occure when event doesn't emit when it should
 (means the longest `transition-duration + transition-delay + timeoutDelay` passed)
 - `"empty"` - when browser doesn't support transition

### #3
```
$(el).whenTransitionEnd(function(){
	console.log('done');
}, {
	timeout: 300,
	endOnFirst: true
}).addClass('on');
```

---

## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
