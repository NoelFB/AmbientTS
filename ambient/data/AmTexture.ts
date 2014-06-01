/// <reference path="../utils/AmRectangle.ts"/>
/// <reference path="../utils/AmPoint.ts"/>

class AmTexture
{
	public data:HTMLImageElement;
	public frame:AmRectangle;
	public bounds:AmRectangle;

	constructor(data:HTMLImageElement, bounds:AmRectangle, frame:AmRectangle)
	{
		this.data = data;
		this.bounds = bounds;

		if (frame == null)
			this.frame = new AmRectangle(0, 0, bounds.width, bounds.height);
		else
			this.frame = frame;
	}

	public SubTexture(subBounds:AmRectangle):AmTexture
	{
		var rect:AmRectangle = new AmRectangle(0,0,0,0);
		var offset:AmPoint = AmPoint.Zero();

		rect.x = this.bounds.x + this.frame.x + subBounds.x;
		rect.y = this.bounds.y + this.frame.y + subBounds.y;
		rect.width = subBounds.width;
		rect.height = subBounds.height;

		if (rect.x < this.bounds.x)
		{
			rect.width += (rect.x - this.bounds.x);
			offset.x = (rect.x - this.bounds.x);
			rect.x = this.bounds.x;
		}
		if (rect.y < this.bounds.y)
		{
			rect.height += (rect.y - this.bounds.y);
			offset.y = (rect.y - this.bounds.y);
			rect.y = this.bounds.y;
		}
		if (rect.x + rect.width > this.bounds.x + this.bounds.width)
			rect.width = this.bounds.x + this.bounds.width - rect.x;
		if (rect.y + rect.height > this.bounds.y + this.bounds.height)
			rect.height = this.bounds.y + this.bounds.height - rect.y;

		return new AmTexture(this.data, rect, new AmRectangle(offset.x, offset.y, subBounds.width, subBounds.height));
	}

	public Draw(context:CanvasRenderingContext2D, x:number, y:number, originX:number, originY:number, scaleX:number, scaleY:number, subBounds:AmRectangle)
	{
		if (subBounds != null)
		{
			var texture:AmTexture = this.SubTexture(subBounds);
			texture.Draw(context, x, y, originX, originY, scaleX, scaleY, null);
		}
		else
		{
			context.save();
			context.translate(x + this.frame.x, y + this.frame.y);
			context.scale(scaleX, scaleY);
			context.translate( -originX, - originY);
			context.drawImage(this.data, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, 0, 0, this.bounds.width, this.bounds.height);
			context.restore();
		}
	}
}