/// <reference path="utils/AmMouse.ts"/>
/// <reference path="utils/AmKeyboard.ts"/>
/// <reference path="AmScene.ts"/>

class Ambient
{
    public static instance:Ambient;

    public name:string;
    public width:number;
    public height:number;
    public scale:number = 1;
    public fps:number;
    public deltaTime:number;
    public camera:AmPoint = new AmPoint(0, 0);
    public clear:string = "#0e2129";

    public canvas:any;
    public context:CanvasRenderingContext2D;

    public canvasScaled:any;
    public contextScaled:any;

    public mouse:AmMouse;
    public keyboard:AmKeyboard;

    private _scene:AmScene = null;
    private _goto:AmScene = null;
    private _date:number;

    constructor(name:string, width:number, height:number, scale:number, fps:number)
    {
        Ambient.instance = this;
        Am = this;

        this.name = name;
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.fps = fps;
        this.deltaTime = fps / 1000;
    }

    public Initialize()
    {
        window.onload = () =>
        {
            // bg
            document.head.title = this.name + " :: Ambient TS";
            document.body.style.backgroundColor = "#222";

            // create the scene
            var container = document.createElement("div");
            document.body.appendChild(container);
            container.style.width = (this.width * this.scale) + "px";
            container.style.height = (this.height * this.scale) + "px";
            container.style.margin = "auto";
            container.style.marginTop = "80px";
            container.style.boxShadow = "0px 0px 128px #444";
            container.style.border = "1px solid #222";

            // create the visible canvas
            this.canvasScaled = document.createElement("canvas");
            this.canvasScaled.width = this.width * this.scale;
            this.canvasScaled.height = this.height * this.scale;
            container.appendChild(this.canvasScaled);

            // create the invisible buffer canvas
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.display = "none";
            container.appendChild(this.canvas);

            // get context
            this.contextScaled = this.canvasScaled.getContext("2d");
            this.context = this.canvas.getContext("2d");

            // get input
            this.keyboard = new AmKeyboard(this.canvas);
            this.mouse = new AmMouse(this.canvas);

            // start loop
            this._date = (new Date()).getTime();
            setInterval(() => this.Loop(), 1000 / this.fps);
        }
    }

    public SetScene(scene:AmScene):AmScene
    {
        this._goto = scene;
        return scene;
    }

    public GetScene():AmScene
    {
        if (this._goto != null)
            return this._goto;
        return this._scene;
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

    public Render()
    {
        // clear
        this.context.clearRect(0, 0, this.width, this.height);

        // background
        this.context.fillStyle = this.clear;
        this.context.fillRect(0, 0, this.width, this.height);

        // set up camera translation
        Am.context.save();
        Am.context.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

        // draw scene
        if (this._scene != null)
            this._scene.Render();

        // restore translations
        Am.context.restore();

        // scale up to output (scaled canvas)
        this.contextScaled.msImageSmoothingEnabled = false;
        this.contextScaled.webkitImageSmoothingEnabled = false;
        this.contextScaled.mozImageSmoothingEnabled = false;
        this.contextScaled.clearRect(0, 0, this.width * this.scale, this.height * this.scale);
        this.contextScaled.drawImage(this.canvas, 0, 0, this.width * this.scale, this.height * this.scale);
    }
}

var Am:Ambient;
