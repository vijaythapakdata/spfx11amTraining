import {sp,ICamlQuery} from "@pnp/sp/presets/all";
import { ILargeListState } from "../webparts/largeList/components/ILargeListState";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export class ServiceClassLargeList{
    constructor(context:WebPartContext){
        sp.setup({
            spfxContext:context as any
        });
    }
    //get list items
    public async getListItems(ListName:string):Promise<ILargeListState[]>{
const _allitems:ILargeListState[]=[];
let position:any;
do{
    const query:ICamlQuery={
        ViewXml:`<View>
        <Query>
        <Where>
        <IsNotNull>
        <FieldRef Name='Title'/>
        
        </IsNotNull>
        </Where>
        </Query>
       
        </View>`,
       


        
    }
    const response =await sp.web.lists.getByTitle(ListName).getItemsByCAMLQuery(query,position);
    console.log(`Fetched ${response.length} items from the list `);
    _allitems.push(...response.map((item:any)=>({
        Title:item.Title,
       
    })));
}
while(position){
    console.log(`fetching more items... ${_allitems.length} items fetched so far`);
    return _allitems;
}
    }
    
}
