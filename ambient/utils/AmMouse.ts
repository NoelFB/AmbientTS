/// <reference path="AmPoint.ts"/>

class AmMouse
{
	private _position:AmPoint = new AmPoint(0, 0);

	public leftPressed:boolean = false;
	public leftReleased:boolean = false;
	public leftDown:boolean = false;

	public rightPressed:boolean = false;
	public rightReleased:boolean = false;
	public rightDown:boolean = false;

	public treatTouchAsMouse:boolean = true;

	private canvas:HTMLElement;

	public get position():AmPoint
	{
		var viewScale = Am.GetViewportScale();
		var viewOffset:AmPoint = Am.GetViewportOffset();
		return new AmPoint((this._position.x - viewOffset.x) / viewScale + Am.camera.x, (this._position.y - viewOffset.y) / viewScale + Am.camera.y);
	}

	public get x():number { return this.position.x; }
	public set x(value:number) { this.position.x = value; }

	public get y():number { return this.position.y; }
	public set y(value:number) { this.position.y = value; }

	public constructor(canvas:HTMLElement)
	{
		this.canvas = canvas;

		// mouse events
		this.canvas.onmousedown = (e:MouseEvent) =>
		{
			if (("which" in e && e.which == 3) || ("button" in e && e.button == 2))
			{
				this.rightPressed = true;
				this.rightDown = true;
			}
			else
			{
				this.leftPressed = true;
				this.leftDown = true;
			}
		}

		this.canvas.onmouseup = (e:MouseEvent) =>
		{
			if (("which" in e && e.which == 3) || ("button" in e && e.button == 2))
			{
				this.rightReleased = true;
				this.rightDown = false;
			}
			else
			{
				this.leftReleased = true;
				this.leftDown = false;
			}
		}

		this.canvas.onmousemove = (e:MouseEvent) =>
		{
			this._position = new AmPoint(e.offsetX, e.offsetY);
		}

		// touch events
		this.canvas.addEventListener("touchstart", (e) => 
		{
			if (this.treatTouchAsMouse)
			{
				this.leftPressed = true;
				this.leftDown = true;
			}
		});

		this.canvas.addEventListener("touchend", (e) =>
		{
			if (this.treatTouchAsMouse)
			{
				this.leftReleased = true;
				this.leftDown = false;
			}
		});

		this.canvas.addEventListener("touchmove", (e:any) =>
		{
			if (this.treatTouchAsMouse)
			{
				this._position = new AmPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
			}
		});
	}

	public Clear()
	{
		this.leftPressed = false;
		this.leftReleased = false;
		this.rightPressed = false;
		this.rightReleased = false;
	}
}