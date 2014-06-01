/// <reference path="../../ambient/Ambient.ts"/>
/// <reference path="../../ambient/AmEntity.ts"/>
/// <reference path="../../ambient/utils/AmPoint.ts"/>

class Smoke extends AmEntity
{

	public timer:number;
	public size:number;
	public speed:AmPoint;
	public color:string;

	constructor()
	{
		super();
	}

	public Define(x:number, y:number)
	{
		this.x = x;
		this.y = y;
		this.timer = 1;
		this.size = 2 + Math.ceil(Math.random() * 2);
		this.speed = new AmPoint(-8 + Math.random() * 16, -8 + Math.random() * 16);
		this.color = Math.random() < 0.5 ? "#dddddd" : "#eeeeee";
	}

	public Update()
	{
		this.timer -= Am.deltaTime;
		if (this.timer <= 0)
		{
			Am.scene.Remove(this);
			Smoke.cache.push(this);
		}
		else
		{
			this.x += this.speed.x * Am.deltaTime;
			this.y += this.speed.y * Am.deltaTime;
		}
	}

	public Render()
	{
		var size = Math.ceil(this.size * this.timer);
		Am.context.fillStyle = this.color;
		Am.context.fillRect(Math.round(this.x - size / 2), Math.round(this.y - size / 2), size, size);
	}

	public static cache:Array<Smoke> = new Array<Smoke>();
	public static Burst(x:number, y:number, range:number, count:number)
	{
		for (var i = 0; i < count; i ++)
		{
			var smoke:Smoke;
			if (Smoke.cache.length > 0)
			{
				smoke = Smoke.cache[0];
				Smoke.cache.splice(0, 1);
			}
			else
			{
				smoke = new Smoke();
			}

			smoke.Define(x - range + Math.random() * range * 2, y - range + Math.random() * range * 2);
			Am.scene.Add(smoke);
		}
	}
}