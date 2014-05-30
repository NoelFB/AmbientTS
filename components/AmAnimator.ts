/// <reference path="../Ambient.ts"/>
/// <reference path="AmGraphic.ts"/>
/// <reference path="../utils/AmRectangle.ts"/>
/// <reference path="../utils/AmDictionary.ts"/>

class AmAnimation
{
    public name:string;
    public frames:Array<number>
    public speed:number;
    public loop:boolean;
    public index:number = 0;

    public constructor(name:string, frames:Array<number>, speed:number, loop:boolean)
    {
        this.name = name;
        this.frames = frames;
        this.speed = speed;
        this.loop = loop;
    }
}

class AmAnimator extends AmGraphic
{
    public animations:AmDictionary<AmAnimation> = { };
    public frame:number = 0;
    public frameWidth:number;
    public frameHeight:number;

    private _current:AmAnimation = null;
    private _stopped:boolean = true;

    constructor(texture:HTMLImageElement, frameWidth:number, frameHeight:number)
    {
        super(texture, new AmRectangle(0, 0, frameWidth, frameHeight));
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
    }

    public Add(name:string, frames:Array<number>, speed:number)
    {
        this.animations[name] = new AmAnimation(name, frames, speed, true);
    }

    public Play(name:string, restart:boolean)
    {
        this._stopped = false;
        this._current = this.animations[name];

        if (restart)
            this._current.index = 0;
    }

    public Current():string
    {
        return this._current.name;
    }

    public Stop()
    {
        this._stopped = true;
    }

    public Playing():boolean
    {
        return !this._stopped;
    }

    public Stopped():boolean
    {
        return this._stopped;
    }

    public Update()
    {
        super.Update();

        if (!this._stopped)
        {
            this._current.index += this._current.speed * Am.deltaTime;
            while (this._current.index > this._current.frames.length)
                this._current.index -= this._current.frames.length;
            this.frame = this._current.frames[Math.floor(this._current.index)];
        }
    }

    public Render()
    {
        var columns = Math.floor(this.texture.width / this.frameWidth);
        var column = Math.floor(this.frame % columns);
        var row = Math.floor(this.frame / columns);
        this.bounds = new AmRectangle(column * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight);

        super.Render();
    }

}