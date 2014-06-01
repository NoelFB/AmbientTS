/// <reference path="../../ambient/Ambient.ts"/>
/// <reference path="../../ambient/AmEntity.ts"/>
/// <reference path="../../ambient/utils/AmKeyboard.ts"/>
/// <reference path="../../ambient/colliders/AmHitbox.ts"/>
/// <reference path="../../ambient/graphics/AmAnimator.ts"/>
/// <reference path="Main.ts"/>

class Creature extends AmEntity
{

    public collider:AmHitbox;
    public sprite:AmAnimator;
    public speed:AmPoint = new AmPoint(0, 0);
    public facing:number = 1;

    public accel:number = 240;
    public gravity:number = 360;
    public frictionGround:number = 160;
    public frictionAir:number = 90;
    public jumpForce:number = 120;
    public maxspeed:AmPoint = new AmPoint(48, 224);

    public movementRemainder:AmPoint = new AmPoint(0, 0);

    constructor()
    {
        super();
        this.position = new AmPoint(80, 60);

        this.collider = new AmHitbox(-4, -4, 8, 8);
        this.Add(this.collider);

        this.sprite = new AmAnimator(assets.textures["player"], 16, 16);
        this.sprite.Add("idle", [0], 0);
        this.sprite.Add("run", [0, 1, 0, 2], 10);
        this.sprite.Add("jump", [1], 0);
        this.sprite.Play("idle", true);
        this.sprite.origin.x = 8;
        this.sprite.origin.y = 12;
        this.Add(this.sprite);

        this.depth = 5;
    }

    public Update()
    {
        super.Update();

        var axis:number = (Am.keyboard.Down(AmKey.LEFT) ? -1 : (Am.keyboard.Down(AmKey.RIGHT) ? 1 : 0));

        if (axis != 0)
            this.facing = axis;
        this.sprite.scale.x = this.facing;

        // accelerate
        this.speed.x += axis * this.accel * Am.deltaTime;

        // friction
        if (axis == 0)
        {
            var friction = this.frictionAir;
            if (this.collider.Check("solid", 0, 1))
                friction = this.frictionGround;

            var sign = this.Sign(this.speed.x);
            this.speed.x -= sign * friction * Am.deltaTime;
            if (this.Sign(this.speed.x) != sign)
                this.speed.x = 0;
        }

        // gravity
        if (!this.collider.Check("solid", 0, 1))
        {
            if (Am.keyboard.Down(AmKey.UP) && Math.abs(this.speed.y) < 60)
                this.speed.y += this.gravity / 2 * Am.deltaTime;
            else
                this.speed.y += this.gravity * Am.deltaTime;
        }

        // jump
        if (Am.keyboard.Pressed(AmKey.UP) && this.collider.Check("solid", 0, 1))
        {
            this.speed.y = -this.jumpForce;
        }

        // clamp maxspeed
        if (Math.abs(this.speed.x) > this.maxspeed.x)
            this.speed.x = this.Sign(this.speed.x) * this.maxspeed.x;
        if (Math.abs(this.speed.y) > this.maxspeed.y)
            this.speed.y = this.Sign(this.speed.y) * this.maxspeed.y;

        // move
        this.MoveX(this.speed.x * Am.deltaTime);
        this.MoveY(this.speed.y * Am.deltaTime);

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

        Am.camera.x = this.position.x - Am.width / 2;
        if (Am.camera.x < 0)
            Am.camera.x = 0;
        if (Am.camera.x + Am.width > 40 * 8)
            Am.camera.x = 40 * 8 - Am.width;

    }

    public MoveX(amount:number)
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
                if (!this.collider.Check("solid", step, 0))
                {
                    this.position.x += step;
                    moveBy -= step;
                }
                else
                {
                    this.speed.x = 0;
                    break;
                }
            }
        }
    }

    public MoveY(amount:number)
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
                if (!this.collider.Check("solid", 0, step))
                {
                    this.position.y += step;
                    moveBy -= step;
                }
                else
                {
                    this.speed.y = 0;
                    break;
                }
            }
        }
    }

    public Sign(n:number):number
    {
        return (n > 0 ? 1 : (n < 0 ? -1 : 0))
    }

}