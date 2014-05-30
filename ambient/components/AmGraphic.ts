/// <reference path="../Ambient.ts"/>
/// <reference path="AmComponent.ts"/>
/// <reference path="../utils/AmPoint.ts"/>
/// <reference path="../utils/AmRectangle.ts"/>

class AmGraphic extends AmComponent
{
    public texture:HTMLImageElement;
    public bounds:AmRectangle;
    public scale:AmPoint = AmPoint.One();
    public origin:AmPoint = AmPoint.Zero();

    constructor(texture:HTMLImageElement, bounds:AmRectangle = null)
    {
        super();

        this.texture = texture;
        if (bounds == null)
            this.bounds = new AmRectangle(0, 0, texture.width, texture.height);
        else
            this.bounds = bounds;
    }

    public Update()
    {

    }

    public Render()
    {
        Am.context.save();
        Am.context.translate(this.scenePosition().x, this.scenePosition().y);
        Am.context.scale(this.scale.x, this.scale.y);
        Am.context.translate( - this.origin.x, - this.origin.y);
        Am.context.drawImage(this.texture,
            this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height,
            0, 0, this.bounds.width, this.bounds.height);
        Am.context.restore();
    }
}