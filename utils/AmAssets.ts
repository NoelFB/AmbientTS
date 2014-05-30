class AmAssetInfo
{
    public name:string;
    public file:string;

    constructor(name:string, file:string)
    {
        this.name = name;
        this.file = file;
    }
}

interface AmAssetCallback
{
    (a: AmAssets): any;
}

class AmAssets
{
    public textures:{ [name:string]:HTMLImageElement; } = { };
    public sounds:{ [name:string]:HTMLAudioElement; } = { };
    public percent:number;

    private _textures:Array<AmAssetInfo> = new Array<AmAssetInfo>();
    private _sounds:Array<AmAssetInfo> = new Array<AmAssetInfo>();

    private _steps:number = 0;
    private _required:number = 0;
    private _onUpdate:AmAssetCallback;
    private _onComplete:AmAssetCallback;

    public AddTexture(name:string, file:string)
    {
        this._textures.push(new AmAssetInfo(name, file));
        this._required ++;
    }

    public AddSound(name:string, file:string)
    {
        this._sounds.push(new AmAssetInfo(name, file));
        this._required ++;
    }

    public Load(onUpdate:AmAssetCallback, onComplete:AmAssetCallback)
    {
        this._steps = 0;
        this._onUpdate = onUpdate;
        this._onComplete = onComplete;

        for (var i = 0; i < this._textures.length; i ++)
        {
            var texture = new Image();
            texture.onload = () => this.Step();
            texture.src = this._textures[i].file;

            this.textures[this._textures[i].name] = texture;
        }

        for (var i = 0; i < this._sounds.length; i ++)
        {
            var sound = new Audio(this._sounds[i].file);
            sound.onloadeddata = () => this.Step();
            sound.src = this._sounds[i].file;

            this.sounds[this._sounds[i].name] = sound;
        }

        this._textures = new Array<AmAssetInfo>();
        this._sounds = new Array<AmAssetInfo>();
    }

    private Step()
    {
        this._steps ++;
        this.percent = this._steps / this._required;
        if (this._onUpdate != null)
            this._onUpdate(this);

        if (this._steps == this._required)
        {
            this.percent = 1;
            if (this._onComplete != null)
                this._onComplete(this);
            this._required = 0;
        }
    }

}