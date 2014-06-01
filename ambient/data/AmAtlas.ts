/// <reference path="AmTexture.ts"/>
/// <reference path="../utils/AmRectangle.ts"/>
/// <reference path="../utils/AmDictionary.ts"/>

class AmAtlas
{
	public data:HTMLImageElement;
	public subtextures:AmDictionary<AmTexture> = { };

	constructor(data:HTMLImageElement)
	{
		this.data = data;
	}

	public Add(name:string, bounds:AmRectangle, frame:AmRectangle)
	{
		this.subtextures[name] = new AmTexture(this.data, bounds, frame);
	}
}