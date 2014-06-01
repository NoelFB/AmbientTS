/// <reference path="../Ambient.ts"/>
/// <reference path="../utils/AmRectangle.ts"/>
/// <reference path="../utils/AmDictionary.ts"/>
/// <reference path="AmGraphic.ts"/>

class AmTilemap extends AmGraphic
{
	public tileWidth:number;
	public tileHeight:number;
	public columns:number;
	public rows:number;
	public stacking:boolean

	public data:Array<Array<Array<number>>>;

	constructor(texture:HTMLImageElement, tileWidth:number, tileHeight:number, columns:number, rows:number, stacking:boolean)
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

	public Set(column:number, row:number, tileX:number, tileY:number)
	{
		if (column >= 0 && row >= 0 && column < this.columns && row < this.rows)
		{
			if (!this.stacking)
				this.data[column][row] = new Array<number>();
			this.data[column][row].push(this.GetIndex(tileX, tileY));
		}
	}

	public Clear(column:number, row:number)
	{
		if (column >= 0 && row >= 0 && column < this.columns && row < this.rows)
			this.data[column][row] = new Array<number>();
	}

	public ClearRect(column:number, row:number, w:number, h:number)
	{
		for (var i = Math.max(0, column); i < Math.min(this.columns, column + w); i ++)
			for (var j = Math.max(0, row); j < Math.min(this.rows, row + h); j ++)
				this.data[i][j] = new Array<number>();
	}

	public ClearAll()
	{
		for (var i = 0; i < this.columns; i ++)
			for (var j = 0; j < this.rows; j ++)
				this.data[i][j] = new Array<number>();
	}

	public GetIndex(tileX:number, tileY:number):number
	{
		return tileY * this.columns + tileX;
	}

	public Render()
	{
		for (var i = 0; i < this.columns; i ++)
		{
			for (var j = 0; j < this.rows; j ++)
			{
				for (var tile = 0; tile < this.data[i][j].length; tile ++)
				{
					var tx = (this.data[i][j][tile] % this.columns);
					var ty = Math.floor(this.data[i][j][tile] / this.columns);

					Am.context.drawImage(this.texture,
					tx * this.tileWidth, ty * this.tileHeight, this.tileWidth, this.tileHeight,
					this.scenePosition.x + i * this.tileWidth * this.scale.x, this.scenePosition.y + j * this.tileHeight * this.scale.y,
					this.tileWidth * this.scale.x, this.tileHeight * this.scale.y);
				}
			}
		}
	}

}