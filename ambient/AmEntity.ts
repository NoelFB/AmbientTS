/// <reference path="utils/AmPoint.ts"/>
/// <reference path="AmScene.ts"/>
/// <reference path="AmComponent.ts"/>

class AmEntity
{
	public id:number;

	public position:AmPoint = new AmPoint(0, 0);

	public get x():number { return this.position.x; }
	public set x(value:number) { this.position.x = value; }

	public get y():number { return this.position.y; }
	public set y(value:number) { this.position.y = value; }

	public active:boolean = true;
	public visible:boolean = true;
	public scene:AmScene;

	public depth:number = 0;
	public components:Array<AmComponent> = new Array<AmComponent>();

	private _tags:Array<string> = new Array<string>();
	private _totag:Array<string> = new Array<string>();

	constructor()
	{
		this.Tag("all");
	}

	public Start()
	{
		for (var i = 0; i < this._totag.length; i ++)
		{
			this._tags.push(this._totag[i]);
			this.scene.AddEntityTag(this, this._totag[i]);
		}
		this._totag = new Array<string>();
		for (var i = 0; i < this.components.length; i ++)
		{
			this.components[i].entity = this;
			this.components[i].Start();
		}
	}

	public End()
	{
		for (var i = 0; i < this._tags.length; i ++)
		{
			this._totag.push(this._tags[i]);
			this.scene.RemoveEntityTag(this, this._tags[i]);
		}
		this._tags = new Array<string>();
	}

	public Add(component:any)
	{
		this.components.push(component);
		if (this.scene != null)
		{
			component.entity = this;
			component.Start();
		}
	}

	public Remove(component:any)
	{
		for (var i = 0; i < this.components.length; i ++)
		{
			if (this.components[i] == component)
			{
				this.components.splice(i, 1);
				break;
			}
		}
		component.End();
		component.entity = null;
	}

	public Tag(tag:string)
	{
		if (this.scene != null)
		{
			this._tags.push(tag);
			this.scene.AddEntityTag(this, tag);
		}
		else
			this._totag.push(tag);
	}

	public Untag(tag:string)
	{
		if (this.scene != null)
		{
			for (var i = 0; i < this._tags.length; i ++)
			{
				if (this._tags[i] == tag)
				{
					this._tags.splice(i, 1);
					this.scene.RemoveEntityTag(this, tag);
					break;
				}
			}
		}
		else
		{
			for (var i = 0; i < this._totag.length; i ++)
			{
				if (this._totag[i] == tag)
				{
					this._totag.splice(i, 1);
					break;
				}
			}
		}
	}

	public Update()
	{
		for (var i = 0; i < this.components.length; i ++)
		{
			if (this.components[i].active)
			this.components[i].Update();
		}
	}

	public Render()
	{
		for (var i = 0; i < this.components.length; i ++)
		{
			if (this.components[i].visible)
			this.components[i].Render();
		}
	}
}