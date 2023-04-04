const defobj = {"parameters":{"paraOne":"alliancepdf"},"postData":{"contents":JSON.stringify(
  JSON.stringify( {
   "name": "Ismaili Amir Simba",
   "dayOfBirth": "22-02-2023",
   "policyTerm": "25 Years",
   "age": "29",
   "sumInsured": "1,000,000",
   "premium": "1,000,000",
   "totalpremium": "1,000,000",
   "revbonus": "1,000,000",
   "termbonus": "1,000,000",
   "totalmatval": "1,000,000",
   "cashback": "1,000,000",
   "cashbackStatus":"cashback",
   "planType":"greee"
 })
 
 )}};

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
   const file = DriveApp.getFilesByName("Alliance Life Assurance Quote v3");
   entries = JSON.parse(entries);
   while(file.hasNext()){
      const f = file.next();
      const id = f.getId();
      if(id==="1ODWtdb9SAd1y0x9UJrOOgcVsZfL_6KoBdNH1bKSSpPo"){
         const newFile = f.makeCopy("alliance"+date.year+"_"+date.month+"_"+date.day+"_"+date.hour+"_"+date.minute+"_"+date.second.replaceAll(".","_"),DriveApp.getFolderById("1wPRtL-bqTnyHr8KFa0aVL7ylPE5quVjq"));
         const doc = DocumentApp.openById(newFile.getId());
         const body = doc.getBody();
         body.replaceText('{dateTime}', date.day+"/"+date.month+"/"+date.year+" "+date.hour+":"+date.minute+":"+date.second);
         body.replaceText('{fullName}', entries.name);
         body.replaceText('{dateOfBirth}', entries.dayOfBirth);
         body.replaceText('{ageNum}', entries.age);
         body.replaceText('{cashbackStatus}', entries.cashbackStatus);
         body.replaceText('{planType}', entries.planType);
         body.replaceText('{policyTermYears}', entries.policyTerm);
         body.replaceText('{sumInsured}', entries.sumInsured);
         body.replaceText('{premiumAmount}', entries.premium);
         body.replaceText('{total}', entries.totalpremium);
         body.replaceText('{revBonus}', entries.revbonus);
         body.replaceText('{termBonus}', entries.termbonus);
         body.replaceText('{maturityVal}', entries.totalmatval);
         body.replaceText('{cashbackAmount}', entries.cashback);
         doc.saveAndClose();        
         const blob = doc.getAs("application/pdf");
         const retObj = {};
         const data = Utilities.base64Encode(blob.getBytes());
         retObj.fileName = newFile.getName();
         retObj.file = getUrlOfThisPdfAl1(data,retObj.fileName);
         console.log(retObj);
         newFile.setTrashed(true);   
         return JSON.stringify(retObj);
      }
   }
}


function getUrlOfThisPdfAl1(data,name){
   // Make a POST request with form data.
const formData = {
  'name': name,
  'data': data
};
const options = {
  'method' : 'post',
  'payload' : formData
};

const response = UrlFetchApp.fetch('https://expresstoo-jzam6yvx3q-ez.a.run.app/alliancepdf1', options);
return response.getContentText();
}
