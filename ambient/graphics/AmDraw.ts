/// <reference path="../data/AmTexture.ts"/>
/// <reference path="../utils/AmRectangle.ts"/>

// abstracted out the actual drawing to the canvas in case we want to change to webgl or something later

class AmDraw
{
	public static Translate(x:number, y:number)
	{
		Am.context.translate(Math.floor(x), Math.floor(y));
	}

	public static Scale(x:number, y:number)
	{
		Am.context.scale(x, y);
	}

	public static Rotate(r:number)
	{
		Am.context.rotate(r);
	}

	public static PushTransform()
	{
		Am.context.save();
	}

	public static PullTransform()
	{
		Am.context.restore();
	}

	public static Texture(texture:AmTexture, x:number, y:number)
	{
		Am.context.drawImage(texture.image, 
			Math.floor(texture.bounds.x), Math.floor(texture.bounds.y), Math.floor(texture.bounds.width), Math.floor(texture.bounds.height), 
			Math.floor(x), Math.floor(y), Math.floor(texture.bounds.width), Math.floor(texture.bounds.height));
	}

	public static TextureClipped(texture:AmTexture, x:number, y:number, sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number)
	{
		var subbounds:AmRectangle = texture.SubTextureRect(new AmRectangle(sourceX, sourceY, sourceWidth, sourceHeight));
		Am.context.drawImage(texture.image, 
			Math.floor(subbounds.x), Math.floor(subbounds.y), Math.floor(subbounds.width), Math.floor(subbounds.height), 
			Math.floor(x), Math.floor(y), Math.floor(subbounds.width), Math.floor(subbounds.height));
	}

	public static Rect(x:number, y:number, width:number, height:number, color:string)
	{
		Am.context.fillStyle = color;
		Am.context.fillRect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
	}

	public static HollowRect(x:number, y:number, width:number, height:number, thickness:number, color:string)
	{
		Am.context.beginPath();
		Am.context.rect(Math.floor(x), Math.floor(y), Math.floor(width), Math.floor(height));
		Am.context.lineWidth = thickness;
		Am.context.strokeStyle = color;
		Am.context.stroke();
	}

	public static Line(x:number, y:number, x2:number, y2:number, thickness:number, color:string)
	{
		Am.context.beginPath();
		Am.context.moveTo(Math.floor(x), Math.floor(y));
		Am.context.lineTo(Math.floor(x2), Math.floor(y2));
		Am.context.lineWidth = thickness;
		Am.context.strokeStyle = color;
		Am.context.stroke();
	}

}