/* TODO: progress widget or uploading status for every file  */
/* TODO: put hash id on the tr for easy css referencing */
/* TODO: alert when user is leaving a upload */

const table_entries = document.querySelector("#entries");
const table_entries_content = document.querySelector("#entries-content");
const fileinput = document.querySelector("#upload-action");
const csrf = document.querySelector('meta[name="csrf-token"]').content;
const controllers = {};


/* utility funcs */
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

/* BUG: async problem */
fileinput.addEventListener("change", async (ev) => {
  ev.preventDefault();

  const filelist = ev.target.files;
  /* This DOES NOT work on android */
  //const filelist= await window.showOpenFilePicker({multiple:true});
  
  for (const x of filelist) {
    const hash = await hashString(x.name);
    await show_file(x,hash);
    send_file(x,hash);
    
  }
  table_entries.style.display = "block";
  /* clean up array allow upload again canceled files */
  ev.target.value = null;

});


async function show_file(file_obj,hash) {
  const filename = file_obj.name;
  const elem = document.querySelector(`tr > td > div[data-target="${hash}"]`);

  /* don't re-upload again */
  if (elem?.classList.contains("success")) {
    return;
  }

  /* if exists renable it */
  if (elem?.classList.contains("canceled")) {
    elem.classList.add("spinning");
    elem.classList.remove("canceled");
    elem.parentElement.nextElementSibling.classList.remove("canceled-text");
    return;
  }
  /* WARN: unsafe value id for data-target property, consider uuid or hash */
  table_entries_content.innerHTML += `
        <tr>
            <td>
                <div class="spinning" onclick="cancel(this)" data-target="${hash}"></div>
            </td>
            <td class="ellipsis">
                ${filename}
            </td>
        </tr>
        `;
}

async function send_file(file_obj,hash) {
  const form_data = new FormData();
  const filename = file_obj.name;
  /*
    console.log(file_obj)
    const payload= await file_obj.getFile();
    //const uuid=Crypto.randomUUID()
    */
  const controller = new AbortController();
  controllers[hash] = controller;

  form_data.append("file", file_obj);

  // await
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
      const elem = document.querySelector(`[data-target="${hash}"]`);
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
  elem.classList.remove("spinning");
  elem.classList.add("success");
}
function cancel(elem) {
  const id = elem.getAttribute("data-target");
  if (id == null) {
    console.warn("null id");
    return;
  }

  const controller = controllers[id];
  if (controller == null) {
    console.warn("null controller");
    return;
  }
  controller.abort("Canceled by user action");

  elem.getAttribute;
  elem.classList.remove("spinning");
  elem.classList.add("canceled");
  elem.parentElement.nextElementSibling.classList.add("canceled-text");
}

/* TODO: show progress */
