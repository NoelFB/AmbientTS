/// <reference path="AmCollider.ts"/>

class AmHitbox extends AmCollider
{
    public width:number;
    public height:number;

    constructor(x:number, y:number, width:number, height:number)
    {
        super(ColliderType.Hitbox);
        this.position = new AmPoint(x, y);
        this.width = width;
        this.height = height;
    }

    public OverlapsHitbox(other:any):boolean
    {
        var a = this;
        var b = other;
        var pa = a.scenePosition();
        var pb = b.scenePosition();

        return (pa.x + a.width > pb.x && pa.y + a.height > pb.y && pa.x < pb.x + b.width && pa.y < pb.y + b.height);
    }

    public OverlapsGrid(other:any):boolean
    {
        var a = this;
        var b = other;
        var pa = a.scenePosition();
        var pb = b.scenePosition();

        var left:number = Math.floor((pa.x - pb.x) / b.tileWidth);
        var top:number = Math.floor((pa.y - pb.y) / b.tileHeight);
        var right:number = Math.ceil((pa.x + a.width - pb.x) / b.tileWidth);
        var bottom:number = Math.ceil((pa.y + a.height - pb.y) / b.tileHeight);

        for (var i = Math.max(0, left); i < Math.min(b.columns, right); i ++)
        {
            for (var j = Math.max(0, top); j < Math.min(b.rows, bottom); j ++)
            {
                if (b.solids[i][j])
                    return true;
            }
        }

        return false;
    }
}