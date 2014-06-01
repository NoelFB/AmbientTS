class AmOverlaps
{
	public static HitboxToHitbox(a:any, b:any):boolean
	{
        var pa = a.scenePosition;
        var pb = b.scenePosition;

        return (pa.x + a.width > pb.x && pa.y + a.height > pb.y && pa.x < pb.x + b.width && pa.y < pb.y + b.height);
	}

	public static HitboxToGrid(a:any, b:any):boolean
	{
        var pa = a.scenePosition;
        var pb = b.scenePosition;

        var left:number = Math.floor((pa.x - pb.x) / b.tileWidth);
        var top:number = Math.floor((pa.y - pb.y) / b.tileHeight);
        var right:number = Math.ceil((pa.x + a.width - pb.x) / b.tileWidth);
        var bottom:number = Math.ceil((pa.y + a.height - pb.y) / b.tileHeight);

        for (var i = left; i < right; i ++)
        {
            for (var j = top; j < bottom; j ++)
            {
                if (b.Get(i, j))
                    return true;
            }
        }

        return false;
	}

	public static GridToGrid(a:any, b:any):boolean
	{
		return false;
	}
}