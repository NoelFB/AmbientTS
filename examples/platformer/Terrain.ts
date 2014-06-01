/// <reference path="../../ambient/Ambient.ts"/>
/// <reference path="../../ambient/AmEntity.ts"/>
/// <reference path="../../ambient/graphics/AmTilemap.ts"/>
/// <reference path="../../ambient/colliders/AmHitgrid.ts"/>
/// <reference path="Main.ts"/>

class Terrain extends AmEntity
{

    public tilemap:AmTilemap;
    public collider:AmHitgrid;

    constructor()
    {
        super();

        this.tilemap = new AmTilemap(assets.textures["grass"], 8, 8, 40, 15, true);
        this.collider = new AmHitgrid(8, 8, 40, 15);
        this.collider.Tag("solid");

        this.collider.SetRect(0, 0, 2, 15, true);
        this.collider.SetRect(0, 0, 40, 2, true);
        this.collider.SetRect(0, 13, 40, 2, true);
        this.collider.SetRect(38, 0, 2, 15, true);
        this.collider.SetRect(8, 10, 4, 15, true);
        this.collider.SetRect(16, 7, 5, 4, true);

        this.Add(this.tilemap);
        this.Add(this.collider);

        this.GenerateTiles();
    }

    public Update()
    {
        super.Update();

        if (Am.mouse.leftPressed || Am.mouse.rightPressed)
        {
            var point:AmPoint = new AmPoint(Math.floor(Am.mouse.x / 8), Math.floor(Am.mouse.y / 8));
            this.collider.Set(point.x, point.y, Am.mouse.leftPressed);

            this.tilemap.ClearRect(point.x - 1, point.y - 1, 3, 3);
            for (var i = -1; i < 2; i ++)
                for (var j = -1; j < 2; j ++)
                    this.GenerateTile(point.x + i, point.y + j);
        }
    }

    public GenerateTiles()
    {
        for (var i = 0; i < this.collider.columns; i ++)
            for (var j = 0; j < this.collider.rows; j ++)
                this.GenerateTile(i, j);
    }

    public GenerateTile(x:number, y:number)
    {
        var up:boolean = this.collider.Get(x, y - 1);
        var right:boolean = this.collider.Get(x + 1, y);
        var left:boolean = this.collider.Get(x - 1, y);
        var down:boolean = this.collider.Get(x, y + 1);

        if (this.collider.Get(x, y))
        {
            if (left && up && down && right)
            {
                this.tilemap.Set(x, y, 2, 2);
            }
            else if (left && !up && right && down)
            {
                this.tilemap.Set(x, y, 2, 1);
            }
            else if (left && up && right && !down)
            {
                this.tilemap.Set(x, y, 2, 3);
            }
            else if (!left && up && right && down)
            {
                this.tilemap.Set(x, y, 1, 2);
            }
            else if (left && up && !right && down)
            {
                this.tilemap.Set(x, y, 3, 2);
            }
            else if (!left && !up && right && down)
            {
                this.tilemap.Set(x, y, 1, 1);
            }
            else if (left && !up && !right && down)
            {
                this.tilemap.Set(x, y, 3, 1);
            }
            else if (!left && up && right && !down)
            {
                this.tilemap.Set(x, y, 1, 3);
            }
            else if (left && up && !right && !down)
            {
                this.tilemap.Set(x, y, 3, 3);
            }
            else if (!left && up && !right && down)
            {
                this.tilemap.Set(x, y, 5, 2);
            }
            else if (left && !up && right && !down)
            {
                this.tilemap.Set(x, y, 2, 5);
            }
            else if (!left && !up && !right && down)
            {
                this.tilemap.Set(x, y, 5, 1);
            }
            else if (!left && up && !right && !down)
            {
                this.tilemap.Set(x, y, 5, 3);
            }
            else if (!left && !up && right && !down)
            {
                this.tilemap.Set(x, y, 1, 5);
            }
            else if (left && !up && !right && !down)
            {
                this.tilemap.Set(x, y, 3, 5);
            }
            else if (!left && !up && !right && !down)
            {
                this.tilemap.Set(x, y, 5, 5);
            }
        }
        else
        {
            if (down)
                this.tilemap.Set(x, y, 1 + Math.floor(Math.random() * 3), 0);
            if (right)
                this.tilemap.Set(x, y, 0, 1 + Math.floor(Math.random() * 3));
            if (up)
                this.tilemap.Set(x, y, 1 + Math.floor(Math.random() * 3), 4);
            if (left)
                this.tilemap.Set(x, y, 4, 1 + Math.floor(Math.random() * 3));
        }
        
    }

    public Render()
    {
        super.Render();

        Am.context.beginPath();
        Am.context.lineWidth = 1;
        Am.context.strokeStyle = '#ff0000';
        Am.context.rect(Math.floor(Am.mouse.x / 8) * 8, Math.floor(Am.mouse.y / 8) * 8, 8, 8);
        Am.context.stroke();
    }
}