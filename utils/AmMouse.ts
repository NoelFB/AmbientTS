/// <reference path="AmPoint.ts"/>

class AmMouse
{
    public position:AmPoint = new AmPoint(0, 0);
    public pressed:boolean = false;
    public released:boolean = false;
    public down:boolean = false;

    private canvas:HTMLElement;

    public constructor(canvas:HTMLElement)
    {
        this.canvas = canvas;

        this.canvas.onmousemove = (e:MouseEvent) =>
        {
            this.position = new AmPoint(e.offsetX, e.offsetY);
        }

        this.canvas.onmousedown = (e:MouseEvent) =>
        {
            this.pressed = true;
            this.down = true;
        }

        this.canvas.onmouseup = (e:MouseEvent) =>
        {
            this.released = true;
            this.down = false;
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
        this.pressed = false;
        this.released = false;
    }
}