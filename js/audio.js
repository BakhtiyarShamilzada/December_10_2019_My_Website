 // audio

 let items = document.querySelectorAll('.roundy-blog-item-short-content');
 for (const item of items) 
 {
   item.addEventListener('click', function()
   {
     this.lastElementChild.play();
   })
 }
