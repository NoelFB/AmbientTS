/// <reference path="../Ambient.ts"/>
/// <reference path="../AmComponent.ts"/>
/// <reference path="../utils/AmPoint.ts"/>
/// <reference path="../utils/AmRectangle.ts"/>
/// <reference path="AmDraw.ts"/>

class AmGraphic extends AmComponent
{
	public texture:AmTexture;
	public bounds:AmRectangle;
	public scale:AmPoint = AmPoint.One();
	public origin:AmPoint = AmPoint.Zero();

	constructor(texture:AmTexture, bounds:AmRectangle = null)
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
		AmDraw.PushTransform();
		AmDraw.Translate(this.scenePosition.x, this.scenePosition.y);
		AmDraw.Scale(this.scale.x, this.scale.y);
		AmDraw.Translate(-this.origin.x, -this.origin.y);

		if (this.bounds.x == 0 && this.bounds.y == 0 && this.bounds.width == this.texture.width && this.bounds.height == this.texture.height)
			AmDraw.Texture(this.texture, 0, 0);
		else
			AmDraw.TextureClipped(this.texture, 0, 0, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

		AmDraw.PullTransform();
	}
}