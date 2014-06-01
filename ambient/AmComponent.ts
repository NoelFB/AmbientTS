/// <reference path="Ambient.ts"/>
/// <reference path="AmEntity.ts"/>
/// <reference path="utils/AmPoint.ts"/>

class AmComponent
{
    public entity:AmEntity;
    public position:AmPoint = new AmPoint(0, 0);
    public active:boolean = true;
    public visible:boolean = true;

    public scenePosition():AmPoint
    {
        if (this.entity == null)
        {
            console.log("no entity");
            return this.position;
        }
        return AmPoint.Add(this.position, this.entity.position);
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