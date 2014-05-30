/// <reference path="../../ambient/Ambient.ts"/>
/// <reference path="../../ambient/AmEntity.ts"/>
/// <reference path="../../ambient/components/AmTilemap.ts"/>
/// <reference path="../../ambient/components/AmHitgrid.ts"/>
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

    public GenerateTiles()
    {
        for (var i = 0; i < this.collider.columns; i ++)
        {
            for (var j = 0; j < this.collider.rows; j ++)
            {
                if (this.collider.Get(i, j))
                {
                    var up:boolean = this.collider.Get(i, j - 1);
                    var right:boolean = this.collider.Get(i + 1, j);
                    var left:boolean = this.collider.Get(i - 1, j);
                    var down:boolean = this.collider.Get(i, j + 1);

                    if (left && up && down && right)
                    {
                        this.tilemap.Set(i, j, 2, 2);
                    }
                    else if (left && !up && right && down)
                    {
                        this.tilemap.Set(i, j - 1, 2, 0);
                        this.tilemap.Set(i, j, 2, 1);
                    }
                    else if (left && up && right && !down)
                    {
                        this.tilemap.Set(i, j, 2, 3);
                        this.tilemap.Set(i, j + 1, 2, 4);
                    }
                    else if (!left && up && right && down)
                    {
                        this.tilemap.Set(i - 1, j, 0, 2);
                        this.tilemap.Set(i, j, 1, 2);
                    }
                    else if (left && up && !right && down)
                    {
                        this.tilemap.Set(i, j, 3, 2);
                        this.tilemap.Set(i + 1, j, 4, 2);
                    }
                    else if (!left && !up && right && down)
                    {
                        this.tilemap.Set(i - 1, j - 1, 0, 0);
                        this.tilemap.Set(i, j - 1, 1, 0);
                        this.tilemap.Set(i - 1, j, 0, 1);
                        this.tilemap.Set(i, j, 1, 1);
                    }
                    else if (left && !up && !right && down)
                    {
                        this.tilemap.Set(i, j - 1, 3, 0);
                        this.tilemap.Set(i + 1, j - 1, 4, 0);
                        this.tilemap.Set(i, j, 3, 1);
                        this.tilemap.Set(i + 1, j, 4, 1);
                    }
                    else if (!left && up && right && !down)
                    {
                        this.tilemap.Set(i - 1, j, 0, 3);
                        this.tilemap.Set(i, j, 1, 3);
                        this.tilemap.Set(i - 1, j + 1, 0, 4);
                        this.tilemap.Set(i, j + 1, 1, 4);
                    }
                    else if (left && up && !right && !down)
                    {
                        this.tilemap.Set(i, j, 3, 3);
                        this.tilemap.Set(i + 1, j, 4, 3);
                        this.tilemap.Set(i, j + 1, 3, 4);
                        this.tilemap.Set(i + 1, j, 4, 4);
                    }
                }
            }
        }
    }
}