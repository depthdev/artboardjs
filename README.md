# ArtboardJS
<summary>Canvas artboard with mouse &#38; multi-touch support.</summary>

[Demo](http://codepen.io/depthdev/pen/XpxKPx)

<a href="http://codepen.io/depthdev/pen/XpxKPx" target="_blank"><img src="http://cdn.depthdev.com/artboard-1.0.0-screenshot.png"></a>

## Docs

### Init
const ab = new Artboard(*element [, options [, error]]*);

const	ab = new Artboard(**canvas**, {  
&#160;&#160;&#160;&#160;**width:** document.documentElement.clientWidth, *// int*  
&#160;&#160;&#160;&#160;**height:** document.documentElement.clientWidth * (9/16), *// int*  
&#160;&#160;&#160;&#160;**multiTouch:** true, *// boolean*  
&#160;&#160;&#160;&#160;**rainbow:** true, *// boolean*  
&#160;&#160;&#160;&#160;**color:** '#000000', *// string*  
&#160;&#160;&#160;&#160;**glow:** 10, *// number*  
&#160;&#160;&#160;&#160;**radius:** 10, *// number*  
&#160;&#160;&#160;&#160;**done:** doneCallbackFunc *// Called after playback finishes; or after restore, undo, redo, or stop is called*  
&#160;&#160;}, **errorCallbackFunc**  *// Called if the HTML5 canvas isn't supported on their browser*  
);
