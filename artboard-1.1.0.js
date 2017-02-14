/*!
  ArtboardJS v1.1.0
  (c) 2017 Depth Development. http://depthdev.com
  License: MIT
!*/

(function(window, document) {

  'use strict';

  window.Artboard = function() {

    const canvas = arguments[0];
    const options = typeof arguments[1] === 'object' ? arguments[1] : false;

    // Reject if not supported
    if (!canvas.getContext) {
      const errorCallback = arguments[arguments.length - 1];
      if (typeof errorCallback === 'function') {
        errorCallback();
      }
      return false;
    }

    // Setup the canvas
    let multiTouch = true;
    let rainbow = true;
    let canvasTopToPageTop = 0;
    let canvasLeftToPageLeft = 0;
    let x = [];
    let y = [];
    let radius = 10;
    const piSq = Math.PI * 2;
    let degree = 0;
    let done = null;

    // Setup the context
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 10;

    // Other
    let draw = null; // Placeholder since draw gets referenced before it would otherwise be defined
    let isMouseDown = false;

    // History
    const history = {
      timeline: [],
      createEntry() {
        history.timeline.push([]);
      },
      undoCount: 0,
      save() {
        window.localStorage.artboard = JSON.stringify({width:canvas.width,height:canvas.height,timeline:history.timeline});
      },
      saveAs(str, devCallback) {
        if (/^[a-zA-Z0-9_$]+$/.test(str)) {
          window.localStorage[`artboard_${str}`] = JSON.stringify({width:canvas.width,height:canvas.height,timeline:history.timeline});
          return devCallback ? devCallback(true) : true;  
        } else {
          return devCallback ? devCallback(false) : false;
        }
      },
      saved() {
        const a = [];
        for (const p in window.localStorage) {
          if (/^artboard_/.test(p)) {
            a.push(p.replace(/^artboard_/,''));
          }
        }
        return a;
      },
      backup() {
        return {width:canvas.width,height:canvas.height,timeline:history.timeline};
      },
      restore(data, devCallback) {
        if (data && !(data instanceof Event)) {
          // If type of is string, then developer/user is requesting it by name
          if (typeof data === 'string') {
            if (window.localStorage[`artboard_${data}`]) {
              const parsedData = JSON.parse(window.localStorage[`artboard_${data}`]);
              canvas.width = parsedData.width;
              canvas.height = parsedData.height;
              history.timeline = parsedData.timeline;
              history.undoCount = 0;
              history.change();
              return devCallback ? devCallback(true) : true;
            } else {
              return devCallback ? devCallback(false) : false;
            }
          }
          // Otherwise; it should be object literal passed in from the developer
          else {
            try {
              canvas.width = data.width;
              canvas.height = data.height;
              history.timeline = data.timeline;
              history.undoCount = 0;
              history.change();
              return devCallback ? devCallback(true) : true;
            } catch(e) {
              return devCallback ? devCallback(false) : false;
            }
          }
        }
        // If no name or object is passed in, see if the artboard is saved generically
        else if (window.localStorage.artboard) {
          const parsedData = JSON.parse(window.localStorage.artboard);
          canvas.width = parsedData.width;
          canvas.height = parsedData.height;
          history.timeline = parsedData.timeline;
          history.undoCount = 0;
          history.change();
          return devCallback ? devCallback(true) : true;
        }
        // Otherwise, return `false`
        else {
          return devCallback ? devCallback(false) : false;
        }
      },
      deleteSaved() {
        delete window.localStorage.artboard;
        for (const p in window.localStorage) {
          if (/^artboard_/.test(p)) {
            delete window.localStorage[p];
          }
        }
      },
      rewrite() {
        //If re-writing over history
        if (history.undoCount) {
          history.timeline.splice(history.timeline.length - 1 - history.undoCount, history.undoCount);
          history.undoCount = 0;
        }
      },
      log() {
        history.timeline[history.timeline.length - 1].push({
          multiTouch,
          rainbow,
          color: ctx.fillStyle,
          x,
          y,
          radius,
          degree,
          glow: ctx.shadowBlur
        });
      },
      settings() {
        return {
          multiTouch,
          rainbow,
          color: ctx.fillStyle,
          radius,
          degree,
          glow: ctx.shadowBlur
        }
      },
      change() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let i = 0;
        let ii = 0;
        const l = history.timeline.length - history.undoCount;
        let ll = history.timeline[i].length;
        for (;i<l;i++) {
          ii = 0;
          ll = history.timeline[i].length;
          for (;ii<ll;ii++) {
            multiTouch = history.timeline[i][ii].multiTouch;
            rainbow = history.timeline[i][ii].rainbow;
            ctx.fillStyle = history.timeline[i][ii].color;
            x = history.timeline[i][ii].x;
            y = history.timeline[i][ii].y;
            radius = history.timeline[i][ii].radius;
            degree = history.timeline[i][ii].degree;
            ctx.shadowBlur = history.timeline[i][ii].glow;
            ctx.shadowColor = ctx.fillStyle;
            draw(true);
          }
        }
        done();
      },
      undo() {
        if (history.undoCount !== history.timeline.length) {
          history.undoCount++;
          history.change();
        }
      },
      redo() {
        if (history.undoCount > 0) {
          history.undoCount--;
          history.change();
        }
      },
      stopPlaying: false,
      isPlaying: false,
      play() {
        if (!history.timeline.length) {
          return;
        }
        history.isPlaying = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let i = 0;
        let ii = 0;
        const l = history.timeline.length;
        let ll = history.timeline[i].length;
        function playing() {
          multiTouch = history.timeline[i][ii].multiTouch;
          rainbow = history.timeline[i][ii].rainbow;
          ctx.fillStyle = history.timeline[i][ii].color;
          x = history.timeline[i][ii].x;
          y = history.timeline[i][ii].y;
          radius = history.timeline[i][ii].radius;
          degree = history.timeline[i][ii].degree;
          ctx.shadowBlur = history.timeline[i][ii].glow;
          ctx.shadowColor = ctx.fillStyle;
          draw(true);
          ii++;
          if (history.stopPlaying) {
            history.stopPlaying = false;
            return;
          } else if (ii === ll) {
            if (i + 1 !== l) {
              i++;
              ii = 0;
              ll = history.timeline[i].length;
              window.requestAnimationFrame(playing);
            } else {
              history.stopPlaying = false;
              history.isPlaying = false;
              done();
            }
          } else {
            window.requestAnimationFrame(playing);
          }
        }
        playing();
      },
      stop() {
        history.stopPlaying = true;
        window.setTimeout(() => {
          history.isPlaying = false;
          history.stopPlaying = false;
          history.change();
          // done(); Don't need this because history.change(); contains the done() function
        }, 100);
      },
      size() {
        return JSON.stringify({width:canvas.width,height:canvas.height,timeline:history.timeline}).length;
      }
    };

    // Draw
    draw = (noLog) => {
      if (rainbow) {
        ctx.fillStyle = 'hsl(' + degree + ',100%,50%)';
        ctx.shadowColor = 'hsl(' + degree + ',100%,50%)';
        degree++;
      }
      let i = 0;
      const l = x.length;
      for (;i<l;i++) {
        ctx.beginPath();
        ctx.arc(x[i], y[i], radius, 0, piSq, false);
        ctx.fill();
        if (!multiTouch) {
          break;
        }
      }
      if (!noLog) {
        history.log();
      }
    };

    // Start
    function start(e) {
      e.preventDefault();
      e.stopPropagation();
      // Get canvas distance from page top and left
      canvasTopToPageTop = 0;
      canvasLeftToPageLeft = 0;
      let elem = canvas;
      while (elem) {
        canvasTopToPageTop += elem.offsetTop;
        canvasLeftToPageLeft += elem.offsetLeft;
        elem = elem.offsetParent;
      }
    }

    // Touches
    function touches(touchesArray) {
      x = [];
      y = [];
      let i = 0;
      const l = touchesArray.length;
      for (;i<l;i++) {
        x.push(touchesArray[i].pageX - canvasLeftToPageLeft);
        y.push(touchesArray[i].pageY - canvasTopToPageTop);
      }
    }

    // Touch Start
    function touchStart(e) {
      e.preventDefault();
      e.stopPropagation();
      if (history.isPlaying) { return; }
      start(e);
      touches(e.touches);
      history.createEntry();
      draw();
      history.rewrite();
    }

    // Touch Move
    function touchMove(e) {
      e.preventDefault();
      e.stopPropagation();
      if (history.isPlaying) { return; }
      touches(e.touches);
      draw();     
    }

    // Mouse Down
    function mouseDown(e) {
      e.preventDefault();
      e.stopPropagation();
      if (history.isPlaying) { return; }
      isMouseDown = true;
      start(e);
      x = [e.pageX - canvasLeftToPageLeft];
      y = [e.pageY - canvasTopToPageTop];
      history.createEntry();
      draw();
      history.rewrite();
    }

    // Mouse Move
    function mouseMove(e) {
      e.preventDefault();
      e.stopPropagation();
      if (history.isPlaying) { return; }
      if (!isMouseDown) { return; }
      x = [e.pageX - canvasLeftToPageLeft];
      y = [e.pageY - canvasTopToPageTop];
      draw();     
    }

    // Mouse Up
    function mouseUp(e) {
      if (!isMouseDown) { return; }
      isMouseDown = false;
      e.preventDefault();
      e.stopPropagation();
    }

    // Reset Hard
    function resetHard(devObj) {
      if (history.isPlaying) { return; }
      const o = devObj || {};
      canvas.width = o.width || document.documentElement.clientWidth;
      canvas.height = o.height || canvas.width * (9/16);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      multiTouch = o.multiTouch === false ? false : true;
      rainbow = o.rainbow === false ? false : true;
      ctx.fillStyle = o.color || '#000000';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = o.glow >= 0 ? o.glow : 10;
      degree = 0;
      radius = o.radius >= 0 ? o.radius : 10;
      done = o.done || function(){};
      history.timeline = [];
    }

    // Reset
    function reset(devObj) {
      if (history.isPlaying) {
        return;
      }
      // Get current settings
      const currentSettings = {
        multiTouch,
        rainbow,
        color: ctx.fillStyle,
        glow: ctx.shadowBlur,
        degree,
        radius,
        done
      };
      const o = devObj || {};
      canvas.width = o.width || canvas.width;
      canvas.height = o.height || canvas.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      history.timeline = [];
      // Replace wiped out settings
      multiTouch = currentSettings.multiTouch;
      rainbow = currentSettings.rainbow;
      ctx.fillStyle = currentSettings.color;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = currentSettings.glow;
      degree = currentSettings.degree;
      radius = currentSettings.radius;
      done = currentSettings.done;
    }

    // Clear
    function clear() {
      if (history.isPlaying) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      history.timeline = [];  
    }

    // Adjust
    function adjust(devObj) {
      if (history.isPlaying) {
        return;
      }
      const o = devObj || {};
      multiTouch = o.multiTouch !== undefined ? o.multiTouch : multiTouch;
      rainbow = o.rainbow !== undefined ? o.rainbow : rainbow;
      ctx.fillStyle = o.color || ctx.fillStyle;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = o.glow >= 0 ? o.glow : ctx.shadowBlur;
      radius = o.radius >= 0 ? o.radius : radius;
      done = o.done || done;
    }

    // Image
    function image(str) {
      this.a = document.createElement('a');
      this.a.href = canvas.toDataURL('image/png');
      this.a.download = str || 'ArtboardJS';
      this.a.click();
      delete this.a;
    }

    // Event listeners
    canvas.addEventListener('touchstart', touchStart);
    canvas.addEventListener('touchmove', touchMove);
    canvas.addEventListener('mousedown', mouseDown);
    canvas.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);

    // Destroy
    function destroy() {
      history.timeline = [];
      canvas.removeEventListener('touchstart', touchStart);
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('mousedown', mouseDown);
      canvas.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);       
    }

    // Init
    resetHard(options);

    // Return
    return {
      adjust, // Adjust effects only
      backup: history.backup, // Returns an object literal backup to the developer
      clear, // Clears out the canvas and history, but keeps all settings and the size
      deleteSaved: history.deleteSaved, // Deletes all saved artboards
      destroy, // Remove all listeners including window and document
      hardReset: resetHard, // Resets everything to the defaults unless and equivalent adjust object properties and/or reset object properties override them
      image, // Creates a PNG image of the canvas, renames it to an optional string provided, and downloads it
      play: history.play, // Clears the canvas and re-paints the users whole picture exactly as drawn with animation
      redo: history.redo, // Redo one or more moves and returns the current state
      reset, // Resets the canvas and can re-adjust the width/height
      restore: history.restore, // Restores a saved artboard if one exists in localStorage; returns a provided callback with the value `true` or just `true`, otherwise it returns a provided callback with the value of `false` or just `false`
      save: history.save, // Saves the current artboard to localStorage to be restored later with the restore method
      saveAs: history.saveAs, // Saves the current named artboard to localStorage to be restored later with the restore method
      saved: history.saved, // Returns an array of the user-defined named artboards
      settings: history.settings, // Returns an object with the current settings (most useful for the UI after an undo/redo)
      size: history.size, // Returns the size of the current artboard in bytes in it's saved format (which is somewhat larger than the JavaScript multi-dimensional array in memory)
      stop: history.stop, // Stops the current animation playback
      undo: history.undo // Undo one or more moves and returns the current state
    };

    /* 
      Adjustable properties:
      - width
      - height
      - multiTouch
      - rainbow
      - color
      - glow
      - radius
      - done
    */

  }

})(window,document);