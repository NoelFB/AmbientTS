/// <reference path="AmPoint.ts"/>

class AmMouse
{
    public position:AmPoint = new AmPoint(0, 0);

    public leftPressed:boolean = false;
    public leftReleased:boolean = false;
    public leftDown:boolean = false;

    public rightPressed:boolean = false;
    public rightReleased:boolean = false;
    public rightDown:boolean = false;

    private canvas:HTMLElement;

    public constructor(canvas:HTMLElement)
    {
        this.canvas = canvas;

        this.canvas.onmousemove = (e:MouseEvent) =>
        {
            this.position = new AmPoint(e.offsetX / Am.scale + Am.camera.x, e.offsetY / Am.scale + Am.camera.y);
        }

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
    }

    public X():number
    {
        return this.position.x;
    }

    public Y():number
    {
        return this.position.y;
    }

    public Clear()
    {
        this.leftPressed = false;
        this.leftReleased = false;
        this.rightPressed = false;
        this.rightReleased = false;
    }
}