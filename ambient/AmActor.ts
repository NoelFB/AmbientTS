/// <reference path="Ambient.ts"/>
/// <reference path="AmEntity.ts"/>
/// <reference path="utils/AmPoint.ts"/>

class AmActor extends AmEntity
{

	public collider:AmHitbox = null;
	public speed:AmPoint = AmPoint.Zero();
	public movementRemainder:AmPoint = AmPoint.Zero();
	public solidTag:string = "solid";

	constructor(collider:AmHitbox = null)
	{
		super();
		this.collider = collider;
		if (this.collider != null)
			this.Add(this.collider);
	}

	public Accelerate(aX:number, aY:number)
	{
		this.speed.x += aX * Am.deltaTime;
		this.speed.y += aY * Am.deltaTime;
	}

	public Friction(fX:number, fY:number)
	{
		var signX:number = this.Sign(this.speed.x);
		this.speed.x -= signX * fX * Am.deltaTime;
		if (this.Sign(this.speed.x) != signX)
			this.speed.x = 0;

		var signY:number = this.Sign(this.speed.y);
		this.speed.y -= signY * fY * Am.deltaTime;
		if (this.Sign(this.speed.y) != signY)
			this.speed.y = 0;
	}

	public Maxspeed(mX:number, mY:number)
	{
		if (Math.abs(this.speed.x) > mX)
			this.speed.x = this.Sign(this.speed.x) * mX;
		if (Math.abs(this.speed.y) > mY)
			this.speed.y = this.Sign(this.speed.y) * mY;
	}

	public Move()
	{
		this.MoveX(this.speed.x);
		this.MoveY(this.speed.y)
	}

	public MoveX(amount:number)
	{
		this.MoveAbsoluteX(amount * Am.deltaTime);
	}

	public MoveY(amount:number)
	{
		this.MoveAbsoluteY(amount * Am.deltaTime);
	}

	public MoveAbsoluteX(amount:number)
	{
		amount += this.movementRemainder.x;
		this.movementRemainder.x = amount % 1;
		var moveBy = amount > 0 ? Math.floor(amount) : Math.ceil(amount);

		if (this.collider == null)
			this.position.x += moveBy;
		else
		{
			var step = this.Sign(moveBy);
			while (moveBy != 0)
			{
				if (!this.collider.Check(this.solidTag, step, 0))
				{
					this.position.x += step;
					moveBy -= step;
				}
				else
				{
					this.OnCollideX();
					break;
				}
			}
		}
	}

	public MoveAbsoluteY(amount:number)
	{
		amount += this.movementRemainder.y;
		this.movementRemainder.y = amount % 1;
		var moveBy = amount > 0 ? Math.floor(amount) : Math.ceil(amount);

		if (this.collider == null)
			this.position.y += moveBy;
		else
		{
			var step = this.Sign(moveBy);
			while (moveBy != 0)
			{
				if (!this.collider.Check(this.solidTag, 0, step))
				{
					this.position.y += step;
					moveBy -= step;
				}
				else
				{
					this.OnCollideY();
					break;
				}
			}
		}
	}

	public OnCollideX()
	{
		this.speed.x = 0;
	}

	public OnCollideY()
	{
		this.speed.y = 0;
	}

	public Sign(n:number):number
	{
		return (n > 0 ? 1 : (n < 0 ? -1 : 0))
	}

}