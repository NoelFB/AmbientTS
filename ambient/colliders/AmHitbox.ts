/// <reference path="AmCollider.ts"/>
/// <reference path="AmOverlaps.ts"/>

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

    public Overlaps(other:AmCollider)
    {
        if (other.type == ColliderType.Hitbox)
            return AmOverlaps.HitboxToHitbox(this, other);
        else if  (other.type == ColliderType.Grid)
            return AmOverlaps.HitboxToGrid(this, other);
        return false;
    }
}