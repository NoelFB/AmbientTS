/// <reference path="../utils/AmRectangle.ts"/>
/// <reference path="../utils/AmPoint.ts"/>

class AmTexture
{
	public image:HTMLImageElement;
	public bounds:AmRectangle;

	public get width():number { return this.bounds.width; }
	public get height():number { return this.bounds.height; }

	constructor(image:HTMLImageElement, bounds:AmRectangle)
	{
		this.image = image;
		
		if (bounds == null)
			this.bounds = new AmRectangle(0, 0, image.width, image.height);
		else
			this.bounds = bounds;
	}

	public SubTexture(subBounds:AmRectangle):AmTexture
	{
		return new AmTexture(this.image, this.SubTextureRect(subBounds));
	}

	public SubTextureRect(subBounds:AmRectangle):AmRectangle
	{
		var rect:AmRectangle = new AmRectangle(subBounds.x, subBounds.y, subBounds.width, subBounds.height);
		
		if (rect.x < 0)
		{
			rect.width += rect.x;
			rect.x = 0;
		}
		if (rect.y < 0)
		{
			rect.height += rect.y;
			rect.y = 0;
		}
		if (rect.x + rect.width > this.bounds.width)
			rect.width = this.bounds.width - rect.x;
		if (rect.y + rect.height > this.bounds.height)
			rect.height = this.bounds.height - rect.y;
		if (rect.width < 0) 
			rect.width = 0;
		if (rect.height < 0)
			rect.height = 0;

		return new AmRectangle(this.bounds.x + rect.x, this.bounds.y + rect.y, rect.width, rect.height);
	}
}