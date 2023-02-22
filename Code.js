const defobj = {"parameters":{"paraOne":"alliancepdf"},"postData":{"contents":JSON.stringify({
   "name": "Ismaili Amir Simba",
   "day": "22-02-2023",
   "policyterm": "25 Years",
   "age": "29",
   "suminsured": "1,000,000",
   "premium": "1,000,000",
   "totalpremium": "1,000,000",
   "revbonus": "1,000,000",
   "termbonus": "1,000,000",
   "totalmatval": "1,000,000",
   "cashback": "1,000,000"
 })}};

const customDateFormater = () =>{
   Date.prototype.toDateInputValue = (function() {
       var local = new Date(this);
       local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
       return local.toJSON();
   });
   const dateVar = new Date().toDateInputValue().toString();
   const year = dateVar.slice(0,4);
   const month = dateVar.slice(5,7);
   const day = dateVar.slice(8,10);
   const hour = dateVar.slice(11,13);
   const minute = dateVar.slice(14,16);
   const second = dateVar.slice(17,23);
   const tzone = dateVar.slice(10,11) + dateVar.slice(23,24);
   const dateVal = {year,month,day,hour,minute,second,tzone};
   return dateVal;
}

 function doPost(e=defobj){
  
  let paraOneVal = false;
  let basicGetResponse = false;

  paraOneVal =  e.parameters.paraOne;
  paraOneVal = paraOneVal.toString();

  if(paraOneVal==="alliancepdf"){
  const vals = JSON.parse(e.postData.contents);
  basicGetResponse =  generatePDF(vals);
  //basicGetResponse = {"def":"obj"}
  }
  
     
   //basicGetResponse = JSON.stringify({"pdf":basicGetResponse});
   basicGetResponse = ContentService.createTextOutput(basicGetResponse).setMimeType(ContentService.MimeType.TEXT);
   return  basicGetResponse;

}

 function generatePDF(entries){
   const date = customDateFormater();
   const file = DriveApp.getFilesByName("pdfgenerator");
   entries = JSON.parse(entries);
   while(file.hasNext()){
      const f = file.next();
      const id = f.getId();
      if(id==="1PKn947Ao1wGlHzNjI_XcrC2PGg5wYzrD9amFIbRCEMk"){
         const newFile = f.makeCopy("alliance"+date.year+"_"+date.month+"_"+date.day+"_"+date.hour+"_"+date.minute+"_"+date.second.replaceAll(".","_"),DriveApp.getFolderById("1wPRtL-bqTnyHr8KFa0aVL7ylPE5quVjq"));
         const doc = DocumentApp.openById(newFile.getId());
         const body = doc.getBody();
         body.replaceText('{today}', date.day+"/"+date.month+"/"+date.year+" "+date.hour+":"+date.minute+":"+date.second);
         body.replaceText('{name}', entries.name);
         body.replaceText('{day}', entries.day);
         body.replaceText('{policyterm}', entries.policyterm);
         body.replaceText('{suminsured}', entries.suminsured);
         body.replaceText('{premium}', entries.premium);
         body.replaceText('{totalpremium}', entries.totalpremium);
         body.replaceText('{revbonus}', entries.revbonus);
         body.replaceText('{termbonus}', entries.termbonus);
         body.replaceText('{totalmatval}', entries.totalmatval);
         body.replaceText('{cashback}', entries.cashback);
         doc.saveAndClose();        
         console.log(entries)
         const blob = doc.getAs("application/pdf");
         const data = Utilities.base64Encode(blob.getBytes());   
         return data;
      }
   }
}