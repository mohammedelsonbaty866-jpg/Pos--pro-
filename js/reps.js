let reps=JSON.parse(localStorage.getItem("reps"))||[];

function addRep(name,username,password){
  reps.push({id:Date.now(),name,username,password});
  localStorage.setItem("reps",JSON.stringify(reps));
}
