var accord=document.getElementsByClassName("accordion")

for(var i=0;i<accord.length;i++){
    accord[i].addEventListener("click",function(){
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        var icon=this.querySelector(".icon")
        if (panel.style.display === "block") {
          panel.style.display = "none";
          icon.textContent = "+";
        } else {
          panel.style.display = "block";
          icon.textContent = "-";
        }
    });
}