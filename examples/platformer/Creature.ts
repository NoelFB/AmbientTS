/// <reference path="../../ambient/Ambient.ts"/>
/// <reference path="../../ambient/AmActor.ts"/>
/// <reference path="../../ambient/utils/AmKeyboard.ts"/>
/// <reference path="../../ambient/colliders/AmHitbox.ts"/>
/// <reference path="../../ambient/graphics/AmAnimator.ts"/>
/// <reference path="Main.ts"/>
/// <reference path="Smoke.ts"/>

class Creature extends AmActor
{
	public sprite:AmAnimator;
	public facing:number = 1;

	public accel:number = 240;
	public gravity:number = 360;
	public frictionGround:number = 160;
	public frictionAir:number = 90;
	public jumpForce:number = 120;
	public maxspeed:AmPoint = new AmPoint(48, 224);

	constructor()
	{
		// actor constructor
		super(new AmHitbox(-3, -8, 6, 8));

		// set position
		this.position = new AmPoint(80, 60);

		// set sprite
		this.sprite = new AmAnimator(assets.textures["player"], 16, 16);
		this.sprite.Add("idle", [0], 0);
		this.sprite.Add("run", [0, 1, 0, 2], 10);
		this.sprite.Add("jump", [1], 0);
		this.sprite.Play("idle", true);
		this.sprite.origin.x = 8;
		this.sprite.origin.y = 16;
		this.Add(this.sprite);

		// graphic depth
		this.depth = 5;
	}

	public Update()
	{
		super.Update();

		// get input direction
		var axis:number = (Am.keyboard.Down(AmKey.LEFT) ? -1 : (Am.keyboard.Down(AmKey.RIGHT) ? 1 : 0));

		// update facing 
		if (axis != 0)
			this.facing = axis;

		// accelerate
		this.Accelerate(axis * this.accel, 0);

		// friction
		if (axis == 0)
			this.Friction(this.collider.Check("solid", 0, 1) ? this.frictionGround : this.frictionAir, 0);

		// gravity
		if (!this.collider.Check("solid", 0, 1))
		{
			if (Am.keyboard.Down(AmKey.UP) && Math.abs(this.speed.y) < 60)
				this.Accelerate(0, this.gravity / 2);
			else
				this.Accelerate(0, this.gravity);
		}

		// jump
		if (Am.keyboard.Pressed(AmKey.UP) && this.collider.Check("solid", 0, 1))
			this.speed.y = -this.jumpForce;

		// clamp maxspeed
		this.Maxspeed(this.maxspeed.x, this.maxspeed.y);

		// move
		this.Move();

		// sprite
		if (this.collider.Check("solid", 0, 1))
		{
			if (axis == 0)
				this.sprite.Play("idle", false);
			else
				this.sprite.Play("run", false);
		}
		else
			this.sprite.Play("jump", false);

		// move camera
		Am.camera.x += (this.position.x - Am.width / 2 - Am.camera.x) / 10;
		if (Am.camera.x < 0)
			Am.camera.x = 0;
		if (Am.camera.x + Am.width > 40 * 8)
			Am.camera.x = 40 * 8 - Am.width;

		// toggle fullscreen & pixel clamping
		if (Am.keyboard.Pressed(AmKey.F))
			Am.ToggleFullscreen();
		if  (Am.keyboard.Pressed(AmKey.P))
			Am.keepPixelScale = !Am.keepPixelScale;

		// scale Y back
		if (this.sprite.scale.y < 1)
		this.sprite.scale.y += Am.deltaTime * 2;
		else
		this.sprite.scale.y = 1;

		// scale X back
		this.sprite.scale.x = this.facing * Math.abs(this.sprite.scale.x);
		if (Math.abs(this.sprite.scale.x) > 1)
			this.sprite.scale.x -= this.facing * Am.deltaTime * 2;
		else
			this.sprite.scale.x = this.facing;
	}

	public OnCollideY()
	{
		if (this.speed.y > 10)
		{
			Smoke.Burst(this.x, this.y, 4, 4);
			this.sprite.scale.x = 1.25;
			this.sprite.scale.y = 0.75;
		}
		super.OnCollideY();
	}

}