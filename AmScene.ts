/// <reference path="AmEntity.ts"/>
/// <reference path="components/AmCollider.ts"/>

class AmScene
{

    public entities:Array<AmEntity> = new Array<AmEntity>();
    private adding:Array<AmEntity> = new Array<AmEntity>();
    private removing:Array<AmEntity> = new Array<AmEntity>();

    // dictionary of list of colliders by tag
    public colliders:{ [tag:string]:Array<AmCollider>; } = {};

    constructor()
    {

    }

    public Start()
    {

    }

    public End()
    {

    }

    public Add(entity:AmEntity):AmEntity
    {
        this.adding.push(entity);
        return entity;
    }

    public Remove(entity:AmEntity):AmEntity
    {
        this.removing.push(entity);
        return entity;
    }

    public SetColliderTag(collider:AmCollider, prev:string, next:string)
    {
        if (prev != "")
        {
            var list:Array<AmCollider> = this.colliders[prev];
            for (var i = 0; i < list.length; i ++)
            {
                if (list[i] == collider)
                {
                    list.splice(i, 1);
                    break;
                }
            }

            this.colliders[prev] = list;
        }

        if (next != "")
        {
            if (this.colliders[next] == null)
                this.colliders[next] = new Array<AmCollider>();
            this.colliders[next].push(collider);
        }
    }

    public Update()
    {
        // remove entities
        for (var i = 0; i < this.removing.length; i ++)
        {
            for (var j = 0; j < this.entities.length; j ++)
            {
                if (this.entities[j] == this.removing[i])
                {
                    this.entities.splice(i, 1);
                    break;
                }
            }

            this.removing[i].End();
            this.removing[i].scene = null;
        }

        this.removing = new Array<AmEntity>();

        // add entities
        for (var i = 0; i < this.adding.length; i ++)
        {
            this.entities.push(this.adding[i]);
            this.adding[i].scene = this;
            this.adding[i].Start();
        }

        this.adding = new Array<AmEntity>();

        // sort active entities
        this.SortEntitiesByDepth(this.entities);

        // update entities
        for (var i = 0; i < this.entities.length; i ++)
        {
            if (this.entities[i].active)
                this.entities[i].Update();
        }
    }

    public Render()
    {
        // render entities
        for (var i = 0; i < this.entities.length; i ++)
        {
            if (this.entities[i].visible)
                this.entities[i].Render();
        }
    }

    public SortEntitiesByDepth(entities:Array<AmEntity>)
    {
        var i:number, j:number, increment:number;
        var temp:AmEntity;
        increment = 3;

        while (increment > 0)
        {
            for (i = 0; i < entities.length; i ++)
            {
                j = i;
                temp = entities[i];

                while ((j >= increment) && (entities[j - increment].depth < temp.depth))
                {
                    entities[j] = entities[j - increment];
                    j = j - increment;
                }

                entities[j] = temp;
            }

            if (Math.floor(increment / 2) != 0)
            {
                increment = Math.floor(increment / 2);
            }
            else if (Math.floor(increment) == 1)
            {
                increment = 0;
            }
            else
            {
                increment = 1;
            }
        }
    }
}
