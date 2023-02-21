const defobj = {"parameters":{"paraOne":"getPremium"},"postData":{"contents":JSON.stringify({"name": "Enter Name Here", "age": "2001-01-31", "planSelected": "Life Plus Plan - With Cash Backs", "sumSelected": "17.5m", "termSelected": "10 years"})}};



function doPost(e=defobj){
  
  let paraOneVal = false;
  let basicGetResponse = false;

  paraOneVal =  e.parameters.paraOne;
  paraOneVal = paraOneVal.toString();

  if(paraOneVal==="getPremium"){


  //basicGetResponse = getPremium(JSON.parse(e.postData.contents));
  basicGetResponse = {"def":"obj"}
  

  }else if(paraOneVal==="second"){

   
       
  }else{

    
  }
    
   
    
 basicGetResponse = JSON.stringify(basicGetResponse);
    basicGetResponse = ContentService.createTextOutput(basicGetResponse).setMimeType(ContentService.MimeType.JAVASCRIPT);
   return  basicGetResponse;

}