/// <reference path="../Ambient.ts"/>
/// <reference path="../utils/AmRectangle.ts"/>
/// <reference path="../utils/AmDictionary.ts"/>
/// <reference path="../data/AmTexture.ts"/>
/// <reference path="AmGraphic.ts"/>
/// <reference path="AmDraw.ts"/>

class AmTilemap extends AmGraphic
{
	public tileWidth:number;
	public tileHeight:number;
	public columns:number;
	public rows:number;
	public stacking:boolean

	public data:Array<Array<Array<number>>>;

	constructor(texture:AmTexture, tileWidth:number, tileHeight:number, columns:number, rows:number, stacking:boolean = true)
	{
		super(texture, new AmRectangle(0, 0, tileWidth, tileHeight));

		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.columns = columns;
		this.rows = rows;
		this.stacking = stacking;

		this.data = new Array<Array<Array<number>>>();
		for (var i = 0; i < columns; i ++)
		{
			this.data.push(new Array<Array<number>>());
			for (var j = 0; j < rows; j ++)
			{
				this.data[i].push(new Array<number>());
			}
		}
	}

	public Set(x:number, y:number, tileX:number, tileY:number)
	{
		if (x >= 0 && y >= 0 && x < this.columns && y < this.rows)
		{
			if (!this.stacking)
				this.data[x][y] = new Array<number>();
			this.data[x][y].push(this.GetIndex(tileX, tileY));
		}
	}

	public SetRect(x:number, y:number, width:number, height:number, tileX:number, tileY:number)
	{
		for (var i = Math.max(0, x); i < Math.min(this.columns, x + width); i ++)
		{
			for (var j = Math.max(0, y); j < Math.min(this.rows, y + height); j ++)
			{
				if (!this.stacking)
					this.data[i][j] = new Array<number>();
				this.data[i][j].push(this.GetIndex(tileX, tileY));
			}
		}
	}

	public SeAll(x:number, y:number, tileX:number, tileY:number)
	{
		for (var i = 0; i < this.columns; i ++)
		{
			for (var j = 0; j < this.rows; j ++)
			{
				if (!this.stacking)
					this.data[i][j] = new Array<number>();
				this.data[i][j].push(this.GetIndex(tileX, tileY));
			}
		}
	}

	public Clear(x:number, y:number)
	{
		if (x >= 0 && y >= 0 && x < this.columns && y < this.rows)
			this.data[x][y] = new Array<number>();
	}

	public ClearRect(x:number, y:number, width:number, height:number)
	{
		for (var i = Math.max(0, x); i < Math.min(this.columns, x + width); i ++)
			for (var j = Math.max(0, y); j < Math.min(this.rows, y + height); j ++)
				this.data[i][j] = new Array<number>();
	}

	public ClearAll()
	{
		for (var i = 0; i < this.columns; i ++)
			for (var j = 0; j < this.rows; j ++)
				this.data[i][j] = new Array<number>();
	}

	public Get(x:number, y:number):any
	{
		if (x < 0 || y < 0 || x >= this.columns || y >= this.rows)
			return -1;
		if (!this.stacking)
			return this.data[x][y][0];
		return this.data[x][y];
	}

	public GetIndex(tileX:number, tileY:number):number
	{
		return tileY * this.columns + tileX;
	}

	public Render()
	{
		AmDraw.PushTransform();
		AmDraw.Translate(this.scenePosition.x, this.scenePosition.y);
		AmDraw.Scale(this.scale.x, this.scale.y);
		AmDraw.Translate(-this.origin.x, -this.origin.y);
		for (var i = 0; i < this.columns; i ++)
		{
			for (var j = 0; j < this.rows; j ++)
			{
				var tileData:Array<number> = this.data[i][j]
				for (var tile = 0; tile < tileData.length; tile ++)
				{
					var tx = (tileData[tile] % this.columns);
					var ty = Math.floor(tileData[tile] / this.columns);

					AmDraw.TextureClipped(this.texture, 
						i * this.tileWidth, j * this.tileHeight, 
						tx * this.tileWidth, ty * this.tileHeight, this.tileWidth, this.tileHeight);
				}
			}
		}
		AmDraw.PullTransform();
	}

}