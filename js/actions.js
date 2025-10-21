/* TODO: show progress */
/* TODO: add background upload service */
/* IDEA: change CSS to buttons like windows ui for phone */ 
/* IDEA: idea */

/* global vars */
const entries = document.querySelector("#entries");
const fileinput = document.querySelector("#upload-action");
const csrf = document.querySelector('meta[name="csrf-token"]').content;
const queue=[];
const requests={};
/* utility funcs */

/* hashing func from GPT (unsafe) */
async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
/* https://stackoverflow.com/a/52171480 */
const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
/* https://stackoverflow.com/a/6234804 */
const escapeHtml= val => {
  return val+""
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};
/* https://stackoverflow.com/a/39914235 */
const delay = ms => new Promise(res => setTimeout(res, ms));

const worker=async(queue)=>{
  while( true ) {
    const file= await queue.shift();

    /* if there is not work today, sleep again */
    if( file == null ){
      await delay(1000);
      continue;
    }

    const filename=file.name;
    const hash = cyrb53(filename);
    await show_file(file,hash);
    await send_file(file,hash);
  }
}

fileinput.addEventListener("change", async (ev) => {
  ev.preventDefault();

  /* DOES NOT work on android */
  //const filelist= await window.showOpenFilePicker({multiple:true});
  
  const filelist = ev.target.files;
  if( filelist.length == 0 ){
    return; // none selected
  }
  Array.from(filelist,(x)=>queue.push(x));

  entries.style.display = "block";

  /* allow upload again canceled files */
  ev.target.value = null;

});


async function show_file(file,hash) {
  const elem = document.getElementById(hash);
  const filename=file.name;

  if( elem ) return; // already exist
  
  /* create a new entry row */
  const frag=document.createDocumentFragment();
  const tmpl=document.getElementById('upload-tmpl');
  const clone=tmpl.content.cloneNode(true);
  const ent=clone.querySelector('tr');
  ent.id=hash;
  clone.querySelector('.filename').textContent=escapeHtml(filename);
  frag.appendChild(clone);
  entries.appendChild(frag);
    
  entries.addEventListener('click', e => {
        const ent = e.target.closest('tr');
        if (!ent) return;
        cancel(ent);
    });
}

async function send_file(file,hash) {
  const xhr=new XMLHttpRequest();
  const form_data = new FormData();
  const elem = document.getElementById(hash);
  
  requests[hash]= xhr;
  form_data.append("file",file);

  xhr.open('POST','/api/files.php');
  xhr.upload.onprogress = event =>{
    if(event.lengthComputable){
      const completed=(event.loaded/event.total)*100;
      elem.querySelector('.progress-text').textContent=`${Math.round(completed)}%`; 
    }
  };
  xhr.onload=(x)=>{
    console.log(xhr);
    console.log(x)
    if(xhr.status === 201 || xhr.status === 200 ){
      console.info('Server respond OK');
      elem.classList.replace('spinning','success');
    }else{
      console.error(`Server returned status ${xhr.status}`);
      cancel(elem);
    }
  };
  xhr.onerror= err=>{
    
    console.error('Conection Error : '+err)
    cancel(elem);
  }
 xhr.send(form_data);
}

function cancel(elem) {
  if( ! requests[elem.id] ){
    console.error('elem has not hash');
    return;
  }
  elem.classList.replace('spinning','canceled');
  requests[elem.id].abort();
  delete requests[elem.id];
  elem.removeAttribute('id');
}

document.addEventListener('DOMContentLoaded',()=>{
  /* Start 3 workers */
  worker(queue);
  worker(queue);
  worker(queue);
})