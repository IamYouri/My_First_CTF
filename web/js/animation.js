window.onload = function() {
    animer();
};
function clignoterCurseur(textAnm, val) {
    let cpt = 0;
    active=false;
    let intervalId = setInterval(function(){
        if(active){
            textAnm.style.borderRight="4px solid black";
            active=false;
        }
        else{
            textAnm.style.borderRight="none";
            active=true;
        }
        if (cpt === val) {
            clearInterval(intervalId);
        }
        cpt++;
    }, 400);
}
function animer() {
    console.log("animer");
    let textAnm=document.getElementById('textAnm');
    let textAnm2=document.getElementById('textAnm2');
    let text=" Vous êtes une personne curieuse et motivée ? Passionné par la sécurité informatique ??";
    let text2=" Vous êtes au bon endroit !";
    let text3="Rejoignez-nous ! "
    let i=0;
    let step=0;
    setInterval(function(){

        switch(step){
            case 0:
                
                if(i!=text.length){
                    textAnm.textContent=textAnm.textContent+text[i];
                    i++;
                }else{
                    step=1;
                    i=0;
                    textAnm.style.border="none";
                    textAnm2.style.borderRight="4px solid black";
                }
                break; 
            case 1:

                if(i<text2.length){
                    textAnm2.textContent=textAnm2.textContent+text2[i];
                    i++;
                }else{                    
                        step=2;
                        i=0;  
                }
                break;
            case 2:
                if(i<=text2.length){
                    textAnm2.textContent=text2.slice(0,text2.length-i);
                    i++;
                }else{
                    step=3;
                    i=0;
                }
                break;
            case 3:
                if(i!=text3.length){
                    textAnm2.textContent=textAnm2.textContent+text3[i];
                    i++;
                }else{
                    step=4;
                    clignoterCurseur(textAnm2, -1);
                }
                break;
            
        }
        
            
    },100);
   
}