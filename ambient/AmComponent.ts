/// <reference path="Ambient.ts"/>
/// <reference path="AmEntity.ts"/>
/// <reference path="utils/AmPoint.ts"/>

class AmComponent
{
	public entity:AmEntity;
	public active:boolean = true;
	public visible:boolean = true;

	public position:AmPoint = new AmPoint(0, 0);
	public get x():number { return this.position.x; }
	public set x(value:number) { this.position.x = value; }

	public get y():number { return this.position.y; }
	public set y(value:number) { this.position.y = value; }

	public get scenePosition():AmPoint
	{
		if (this.entity == null)
			return this.position;
		return AmPoint.Add(this.position, this.entity.position);
	}
	public set scenePosition(value:AmPoint)
	{
		if (this.entity == null)
			this.position = value;
		else
			this.position = AmPoint.Subtract(value, this.entity.position);
	}

	public Start()
	{

	}

	public End()
	{

	}

	public Update()
	{

	}

	public Render()
	{

	}
}