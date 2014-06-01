/// <reference path="utils/AmMouse.ts"/>
/// <reference path="utils/AmKeyboard.ts"/>
/// <reference path="AmScene.ts"/>

class Ambient
{
	// static reference
    public static instance:Ambient;

    // public variables
    public name:string;
    public width:number;
    public height:number;
    public fps:number;
    public deltaTime:number;
    public camera:AmPoint = new AmPoint(0, 0);
    public clear:string = "#0e2129";
    public keepPixelScale:boolean = false;
    public snapCameraToPixels:boolean = false;
    public smoothing:boolean = false;
    public container:any;

    // the main canvas to draw to
    public canvas:any;
    public context:CanvasRenderingContext2D;

    // the visible canvas in the browser
    public canvasScaled:any;
    public contextScaled:any;

    // input references
    public mouse:AmMouse;
    public keyboard:AmKeyboard;

    // current game scale (when not full-screen)
    private _scale:number = 1;

    // current scene, and the next scene to go to
    private _scene:AmScene = null;
    private _goto:AmScene = null;

    // is fullscreen
    private _fullscreen:boolean = false;

    // time, used for deltaTime
    private _date:number;

    constructor(name:string, width:number, height:number, scale:number, fps:number)
    {
    	// set static references
        Ambient.instance = this;
        Am = this;

        // define self
        this.name = name;
        this.width = width;
        this.height = height;
        this.fps = fps;
        this.deltaTime = fps / 1000;
        this._scale = scale;
    }

    public Run()
    {
        window.onload = () =>
        {
            // bg
            document.head.title = this.name + " :: Ambient TS";
            document.body.style.backgroundColor = "#222";

            // create the container ... can ignore this later, maybe
            this.container = document.createElement("div");
            this.container.style.width = (this.width * this.scale) + "px";
            this.container.style.height = (this.height * this.scale) + "px";
            this.container.style.margin = "auto";
            this.container.style.marginTop = "80px";
            this.container.style.boxShadow = "0px 0px 128px #444";
            this.container.style.border = "1px solid #222";
            document.body.appendChild(this.container);

            // create the visible canvas
            this.canvasScaled = document.createElement("canvas");
            this.canvasScaled.width = this.width * this.scale;
            this.canvasScaled.height = this.height * this.scale;
            this.container.appendChild(this.canvasScaled);

            // create the invisible buffer canvas
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.width + 2;
            this.canvas.height = this.height + 2;
            this.canvas.style.display = "none";
            this.container.appendChild(this.canvas);

            // get context
            this.contextScaled = this.canvasScaled.getContext("2d");
            this.context = this.canvas.getContext("2d");

            // get input
            this.keyboard = new AmKeyboard(this.canvas);
            this.mouse = new AmMouse(this.canvasScaled);

            // disable right click on scaled visible canvas
            this.canvasScaled.oncontextmenu = (e) =>
            {
                e.preventDefault();
            }

            // start loop
            this._date = (new Date()).getTime();
            setInterval(() => this.Loop(), 1000 / this.fps);

            // on window resize
            window.onresize = () =>
            {
                if (this._fullscreen)
                {
                    this.canvasScaled.width = document.documentElement.clientWidth;
                    this.canvasScaled.height = document.documentElement.clientHeight;
                }
            }
        }
    }

    public get scene():AmScene
    {
        if (this._goto != null)
            return this._goto;
        return this._scene;
    }
    
    public set scene(value:AmScene)
    {
        this._goto = value;
    }

    public get scale():number
    {
        return this._scale;
    }

    public set scale(value:number)
    {
        this._scale = value;
        this.container.style.width = (this.width * this._scale) + "px";
        this.container.style.height = (this.height * this._scale) + "px";
        if (!this._fullscreen)
        {
            this.canvasScaled.width = this.width * this._scale;
            this.canvasScaled.height = this.height * this._scale;
        }
    }

    public ToggleFullscreen()
    {
        if  (this._fullscreen)
        {
            this.canvasScaled.style.position = "relative";
            this.canvasScaled.width = this.width * this.scale;
            this.canvasScaled.height = this.height * this.scale;
        }
        else
        {
            this.canvasScaled.style.position = "absolute";
            this.canvasScaled.style.left = "0px";
            this.canvasScaled.style.top = "0px";
            this.canvasScaled.width = document.documentElement.clientWidth;
            this.canvasScaled.height = document.documentElement.clientHeight;
        }

        this._fullscreen = !this._fullscreen;
    }

    public GetViewportScale():number
    {
        var scale = Math.min(this.canvasScaled.width / this.width, this.canvasScaled.height / this.height);
        if (this.keepPixelScale)
            scale = Math.floor(scale);
        return scale;
    }

    public GetViewportOffset():AmPoint
    {
        var scale:number = this.GetViewportScale();
        return new AmPoint((this.canvasScaled.width - this.width * scale) / 2, (this.canvasScaled.height - this.height * scale) / 2);
    }

    private Loop()
    {
        // get delta time
        var time:number = (new Date()).getTime();
        this.deltaTime = (time - this._date) / 1000;
        this._date = time;

        // update
        this.Update();
        this.Render();

        // switch scenes
        if (this._goto != null)
        {
            if (this._scene != null)
                this._scene.End();
            this._scene = this._goto;
            this._goto = null;
            this._scene.Start();
        }

        // clear input
        this.keyboard.Clear();
        this.mouse.Clear();
    }

    public Update()
    {
        if (this._scene != null)
        {
            this._scene.Update();
        }
    }

    public DisableSmoothing(context:any)
    {
        context.msImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
    }

    public Render()
    {
        // clear
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // background
        this.context.fillStyle = this.clear;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // set up camera translation
        Am.context.save();
        Am.context.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));

        // smooth main canvas
        if (!this.smoothing)
            Am.DisableSmoothing(this.context);

        // draw scene
        if (this._scene != null)
            this._scene.Render();

        // restore translations
        Am.context.restore();

        // scale up to output (scaled canvas)
        if (!this.smoothing)
            this.DisableSmoothing(this.contextScaled);

        this.contextScaled.clearRect(0, 0, this.canvasScaled.width, this.canvasScaled.height);

        // get the app scale and viewport offset
        var scale:number = this.GetViewportScale();
        var offset:AmPoint = this.GetViewportOffset();

        // if snap camera to pixels is false, let us move the camera at "subpixels" 
        // (ex say the app is scaled to 4, the camera can then offset 0, 0.25, 0.50, 0.75). creates smoother movement
        var shift:AmPoint = this.snapCameraToPixels ? new AmPoint(0, 0) : new AmPoint(Math.floor((this.camera.x % 1) * scale), Math.floor((this.camera.y % 1) * scale));
        
        // draw the app to the visible canvas
        this.contextScaled.drawImage(this.canvas, offset.x - shift.x, offset.y - shift.y, this.canvas.width * scale, this.canvas.height * scale);

        // draw outside the viewport
        this.contextScaled.fillStyle = "#000000";
        if (offset.x != 0)
        {
            this.contextScaled.fillRect(0, 0, offset.x, this.canvasScaled.height);
            this.contextScaled.fillRect(this.canvasScaled.width - offset.x, 0, offset.x, this.canvasScaled.height);
        }
        if (offset.y != 0)
        {
            this.contextScaled.fillRect(0, 0, this.canvasScaled.width, offset.y);
            this.contextScaled.fillRect(0, this.canvasScaled.height - offset.y, this.canvasScaled.width, offset.y);
        }
    }
}

// Global shortform reference to the Ambient app
var Am:Ambient;
