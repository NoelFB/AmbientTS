/// <reference path="AmCollider.ts"/>
/// <reference path="AmOverlaps.ts"/>

class AmHitgrid extends AmCollider
{
	public columns:number;
	public rows:number;
	public tileWidth:number;
	public tileHeight:number;
	public solids:Array<Array<boolean>>;
	public outsideReturnValue:boolean = true;

	constructor(tileWidth:number, tileHeight:number, columns:number, rows:number)
	{
		super(ColliderType.Grid);

		this.columns = columns;
		this.rows = rows;
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;

		this.solids = new Array<Array<boolean>>();
		for (var i = 0; i < columns; i ++)
		{
			this.solids.push(new Array<boolean>());
			for (var j = 0; j < rows; j ++)
			{
				this.solids[i].push(false);
			}
		}
	}

	public Set(x:number, y:number, solid:boolean)
	{
		if (x >= 0 && y >= 0 && x < this.columns && y < this.rows)
			this.solids[x][y] = solid;
	}

	public SetRect(x:number, y:number, w:number, h:number, solid:boolean)
	{
		for (var i = Math.max(0, x); i < Math.min(this.columns, x + w); i ++)
		for (var j = Math.max(0, y); j < Math.min(this.rows, y + h); j ++)
		this.solids[i][j] = solid;
	}

	public Get(x:number, y:number):boolean
	{
		if (x < 0 || y < 0 || x >= this.columns || y >= this.rows)
			return this.outsideReturnValue;
		return this.solids[x][y];
	}

	public Overlaps(other:AmCollider)
	{
		if (other.type == ColliderType.Hitbox)
			return AmOverlaps.HitboxToGrid(other, this);
		else if  (other.type == ColliderType.Grid)
			return AmOverlaps.GridToGrid(this, other);
		return false;
	}
}