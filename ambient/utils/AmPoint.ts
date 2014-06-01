class AmPoint
{
	public x:number = 0;
	public y:number = 0;

	constructor(x:number, y:number)
	{
		this.x = x;
		this.y = y;
	}

	public Add(other:AmPoint)
	{
		this.x += other.x;
		this.y += other.y;
	}

	public Subtract(other:AmPoint)
	{
		this.x -= other.x;
		this.y -= other.y;
	}

	public Multiply(other:AmPoint)
	{
		this.x *= other.x;
		this.y *= other.y;
	}

	public Length():number
	{
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}

	public Normalize()
	{
		var length:number = this.Length();
		this.x /= length;
		this.y /= length;
	}

	public static Add(a:AmPoint, b:AmPoint):AmPoint
	{
		return new AmPoint(a.x + b.x, a.y + b.y);
	}

	public static Subtract(a:AmPoint, b:AmPoint):AmPoint
	{
		return new AmPoint(a.x - b.x, a.y - b.y);
	}

	public static Multiply(a:AmPoint, b:AmPoint):AmPoint
	{
		return new AmPoint(a.x * b.x, a.y * b.y);
	}

	public static Length(a:AmPoint, b:AmPoint):number
	{
		return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
	}

	public static Zero():AmPoint
	{
		return new AmPoint(0, 0);
	}

	public static One():AmPoint
	{
		return new AmPoint(1, 1);
	}
}