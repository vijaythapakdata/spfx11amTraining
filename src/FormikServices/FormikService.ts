import {Web} from "@pnp/sp/presets/all";

export class FormikClass{
    private web:any;
    constructor(siteurl:string){
        this.web=Web(siteurl);


    }

public async createItems(ListName:string,body:any){
    try{
        let createItems=await this.web.lists.getByTitle(ListName).items.add(body);
        return createItems;
    }
    catch(err){
        console.log("Error in creating items",err);
        throw err;
    }
}
}