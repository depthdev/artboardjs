# ArtboardJS
<summary>Canvas artboard with mouse &#38; multi-touch support.</summary>

[Demo](http://codepen.io/depthdev/pen/XpxKPx)

<a href="http://codepen.io/depthdev/pen/XpxKPx" target="_blank"><img src="http://cdn.depthdev.com/artboard-1.0.0-screenshot.png"></a>

## Docs

### Init
`const ab = new Artboard(element [, options [, error]]);`  

OR  

<sub>const	ab = new Artboard(**canvas**, {  
&#160;&#160;&#160;&#160;**width:** document.documentElement.clientWidth, *// int*  
&#160;&#160;&#160;&#160;**height:** document.documentElement.clientWidth * (9/16), *// int*  
&#160;&#160;&#160;&#160;**multiTouch:** true, *// boolean*  
&#160;&#160;&#160;&#160;**rainbow:** true, *// boolean*  
&#160;&#160;&#160;&#160;**color:** '#000000', *// string*  
&#160;&#160;&#160;&#160;**glow:** 10, *// number*  
&#160;&#160;&#160;&#160;**radius:** 10, *// number*  
&#160;&#160;&#160;&#160;**done:** doneCallbackFunc *// Called after playback finishes; or after restore, undo, redo, or stop is called*  
&#160;&#160;}, **errorCallbackFunc**  *// Called if the HTML5 canvas isn't supported on their browser*  
);</sub>

### Returned Object Methods
`adjust` Accepts and object with one or more of the following properties: *width*, *height*, *multiTouch*, *rainbow*, *color*, *glow*, *radius*, and *done*  

`backup` Returns an object literal backup to the developer  

`clear` Clears out the canvas and history, but keeps all settings and the size  

`deleteSaved` Deletes all saved artboards  

`destroy` Remove all listeners including window and document  

`hardReset` Resets everything to the defaults unless and equivalent adjust object properties and/or reset object properties override them  

`image` Creates a PNG image of the canvas, renames it to an optional string provided, and downloads it  

`play` Clears the canvas and re-paints the users whole picture exactly as drawn with animation  

`redo` Redoes a move (use the settings method to get the adjusted settings)  

`reset` Resets the canvas and can re-adjust the width/height  

`restore` Restores a saved artboard if one exists in localStorage; returns a provided callback with the value *true* or just *true*, otherwise it returns a provided callback with the value of *false* or just *false*  

`save` Saves the current artboard to localStorage to be restored later with the restore method  

`saveAs` Saves the current named artboard to localStorage to be restored later with the restore method  

`saved` Returns an array of the user-defined named artboards  

`settings` Returns an object with the current settings (most useful for the UI after an undo/redo)

`size` Returns the size of the current artboard in bytes in it's saved format (which is somewhat larger than the JavaScript multi-dimensional array in memory)  

`stop` Stops the current animation playback  

`undo` Undoes a move (use the settings method to get the adjusted settings)  

See the [demo](http://codepen.io/depthdev/pen/XpxKPx) for example API usage.

### Styles
Recommend this setting to trigger the scrollbar before calculation unless your content is always shorter than the browser viewport: `body{min-height:101vh;}`

---

MIT License  
Copyright (c) 2017 Depth Development
