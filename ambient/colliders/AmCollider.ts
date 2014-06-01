/// <reference path="../AmComponent.ts"/>

enum ColliderType
{
	Hitbox,
	Grid
}

class AmCollider extends AmComponent
{
	public type:ColliderType;
	private _tag:string = "";
	private _totag:string = "";

	constructor(type:ColliderType)
	{
		super();
		this.type = type;
		this.visible = false;
	}

	public GetTag():string
	{
		return this._tag;
	}

	public Tag(tag:string)
	{
		if (this.entity == null || this.entity.scene == null)
			this._totag = tag;
		else
		{
			this.entity.scene.SetColliderTag(this, tag, this._tag);
			this._tag = tag;
		}
	}

	public UnTag()
	{
		if (this.entity == null || this.entity.scene == null)
			this._totag = "";
		else
		{
			this.entity.scene.SetColliderTag(this, this._tag, "");
			this._tag = "";
		}
	}

	public Start()
	{
		super.Start();
		if (this._totag != this._tag)
		{
			this.entity.scene.SetColliderTag(this, this._tag, this._totag);
			this._tag = this._totag;
		}
	}

	public End()
	{
		this._totag = this._tag;
		this._tag = "";
		this.entity.scene.SetColliderTag(this, this._totag, "");
	}

	public Collide(tag:string, x:number = 0, y:number = 0):AmCollider
	{
		var result:AmCollider = null;

		this.position.x += x;
		this.position.y += y;

		if (this.entity != null && this.entity.scene != null)
		{
			var colliders = this.entity.scene.colliders[tag];
			for (var i = 0; i < colliders.length; i ++)
			{
				if (this.Overlaps(colliders[i]))
				{
					result = colliders[i];
					break;
				}
			}
		}

		this.position.x -= x;
		this.position.y -= y;

		return result;
	}

	public Check(tag:string, x:number, y:number):boolean
	{
		return (this.Collide(tag, x, y) != null);
	}

	public Overlaps(other:AmCollider):boolean
	{
		return false;
	}

}