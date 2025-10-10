/* TODO: show progress */
/* TODO: add background upload service */
/* IDEA: change CSS to buttons like windows ui for phone */ 
/* IDEA: idea */

/* global vars */
const table_entries = document.querySelector("#entries");
const table_entries_content = document.querySelector("#entries-content");
const fileinput = document.querySelector("#upload-action");
const csrf = document.querySelector('meta[name="csrf-token"]').content;
const controllers = {};

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
const  escapeHtml= val => {
  return val+""
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const worker=async(queue)=>{
  while( queue.length > 0 ) {
    const file=queue.shift();
    const filename=file.name;
    const hash = cyrb53(filename);
    show_file(file,hash);
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
  const queue=Array.from(filelist);
  /* start 3 worker */
  await Promise.all([
    worker(queue),
    worker(queue),
    worker(queue)
  ]);

  table_entries.style.display = "block";

  /* allow upload again canceled files */
  ev.target.value = null;

});


async function show_file(file,hash) {
  const elem = document.getElementById(hash);
  const filename=file.name;

  if( elem ) return; // already exist
  
  /* create a new entry row */
  const frag=document.createDocumentFragment();
  const tmpl=document.getElementById('row-tmpl');
  const clone=tmpl.content.cloneNode(true);
  const tr=clone.querySelector('tr');
  tr.id=hash;
  clone.querySelector('.filename').textContent=escapeHtml(filename);
  frag.appendChild(clone);
  table_entries_content.appendChild(frag);
    
  table_entries_content.addEventListener('click', e => {
        const tr = e.target.closest('tr');
        if (!tr) return;
        cancel(tr);
    });
}

async function send_file(file,hash) {
  const form_data = new FormData();
  const controller = new AbortController();

  controllers[hash] = controller;
  
  form_data.append("file",file);

  // await ?
  fetch("/api/files.php", {
    method: "POST",
    body: form_data,
    headers: { "X-CSRF-Token": csrf },
    credentials: "same-origin",
    signal: controller.signal,
  })
    .then((resp) => {
      if (!resp.ok) {
        console.log(resp);
        return;
      }
      const elem = document.getElementById( hash );
      success(elem);
    })
    .catch((ex) => {
      console.log(ex);
    })
    .finally(() => {
      delete controller[hash];
    });
}
function success(elem) {
  elem.classList.replace("spinning","success");
}

function cancel(elem) {
  
  if( ! elem.classList.contains('spinning') )
    return;
  
  const controller = controllers[elem.id];
  if (controller == null) {
    console.warn("controller doesn't exists");
    return;
  }
  controller.abort("Canceled by user action");

  elem.remove();
}

