document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("apiForm");
  const thankYou = document.getElementById("thankYou");
  const entryList = document.getElementById("entryList");
  const entryIdField = document.getElementById("entryId");

  function showAlert() {
    thankYou.classList.remove("d-none");
    setTimeout(() => thankYou.classList.add("d-none"), 3000);
  }

  function renderEntries(entries) {
    entryList.innerHTML = "";
    entries.forEach(entry => {
      const div = document.createElement("div");
      div.className = "entry p-3 mb-3 border rounded shadow-sm bg-white";
      div.innerHTML = `
        <h5>${entry.name}</h5>
        <p><strong>Email:</strong> ${entry.email}</p>
        <p><strong>Phone:</strong> ${entry.phone}</p>
        <p><strong>Message:</strong> ${entry.message}</p>
        <button class="btn btn-sm btn-warning me-2 edit-btn" data-id="${entry.id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${entry.id}">Delete</button>
      `;
      entryList.appendChild(div);
    });
  }

  function loadEntries() {
    fetch("/api/entries")
      .then(res => res.json())
      .then(renderEntries);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const id = entryIdField.value;

    const entry = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/entries/${id}` : "/api/entries";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    })
      .then(res => res.json())
      .then(data => {
        form.reset();
        entryIdField.value = "";
        loadEntries();
        showAlert();
      });
  });

  entryList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.dataset.id;
      fetch("/api/entries")
        .then(res => res.json())
        .then(entries => {
          const entry = entries.find(e => e.id === id);
          if (entry) {
            form.name.value = entry.name;
            form.email.value = entry.email;
            form.phone.value = entry.phone;
            form.message.value = entry.message;
            entryIdField.value = entry.id;
          }
        });
    }

    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      fetch(`/api/entries/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => {
          loadEntries();
          showAlert();
        });
    }
  });

  loadEntries();
});
